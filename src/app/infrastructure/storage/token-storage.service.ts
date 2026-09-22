import { Injectable } from '@angular/core';
import { Sesion } from '../../core/domain/models/sesion';
import { TokenStoragePort } from '../../core/domain/ports/token-storage.port';

const CLAVE_SESION = 'contrataciones.sesion';

@Injectable({ providedIn: 'root' })
export class LocalStorageTokenStorage extends TokenStoragePort {
  guardar(sesion: Sesion): void {
    try {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch {
      // almacenamiento no disponible: la sesion permanece solo en memoria
    }
  }

  leer(): Sesion | null {
    try {
      const valor = localStorage.getItem(CLAVE_SESION);
      return valor ? (JSON.parse(valor) as Sesion) : null;
    } catch {
      return null;
    }
  }

  limpiar(): void {
    try {
      localStorage.removeItem(CLAVE_SESION);
    } catch {
      // sin accion
    }
  }
}