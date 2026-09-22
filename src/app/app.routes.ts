import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/application/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./presentation/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./presentation/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'contratos',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./presentation/contratos/contratos-lista').then((m) => m.ContratosLista),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./presentation/contratos/contrato-formulario').then((m) => m.ContratoFormulario),
      },
      {
        path: ':id',
        loadComponent: () => import('./presentation/contratos/contrato-detalle').then((m) => m.ContratoDetalle),
      },
      {
        path: ':id/editar',
        loadComponent: () => import('./presentation/contratos/contrato-formulario').then((m) => m.ContratoFormulario),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];