import { inject, Injectable } from '@angular/core';
import { Observable, of, tap, delay, throwError } from 'rxjs';
import { ArchivoAdjunto, ArchivoSubida, validarArchivo } from '../../domain/models/archivo-adjunto';
import { DocumentoRepository } from '../../domain/ports/documento.repository';
import { AuthSessionService } from '../auth-session.service';

@Injectable({ providedIn: 'root' })
export class DocumentoUseCases {
  private readonly repo = inject(DocumentoRepository);
  private readonly session = inject(AuthSessionService);

  subir(archivo: ArchivoSubida): Observable<ArchivoAdjunto> {
    const validacion = validarArchivo(archivo.archivo);
    if (!validacion.valido) {
      return throwError(() => new Error(validacion.error)).pipe(delay(200));
    }

    const usuario = this.session.usuario();
    const ahora = new Date().toISOString();

    const nuevo: ArchivoAdjunto = {
      id: crypto.randomUUID(),
      contratoId: archivo.contratoId,
      nombre: archivo.archivo.name,
      nombreOriginal: archivo.archivo.name,
      tipoMime: archivo.archivo.type,
      extension: archivo.archivo.name.split('.').pop()?.toLowerCase() || '',
      tamano: archivo.archivo.size,
      ruta: `mock://archivos/${archivo.contratoId}/${crypto.randomUUID()}`,
      cargadoPor: usuario?.usuario || 'sistema',
      cargadoEn: ahora,
    };

    return this.repo.subir({ ...archivo, resultado: nuevo }).pipe(
      delay(1000),
      tap(() => {}),
    );
  }

  listarPorContrato(contratoId: string): Observable<ArchivoAdjunto[]> {
    return this.repo.listarPorContrato(contratoId);
  }

  descargar(archivoId: string): Observable<Blob> {
    return this.repo.descargar(archivoId);
  }

  eliminar(archivoId: string): Observable<void> {
    return this.repo.eliminar(archivoId);
  }
}