import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Credenciales } from '../../core/domain/models/credenciales';
import { Sesion, UsuarioSesion } from '../../core/domain/models/sesion';
import { AuthRepository } from '../../core/domain/ports/auth.repository';

interface CuentaDemo {
  contrasena: string;
  usuario: UsuarioSesion;
}

const CUENTAS: Record<string, CuentaDemo> = {
  'admin@demo.com': {
    contrasena: 'Admin123*',
    usuario: {
      id: '1',
      nombre: 'Administrador',
      usuario: 'admin@demo.com',
      rol: 'ADMIN',
      permisos: ['*'],
    },
  },
  'gestor@demo.com': {
    contrasena: 'Gestor123*',
    usuario: {
      id: '2',
      nombre: 'Gestor de Contratos',
      usuario: 'gestor@demo.com',
      rol: 'GESTOR',
      permisos: ['contratos.ver', 'contratos.crear', 'contratos.editar'],
    },
  },
};

@Injectable()
export class AuthMockRepository extends AuthRepository {
  login({ usuario, contrasena }: Credenciales): Observable<Sesion> {
    const cuenta = CUENTAS[usuario.trim().toLowerCase()];

    if (!cuenta || cuenta.contrasena !== contrasena) {
      return throwError(() => new Error('Usuario o contraseña incorrectos')).pipe(delay(600));
    }

    const expiraEn = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    const sesion: Sesion = {
      token: `mock.${btoa(usuario)}.${Date.now()}`,
      usuario: cuenta.usuario,
      expiraEn,
    };

    return of(sesion).pipe(delay(800));
  }
}