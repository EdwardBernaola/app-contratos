import { EstadoContrato, ESTADOS_CONTRATO, obtenerEstadoPorVencimiento } from './estado-contrato';
import { TipoContrato, TIPOS_CONTRATO } from './tipo-contrato';
import { Moneda, MONEDAS } from './moneda';

export { EstadoContrato, ESTADOS_CONTRATO, obtenerEstadoPorVencimiento };
export { TipoContrato, TIPOS_CONTRATO };
export { Moneda, MONEDAS };

export interface Contratista {
  id?: string;
  identificacion: string;
  nombre: string;
  contacto?: string;
  email?: string;
  telefono?: string;
}

export interface Area {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Responsable {
  id: string;
  nombre: string;
  usuario: string;
  areaId: string;
}

export interface Contrato {
  id: string;
  codigo: string;
  titulo: string;
  objeto: string;
  tipo: TipoContrato;
  contratista: Contratista;
  areaId: string;
  area?: Area;
  responsableId: string;
  responsable?: Responsable;
  fechaInicio: string;
  fechaFin: string;
  valor: number;
  moneda: Moneda;
  estado: EstadoContrato;
  descripcion?: string;
  diasParaVencer?: number;
  creadoPor: string;
  creadoEn: string;
  actualizadoPor?: string;
  actualizadoEn?: string;
  eliminado?: boolean;
  eliminadoEn?: string;
}

export interface ContratoFiltros {
  busqueda?: string;
  estado?: EstadoContrato;
  tipo?: TipoContrato;
  areaId?: string;
  responsableId?: string;
  fechaInicioDesde?: string;
  fechaInicioHasta?: string;
  fechaFinDesde?: string;
  fechaFinHasta?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ContratoPaginado {
  contenido: Contrato[];
  totalElementos: number;
  totalPaginas: number;
  paginaActual: number;
  tamanoPagina: number;
}

export function calcularDiasParaVencer(fechaFin: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(fechaFin);
  fin.setHours(0, 0, 0, 0);
  return Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

export function generarCodigoContrato(): string {
  const anio = new Date().getFullYear();
  const aleatorio = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CTR-${anio}-${aleatorio}`;
}