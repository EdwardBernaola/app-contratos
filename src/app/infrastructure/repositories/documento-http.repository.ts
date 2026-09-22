import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArchivoAdjunto, ArchivoSubida } from '../../core/domain/models/archivo-adjunto';
import { DocumentoRepository } from '../../core/domain/ports/documento.repository';
import { environment } from '../config/environment';

@Injectable()
export class DocumentoHttpRepository extends DocumentoRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/documentos`;

  subir(subida: ArchivoSubida): Observable<ArchivoAdjunto> {
    const formData = new FormData();
    formData.append('archivo', subida.archivo);
    formData.append('contratoId', subida.contratoId);
    return this.http.post<ArchivoAdjunto>(`${this.baseUrl}/subir`, formData);
  }

  listarPorContrato(contratoId: string): Observable<ArchivoAdjunto[]> {
    return this.http.get<ArchivoAdjunto[]>(`${this.baseUrl}/contrato/${contratoId}`);
  }

  descargar(archivoId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${archivoId}/descargar`, { responseType: 'blob' });
  }

  eliminar(archivoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${archivoId}`);
  }
}