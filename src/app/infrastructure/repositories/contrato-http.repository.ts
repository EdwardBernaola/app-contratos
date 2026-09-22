import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contrato } from '../../core/domain/models/contrato';
import { ContratoFiltros, ContratoPaginado } from '../../core/domain/models/contrato';
import { ContratoRepository } from '../../core/domain/ports/contrato.repository';
import { environment } from '../config/environment';

@Injectable()
export class ContratoHttpRepository extends ContratoRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/contratos`;

  crear(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(this.baseUrl, contrato);
  }

  obtenerPorId(id: string): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.baseUrl}/${id}`);
  }

  listar(filtros: ContratoFiltros = {}): Observable<ContratoPaginado> {
    const params: Record<string, string> = {};
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params[k] = String(v);
    });
    return this.http.get<ContratoPaginado>(this.baseUrl, { params });
  }

  actualizar(id: string, contrato: Partial<Contrato>): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.baseUrl}/${id}`, contrato);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  obtenerEstadisticas(): Observable<{
    total: number;
    porEstado: Record<string, number>;
    porVencer: number;
    vencidos: number;
  }> {
    return this.http.get<{
      total: number;
      porEstado: Record<string, number>;
      porVencer: number;
      vencidos: number;
    }>(`${this.baseUrl}/estadisticas`);
  }
}