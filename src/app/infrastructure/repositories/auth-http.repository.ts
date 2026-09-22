import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credenciales } from '../../core/domain/models/credenciales';
import { Sesion } from '../../core/domain/models/sesion';
import { AuthRepository } from '../../core/domain/ports/auth.repository';
import { environment } from '../config/environment';

@Injectable()
export class AuthHttpRepository extends AuthRepository {
  private readonly http = inject(HttpClient);

  login({ usuario, contrasena }: Credenciales): Observable<Sesion> {
    return this.http.post<Sesion>(`${environment.apiUrl}/auth/login`, {
      usuario,
      contrasena,
    });
  }
}