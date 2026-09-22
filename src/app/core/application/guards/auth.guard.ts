import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../auth-session.service';

export const authGuard: CanActivateFn = () => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.autenticado()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = () => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  return authSession.autenticado() ? router.createUrlTree(['/dashboard']) : true;
};