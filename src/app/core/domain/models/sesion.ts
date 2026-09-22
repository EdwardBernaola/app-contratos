export type RolUsuario = 'ADMIN' | 'GESTOR' | 'CONSULTA';

export interface UsuarioSesion {
  id: string;
  nombre: string;
  usuario: string;
  rol: RolUsuario;
  permisos: string[];
}

export interface Sesion {
  token: string;
  usuario: UsuarioSesion;
  expiraEn: string;
}