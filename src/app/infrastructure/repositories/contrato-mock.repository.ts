import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError, tap } from 'rxjs';
import { Contrato } from '../../core/domain/models/contrato';
import { ContratoFiltros, ContratoPaginado } from '../../core/domain/models/contrato';
import { ContratoRepository } from '../../core/domain/ports/contrato.repository';
import { EstadoContrato, TipoContrato, Moneda } from '../../core/domain/models/contrato';
import { calcularDiasParaVencer, obtenerEstadoPorVencimiento, generarCodigoContrato } from '../../core/domain/models/contrato';

const CONTRATOS_INICIALES: Contrato[] = [
  {
    id: '1',
    codigo: 'CTR-2026-0001',
    titulo: 'Contrato de servicios de consultoría TI',
    objeto: 'Prestación de servicios profesionales de consultoría en transformación digital',
    tipo: TipoContrato.CONSULTORIA,
    contratista: { id: 'c1', identificacion: '900123456-1', nombre: 'Tech Solutions SAS', contacto: 'Carlos Pérez', email: 'carlos@techsolutions.com' },
    areaId: 'a1',
    area: { id: 'a1', nombre: 'Tecnología', descripcion: 'Área de tecnología e innovación' },
    responsableId: 'u1',
    responsable: { id: 'u1', nombre: 'María González', usuario: 'maria.gonzalez', areaId: 'a1' },
    fechaInicio: '2026-01-15',
    fechaFin: '2026-12-15',
    valor: 150000000,
    moneda: Moneda.COP,
    estado: EstadoContrato.VIGENTE,
    descripcion: 'Contrato marco para servicios de consultoría durante 2026',
    creadoPor: 'admin@demo.com',
    creadoEn: '2026-01-10T10:00:00Z',
    diasParaVencer: 85,
  },
  {
    id: '2',
    codigo: 'CTR-2026-0002',
    titulo: 'Suministro de equipos de cómputo',
    objeto: 'Adquisición de 50 laptops y accesorios para el personal administrativo',
    tipo: TipoContrato.SUMINISTROS,
    contratista: { id: 'c2', identificacion: '800987654-2', nombre: 'Equipos y Redes Ltda', contacto: 'Ana Rodríguez', email: 'ana@equiposredes.com' },
    areaId: 'a2',
    area: { id: 'a2', nombre: 'Administración', descripcion: 'Área administrativa y financiera' },
    responsableId: 'u2',
    responsable: { id: 'u2', nombre: 'Juan Martínez', usuario: 'juan.martinez', areaId: 'a2' },
    fechaInicio: '2026-03-01',
    fechaFin: '2026-06-30',
    valor: 450000000,
    moneda: Moneda.COP,
    estado: EstadoContrato.POR_VENCER,
    descripcion: 'Renovación de parque tecnológico',
    creadoPor: 'gestor@demo.com',
    creadoEn: '2026-02-20T09:30:00Z',
    diasParaVencer: 45,
  },
  {
    id: '3',
    codigo: 'CTR-2026-0003',
    titulo: 'Mantenimiento de infraestructura de red',
    objeto: 'Servicio de mantenimiento preventivo y correctivo de la red corporativa',
    tipo: TipoContrato.SERVICIOS,
    contratista: { id: 'c3', identificacion: '900555777-3', nombre: 'Redes Avanzadas SA', contacto: 'Luis Herrera', email: 'luis@redesavanzadas.com' },
    areaId: 'a1',
    area: { id: 'a1', nombre: 'Tecnología', descripcion: 'Área de tecnología e innovación' },
    responsableId: 'u1',
    responsable: { id: 'u1', nombre: 'María González', usuario: 'maria.gonzalez', areaId: 'a1' },
    fechaInicio: '2025-07-01',
    fechaFin: '2025-12-31',
    valor: 80000000,
    moneda: Moneda.COP,
    estado: EstadoContrato.VENCIDO,
    descripcion: 'Contrato vencido, pendiente de renovación',
    creadoPor: 'admin@demo.com',
    creadoEn: '2025-06-15T14:00:00Z',
    diasParaVencer: -90,
  },
  {
    id: '4',
    codigo: 'CTR-2026-0004',
    titulo: 'Arrendamiento de oficinas sede principal',
    objeto: 'Contrato de arrendamiento de inmueble para sede administrativa',
    tipo: TipoContrato.ARRENDAMIENTO,
    contratista: { id: 'c4', identificacion: '800111222-4', nombre: 'Inmobiliaria Centro SA', contacto: 'Patricia López', email: 'patricia@inmocentro.com' },
    areaId: 'a2',
    area: { id: 'a2', nombre: 'Administración', descripcion: 'Área administrativa y financiera' },
    responsableId: 'u2',
    responsable: { id: 'u2', nombre: 'Juan Martínez', usuario: 'juan.martinez', areaId: 'a2' },
    fechaInicio: '2026-01-01',
    fechaFin: '2028-12-31',
    valor: 120000000,
    moneda: Moneda.COP,
    estado: EstadoContrato.VIGENTE,
    descripcion: 'Arrendamiento a 3 años con cláusula de actualización IPC',
    creadoPor: 'gestor@demo.com',
    creadoEn: '2025-12-01T11:00:00Z',
    diasParaVencer: 1000,
  },
  {
    id: '5',
    codigo: 'CTR-2026-0005',
    titulo: 'Desarrollo de aplicación móvil',
    objeto: 'Diseño y desarrollo de app móvil para gestión de trámites ciudadanos',
    tipo: TipoContrato.OBRAS,
    contratista: { id: 'c5', identificacion: '900999888-5', nombre: 'Digital Factory SAS', contacto: 'Sofía Vargas', email: 'sofia@digitalfactory.com' },
    areaId: 'a1',
    area: { id: 'a1', nombre: 'Tecnología', descripcion: 'Área de tecnología e innovación' },
    responsableId: 'u1',
    responsable: { id: 'u1', nombre: 'María González', usuario: 'maria.gonzalez', areaId: 'a1' },
    fechaInicio: '2026-04-01',
    fechaFin: '2026-09-30',
    valor: 320000000,
    moneda: Moneda.COP,
    estado: EstadoContrato.BORRADOR,
    descripcion: 'Proyecto en fase de aprobación',
    creadoPor: 'gestor@demo.com',
    creadoEn: '2026-03-15T16:30:00Z',
    diasParaVencer: 180,
  },
];

