export interface ArchivoAdjunto {
  id: string;
  contratoId: string;
  nombre: string;
  nombreOriginal: string;
  tipoMime: string;
  extension: string;
  tamano: number;
  ruta: string;
  cargadoPor: string;
  cargadoEn: string;
  eliminado?: boolean;
  eliminadoEn?: string;
}

export interface ArchivoSubida {
  archivo: File;
  contratoId: string;
  progreso?: number;
  estado?: 'pendiente' | 'subiendo' | 'completado' | 'error';
  error?: string;
  resultado?: ArchivoAdjunto;
}

export const TIPOS_ARCHIVO_PERMITIDOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
];

export const TAMANO_MAXIMO_ARCHIVO = 25 * 1024 * 1024; // 25 MB

export function validarArchivo(archivo: File): { valido: boolean; error?: string } {
  if (!TIPOS_ARCHIVO_PERMITIDOS.includes(archivo.type)) {
    return { valido: false, error: 'Tipo de archivo no permitido. Use PDF, DOCX, XLSX o imágenes.' };
  }
  if (archivo.size > TAMANO_MAXIMO_ARCHIVO) {
    return { valido: false, error: `El archivo supera el tamaño máximo de ${TAMANO_MAXIMO_ARCHIVO / (1024 * 1024)} MB.` };
  }
  if (archivo.size === 0) {
    return { valido: false, error: 'El archivo está vacío.' };
  }
  return { valido: true };
}

export function obtenerExtension(nombre: string): string {
  const partes = nombre.split('.');
  return partes.length > 1 ? partes.pop()!.toLowerCase() : '';
}

export function formatearTamano(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const tamaños = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamaños[i];
}

export function esPrevisualizable(tipoMime: string): boolean {
  return tipoMime.startsWith('image/') || tipoMime === 'application/pdf';
}