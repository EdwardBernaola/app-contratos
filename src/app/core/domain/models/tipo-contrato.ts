export enum TipoContrato {
  SERVICIOS = 'SERVICIOS',
  SUMINISTROS = 'SUMINISTROS',
  OBRAS = 'OBRAS',
  CONSULTORIA = 'CONSULTORIA',
  ARRENDAMIENTO = 'ARRENDAMIENTO',
  OTRO = 'OTRO',
}

export const TIPOS_CONTRATO: { valor: TipoContrato; etiqueta: string }[] = [
  { valor: TipoContrato.SERVICIOS, etiqueta: 'Servicios' },
  { valor: TipoContrato.SUMINISTROS, etiqueta: 'Suministros' },
  { valor: TipoContrato.OBRAS, etiqueta: 'Obras' },
  { valor: TipoContrato.CONSULTORIA, etiqueta: 'Consultoría' },
  { valor: TipoContrato.ARRENDAMIENTO, etiqueta: 'Arrendamiento' },
  { valor: TipoContrato.OTRO, etiqueta: 'Otro' },
];