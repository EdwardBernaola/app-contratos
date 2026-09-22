import { computed, inject, Injectable, signal } from '@angular/core';
import { Sesion } from '../domain/models/sesion';
import { TokenStoragePort } from '../domain/ports/token-storage.port';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly tokenStorage = inject(TokenStoragePort);
  private readonly sesion = signal<Sesion | null>(this.tokenStorage.leer());

  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  readonly autenticado = computed(() => this.esSesionValida(this.sesion()));

  guardarSesion(sesion: Sesion): void {
    this.tokenStorage.guardar(sesion);
    this.sesion.set(sesion);
  }

  cerrarSesion(): void {
    this.tokenStorage.limpiar();
    this.sesion.set(null);
  }

  token(): string | null {
    const sesion = this.sesion();
    return this.esSesionValida(sesion) ? sesion!.token : null;
  }

  private esSesionValida(sesion: Sesion | null): boolean {
    if (!sesion) {
      return false;
    }
    return new Date(sesion.expiraEn).getTime() > Date.now();
  }
}