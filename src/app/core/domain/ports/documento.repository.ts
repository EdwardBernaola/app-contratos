import { Observable } from 'rxjs';
import { ArchivoAdjunto, ArchivoSubida } from '../models/archivo-adjunto';

export abstract class DocumentoRepository {
  abstract subir(archivo: ArchivoSubida): Observable<ArchivoAdjunto>;
  abstract listarPorContrato(contratoId: string): Observable<ArchivoAdjunto[]>;
  abstract descargar(archivoId: string): Observable<Blob>;
  abstract eliminar(archivoId: string): Observable<void>;
}