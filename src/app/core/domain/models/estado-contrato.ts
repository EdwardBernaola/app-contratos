export enum EstadoContrato {
  BORRADOR = 'BORRADOR',
  VIGENTE = 'VIGENTE',
  POR_VENCER = 'POR_VENCER',
  VENCIDO = 'VENCIDO',
  TERMINADO = 'TERMINADO',
  LIQUIDADO = 'LIQUIDADO',
}

export const ESTADOS_CONTRATO: { valor: EstadoContrato; etiqueta: string; color: 'primary' | 'accent' | 'warn' | 'basic' }[] = [
  { valor: EstadoContrato.BORRADOR, etiqueta: 'Borrador', color: 'basic' },
  { valor: EstadoContrato.VIGENTE, etiqueta: 'Vigente', color: 'primary' },
  { valor: EstadoContrato.POR_VENCER, etiqueta: 'Por vencer', color: 'warn' },
  { valor: EstadoContrato.VENCIDO, etiqueta: 'Vencido', color: 'warn' },
  { valor: EstadoContrato.TERMINADO, etiqueta: 'Terminado', color: 'accent' },
  { valor: EstadoContrato.LIQUIDADO, etiqueta: 'Liquidado', color: 'basic' },
];

export function obtenerEstadoPorVencimiento(fechaFin: string, estadoActual: EstadoContrato): EstadoContrato {
  if ([EstadoContrato.TERMINADO, EstadoContrato.LIQUIDADO, EstadoContrato.BORRADOR].includes(estadoActual)) {
    return estadoActual;
  }
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(fechaFin);
  fin.setHours(0, 0, 0, 0);
  const diffDias = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDias < 0) return EstadoContrato.VENCIDO;
  if (diffDias <= 30) return EstadoContrato.POR_VENCER;
  return EstadoContrato.VIGENTE;
}