import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { ArchivoAdjunto, ArchivoSubida } from '../../core/domain/models/archivo-adjunto';
import { DocumentoRepository } from '../../core/domain/ports/documento.repository';

const ARCHIVOS_INICIALES: ArchivoAdjunto[] = [
  {
    id: 'd1',
    contratoId: '1',
    nombre: 'CTR-2026-0001_Contrato_Consultoria_TI.pdf',
    nombreOriginal: 'Contrato_Consultoria_TI.pdf',
    tipoMime: 'application/pdf',
    extension: 'pdf',
    tamano: 2457600,
    ruta: 'mock://archivos/1/d1.pdf',
    cargadoPor: 'admin@demo.com',
    cargadoEn: '2026-01-15T10:00:00Z',
  },
  {
    id: 'd2',
    contratoId: '1',
    nombre: 'CTR-2026-0001_Anexo_Tecnico.docx',
    nombreOriginal: 'Anexo_Tecnico.docx',
    tipoMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx',
    tamano: 512000,
    ruta: 'mock://archivos/1/d2.docx',
    cargadoPor: 'admin@demo.com',
    cargadoEn: '2026-01-20T14:30:00Z',
  },
  {
    id: 'd3',
    contratoId: '2',
    nombre: 'CTR-2026-0002_Especificaciones_Tecnicas.pdf',
    nombreOriginal: 'Especificaciones_Tecnicas.pdf',
    tipoMime: 'application/pdf',
    extension: 'pdf',
    tamano: 1024000,
    ruta: 'mock://archivos/2/d3.pdf',
    cargadoPor: 'gestor@demo.com',
    cargadoEn: '2026-03-05T09:00:00Z',
  },
];

@Injectable()
export class DocumentoMockRepository extends DocumentoRepository {
  private archivos = [...ARCHIVOS_INICIALES];

  subir(subida: ArchivoSubida): Observable<ArchivoAdjunto> {
    if (subida.resultado) {
      this.archivos.unshift(subida.resultado);
      return of(subida.resultado).pipe(delay(800));
    }
    const nuevo: ArchivoAdjunto = {
      id: crypto.randomUUID(),
      contratoId: subida.contratoId,
      nombre: subida.archivo.name,
      nombreOriginal: subida.archivo.name,
      tipoMime: subida.archivo.type,
      extension: subida.archivo.name.split('.').pop()?.toLowerCase() || '',
      tamano: subida.archivo.size,
      ruta: `mock://archivos/${subida.contratoId}/${crypto.randomUUID()}`,
      cargadoPor: 'usuario@demo.com',
      cargadoEn: new Date().toISOString(),
    };
    this.archivos.unshift(nuevo);
    return of(nuevo).pipe(delay(1000));
  }

  listarPorContrato(contratoId: string): Observable<ArchivoAdjunto[]> {
    const resultado = this.archivos
      .filter(a => a.contratoId === contratoId && !a.eliminado)
      .sort((a, b) => new Date(b.cargadoEn).getTime() - new Date(a.cargadoEn).getTime());
    return of(resultado).pipe(delay(300));
  }

  descargar(archivoId: string): Observable<Blob> {
    const archivo = this.archivos.find(a => a.id === archivoId);
    if (!archivo) return throwError(() => new Error('Archivo no encontrado')).pipe(delay(200));

    const contenido = `Contenido simulado del archivo: ${archivo.nombreOriginal}\nContrato: ${archivo.contratoId}\nCargado por: ${archivo.cargadoPor}\nFecha: ${archivo.cargadoEn}`;
    const blob = new Blob([contenido], { type: archivo.tipoMime || 'application/octet-stream' });
    return of(blob).pipe(delay(500));
  }

  eliminar(archivoId: string): Observable<void> {
    const idx = this.archivos.findIndex(a => a.id === archivoId);
    if (idx === -1) return throwError(() => new Error('Archivo no encontrado')).pipe(delay(200));

    this.archivos[idx] = { ...this.archivos[idx], eliminado: true, eliminadoEn: new Date().toISOString() };
    return of(void 0).pipe(delay(300));
  }
}