@Injectable()
export class ContratoMockRepository extends ContratoRepository {
  private contratos = [...CONTRATOS_INICIALES];

  private aplicarFiltros(contratos: Contrato[], filtros: ContratoFiltros): Contrato[] {
    let resultado = contratos.filter(c => !c.eliminado);

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(c =>
        c.codigo.toLowerCase().includes(busqueda) ||
        c.titulo.toLowerCase().includes(busqueda) ||
        c.contratista.nombre.toLowerCase().includes(busqueda) ||
        c.objeto.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.estado) resultado = resultado.filter(c => c.estado === filtros.estado);
    if (filtros.tipo) resultado = resultado.filter(c => c.tipo === filtros.tipo);
    if (filtros.areaId) resultado = resultado.filter(c => c.areaId === filtros.areaId);
    if (filtros.responsableId) resultado = resultado.filter(c => c.responsableId === filtros.responsableId);
    if (filtros.fechaInicioDesde) resultado = resultado.filter(c => c.fechaInicio >= filtros.fechaInicioDesde!);
    if (filtros.fechaInicioHasta) resultado = resultado.filter(c => c.fechaInicio <= filtros.fechaInicioHasta!);
    if (filtros.fechaFinDesde) resultado = resultado.filter(c => c.fechaFin >= filtros.fechaFinDesde!);
    if (filtros.fechaFinHasta) resultado = resultado.filter(c => c.fechaFin <= filtros.fechaFinHasta!);

    const sortBy = filtros.sortBy || 'creadoEn';
    const sortDir = filtros.sortDir || 'desc';
    resultado.sort((a, b) => {
      const va = (a as any)[sortBy];
      const vb = (b as any)[sortBy];
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return resultado;
  }

  private paginar(contratos: Contrato[], page = 0, size = 10): ContratoPaginado {
    const inicio = page * size;
    const fin = inicio + size;
    return {
      contenido: contratos.slice(inicio, fin),
      totalElementos: contratos.length,
      totalPaginas: Math.ceil(contratos.length / size),
      paginaActual: page,
      tamanoPagina: size,
    };
  }

  private recalcular(contrato: Contrato): Contrato {
    return {
      ...contrato,
      diasParaVencer: calcularDiasParaVencer(contrato.fechaFin),
      estado: obtenerEstadoPorVencimiento(contrato.fechaFin, contrato.estado),
    };
  }

  crear(contrato: Contrato): Observable<Contrato> {
    const existe = this.contratos.some(c => c.codigo === contrato.codigo);
    if (existe) {
      return throwError(() => new Error('El código de contrato ya existe.')).pipe(delay(300));
    }
    const nuevo = this.recalcular({ ...contrato, id: crypto.randomUUID() });
    this.contratos.unshift(nuevo);
    return of(nuevo).pipe(delay(500));
  }

  obtenerPorId(id: string): Observable<Contrato | null> {
    const contrato = this.contratos.find(c => c.id === id && !c.eliminado);
    return of(contrato ? this.recalcular({ ...contrato }) : null).pipe(delay(200));
  }

  listar(filtros: ContratoFiltros = {}): Observable<ContratoPaginado> {
    const filtrados = this.aplicarFiltros(this.contratos, filtros);
    const paginado = this.paginar(filtrados, filtros.page || 0, filtros.size || 10);
    paginado.contenido = paginado.contenido.map(c => this.recalcular({ ...c }));
    return of(paginado).pipe(delay(400));
  }

  actualizar(id: string, cambios: Partial<Contrato>): Observable<Contrato> {
    const idx = this.contratos.findIndex(c => c.id === id);
    if (idx === -1) return throwError(() => new Error('Contrato no encontrado')).pipe(delay(200));

    if (cambios.codigo && cambios.codigo !== this.contratos[idx].codigo) {
      const existe = this.contratos.some((c, i) => i !== idx && c.codigo === cambios.codigo);
      if (existe) return throwError(() => new Error('El código de contrato ya existe.')).pipe(delay(300));
    }

    const actualizado = this.recalcular({ ...this.contratos[idx], ...cambios, id });
    this.contratos[idx] = actualizado;
    return of(actualizado).pipe(delay(400));
  }

  eliminar(id: string): Observable<void> {
    const idx = this.contratos.findIndex(c => c.id === id);
    if (idx === -1) return throwError(() => new Error('Contrato no encontrado')).pipe(delay(200));

    this.contratos[idx] = { ...this.contratos[idx], eliminado: true, eliminadoEn: new Date().toISOString() };
    return of(void 0).pipe(delay(300));
  }

  obtenerEstadisticas(): Observable<{
    total: number;
    porEstado: Record<string, number>;
    porVencer: number;
    vencidos: number;
  }> {
    const activos = this.contratos.filter(c => !c.eliminado);
    const porEstado: Record<string, number> = {};
    let porVencer = 0;
    let vencidos = 0;

    activos.forEach(c => {
      const recalculado = this.recalcular(c);
      porEstado[recalculado.estado] = (porEstado[recalculado.estado] || 0) + 1;
      if (recalculado.estado === EstadoContrato.POR_VENCER) porVencer++;
      if (recalculado.estado === EstadoContrato.VENCIDO) vencidos++;
    });

    return of({
      total: activos.length,
      porEstado,
      porVencer,
      vencidos,
    }).pipe(delay(200));
  }
}