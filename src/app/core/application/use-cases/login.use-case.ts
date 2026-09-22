import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Credenciales } from '../../domain/models/credenciales';
import { Sesion } from '../../domain/models/sesion';
import { AuthRepository } from '../../domain/ports/auth.repository';
import { AuthSessionService } from '../auth-session.service';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly authRepository = inject(AuthRepository);
  private readonly authSession = inject(AuthSessionService);

  ejecutar(credenciales: Credenciales): Observable<Sesion> {
    return this.authRepository
      .login(credenciales)
      .pipe(tap((sesion) => this.authSession.guardarSesion(sesion)));
  }
}