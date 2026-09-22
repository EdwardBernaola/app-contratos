import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionService } from '../../core/application/auth-session.service';

export const authInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(AuthSessionService).token();

  if (!token) {
    return siguiente(peticion);
  }

  return siguiente(
    peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
  );
};