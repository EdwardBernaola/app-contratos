# Feature Specification: Autenticacion y Login

**Feature Branch**: `001-auth-login`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Modulo de login del sistema de contrataciones (web).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar sesion (Priority: P1)

Un usuario registrado ingresa su usuario y contrasena para acceder al sistema.

**Why this priority**: Sin autenticacion no se accede a ningun otro modulo; es la base de la seguridad.

**Independent Test**: Abrir la aplicacion sin sesion, ingresar credenciales validas y verificar que se accede al dashboard.

**Acceptance Scenarios**:

1. **Given** un usuario activo con credenciales validas, **When** ingresa usuario y contrasena correctos, **Then** se crea la sesion y es redirigido segun su rol.
2. **Given** credenciales invalidas, **When** el usuario intenta iniciar sesion, **Then** se muestra un mensaje de error generico sin revelar cual dato fallo.

---

### User Story 2 - Cerrar sesion (Priority: P1)

Un usuario autenticado cierra su sesion de forma segura.

**Why this priority**: Evita accesos no autorizados en equipos compartidos.

**Independent Test**: Estando autenticado, cerrar sesion y verificar que se vuelve al login y no se puede navegar a rutas privadas.

**Acceptance Scenarios**:

1. **Given** una sesion activa, **When** el usuario cierra sesion, **Then** el token se descarta y se redirige al login.
2. **Given** una sesion cerrada, **When** el usuario intenta acceder a una ruta privada, **Then** es redirigido al login.

---

### User Story 3 - Proteccion de rutas (Priority: P1)

El sistema impide el acceso a rutas privadas sin sesion valida.

**Why this priority**: Garantiza la confidencialidad de los datos de contratos.

**Independent Test**: Solicitar una URL privada sin token y verificar la redireccion.

**Acceptance Scenarios**:

1. **Given** un usuario no autenticado, **When** intenta abrir una ruta privada, **Then** el sistema lo redirige al login.
2. **Given** un token expirado, **When** el usuario hace una peticion, **Then** el sistema cierra la sesion y redirige al login.

---

### User Story 4 - Recuperar contrasena (Priority: P2)

Un usuario que olvido su contrasena solicita restablecerla.

**Why this priority**: Reduce la dependencia de soporte para restablecer accesos.

**Independent Test**: Solicitar recuperacion y completar el flujo con un token de restablecimiento valido.

**Acceptance Scenarios**:

1. **Given** un correo registrado, **When** el usuario solicita recuperacion, **Then** recibe instrucciones y la solicitud se registra en auditoria.

---

### Edge Cases

- Cuenta desactivada: el acceso se rechaza con mensaje informativo.
- Multiples intentos fallidos: el sistema aplica una politica de bloqueo temporal (ver RNF).
- Sesion expirada durante una operacion: la accion se cancela y se solicita reautenticacion.
- Red lenta o backend no disponible: se muestra estado de error y se permite reintentar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir iniciar sesion con usuario y contrasena.
- **FR-002**: El sistema MUST validar las credenciales contra el backend y emitir un token JWT.
- **FR-003**: El sistema MUST redirigir al usuario despues del login segun su rol y permisos.
- **FR-004**: El sistema MUST permitir cerrar sesion e invalidar la sesion del cliente.
- **FR-005**: El sistema MUST proteger las rutas privadas mediante guardas de navegacion.
- **FR-006**: El sistema MUST adjuntar el token a las peticiones autenticadas mediante un interceptor.
- **FR-007**: El sistema MUST cerrar la sesion y redirigir al login ante un token expirado o invalido.
- **FR-008**: El sistema MUST permitir solicitar el restablecimiento de contrasena.
- **FR-009**: El sistema MUST registrar en auditoria los inicios y cierres de sesion y los intentos fallidos.
- **FR-010**: El sistema MUST rechazar el acceso de cuentas desactivadas.

### Key Entities

- **Usuario**: identidad, credenciales, estado (activo/inactivo), rol, area.
- **Sesion**: token, fecha de emision y expiracion.
- **IntentoAcceso**: usuario, resultado, fecha, origen.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario completa el login en menos de 30 segundos en condiciones normales.
- **SC-002**: El 100% de las rutas privadas son inaccesibles sin sesion valida.
- **SC-003**: El 100% de los inicios/cierres de sesion quedan registrados en auditoria.

## Assumptions

- La autenticacion es local (usuario/contrasena) con JWT emitido por el backend.
- La recuperacion de contrasena se realiza por correo electronico (canal a confirmar).
- El sistema es solo web; no se contemplan clientes moviles.
- Los usuarios son creados por un administrador; no hay autorregistro.