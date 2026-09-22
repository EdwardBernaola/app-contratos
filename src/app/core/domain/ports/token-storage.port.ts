import { Sesion } from '../models/sesion';

export abstract class TokenStoragePort {
  abstract guardar(sesion: Sesion): void;
  abstract leer(): Sesion | null;
  abstract limpiar(): void;
}