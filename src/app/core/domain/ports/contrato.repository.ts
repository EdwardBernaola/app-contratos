import { Observable } from 'rxjs';
import { Contrato } from '../models/contrato';
import { ContratoFiltros, ContratoPaginado } from '../models/contrato';

export abstract class ContratoRepository {
  abstract crear(contrato: Contrato): Observable<Contrato>;
  abstract obtenerPorId(id: string): Observable<Contrato | null>;
  abstract listar(filtros: ContratoFiltros): Observable<ContratoPaginado>;
  abstract actualizar(id: string, contrato: Partial<Contrato>): Observable<Contrato>;
  abstract eliminar(id: string): Observable<void>;
  abstract obtenerEstadisticas(): Observable<{
    total: number;
    porEstado: Record<string, number>;
    porVencer: number;
    vencidos: number;
  }>;
}