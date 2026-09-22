import { inject, Injectable } from '@angular/core';
import { Observable, of, tap, delay, throwError, map } from 'rxjs';
import { Contrato } from '../../domain/models/contrato';
import { ContratoFiltros, ContratoPaginado } from '../../domain/models/contrato';
import { ContratoRepository } from '../../domain/ports/contrato.repository';
import { AuthSessionService } from '../auth-session.service';
import { generarCodigoContrato, calcularDiasParaVencer, obtenerEstadoPorVencimiento } from '../../domain/models/contrato';

@Injectable({ providedIn: 'root' })
export class ContratoUseCases {
  private readonly repo = inject(ContratoRepository);
  private readonly session = inject(AuthSessionService);

  crear(contrato: Contrato): Observable<Contrato> {
    const usuario = this.session.usuario();
    const ahora = new Date().toISOString();

    const nuevo: Contrato = {
      ...contrato,
      id: contrato.id || crypto.randomUUID(),
      codigo: contrato.codigo || generarCodigoContrato(),
      diasParaVencer: calcularDiasParaVencer(contrato.fechaFin),
      estado: contrato.estado || 'BORRADOR',
      creadoPor: usuario?.usuario || 'sistema',
      creadoEn: ahora,
    };

    nuevo.estado = obtenerEstadoPorVencimiento(nuevo.fechaFin, nuevo.estado);

    return this.repo.crear(nuevo).pipe(
      tap(c => (c.diasParaVencer = calcularDiasParaVencer(c.fechaFin))),
    );
  }

  listar(filtros: ContratoFiltros = {}): Observable<ContratoPaginado> {
    return this.repo.listar(filtros).pipe(
      tap(res => {
        res.contenido.forEach(c => {
          c.diasParaVencer = calcularDiasParaVencer(c.fechaFin);
          c.estado = obtenerEstadoPorVencimiento(c.fechaFin, c.estado);
        });
      }),
    );
  }

  obtenerPorId(id: string): Observable<Contrato | null> {
    return this.repo.obtenerPorId(id).pipe(
      tap(c => {
        if (c) {
          c.diasParaVencer = calcularDiasParaVencer(c.fechaFin);
          c.estado = obtenerEstadoPorVencimiento(c.fechaFin, c.estado);
        }
      }),
    );
  }

  actualizar(id: string, cambios: Partial<Contrato>): Observable<Contrato> {
    const usuario = this.session.usuario();
    const ahora = new Date().toISOString();

    const actualizacion = {
      ...cambios,
      actualizadoPor: usuario?.usuario || 'sistema',
      actualizadoEn: ahora,
    };

    if (cambios.fechaFin) {
      actualizacion.diasParaVencer = calcularDiasParaVencer(cambios.fechaFin);
    }

    return this.repo.actualizar(id, actualizacion).pipe(
      tap(c => {
        c.diasParaVencer = calcularDiasParaVencer(c.fechaFin);
        c.estado = obtenerEstadoPorVencimiento(c.fechaFin, c.estado);
      }),
    );
  }

  eliminar(id: string): Observable<void> {
    return this.repo.eliminar(id);
  }

  obtenerEstadisticas(): Observable<{
    total: number;
    porEstado: Record<string, number>;
    porVencer: number;
    vencidos: number;
  }> {
    return this.repo.obtenerEstadisticas();
  }

  validarFechas(fechaInicio: string, fechaFin: string): { valido: boolean; error?: string } {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    if (fin <= inicio) {
      return { valido: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio.' };
    }
    return { valido: true };
  }

  validarCodigoUnico(codigo: string, excluirId?: string): Observable<{ valido: boolean }> {
    return this.repo.listar({ busqueda: codigo, size: 1 }).pipe(
      delay(300),
      map(res => {
        const existe = res.contenido.some(c => c.codigo === codigo && c.id !== excluirId);
        if (existe) {
          throw new Error('El código de contrato ya existe.');
        }
        return { valido: true };
      }),
    );
  }
}