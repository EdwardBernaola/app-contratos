import { Observable } from 'rxjs';
import { Credenciales } from '../models/credenciales';
import { Sesion } from '../models/sesion';

export abstract class AuthRepository {
  abstract login(credenciales: Credenciales): Observable<Sesion>;
}