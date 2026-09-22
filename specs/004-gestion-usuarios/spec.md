# Feature Specification: Gestion de Usuarios

**Feature Branch**: `004-gestion-usuarios`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Modulo de administracion de usuarios.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listar usuarios (Priority: P1)

Un administrador consulta los usuarios del sistema con su rol, area y estado.

**Why this priority**: Permite administrar el acceso y conocer la base de usuarios.

**Independent Test**: Abrir el modulo de usuarios y verificar filtros, paginacion y datos mostrados.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado, **When** abre el modulo de usuarios, **Then** ve el listado paginado con busqueda y filtros por rol, area y estado.

---

### User Story 2 - Crear y editar usuarios (Priority: P1)

Un administrador registra un usuario y le asigna rol y area.

**Why this priority**: Es el mecanismo para otorgar acceso al sistema.

**Independent Test**: Crear un usuario con rol y area, e iniciar sesion con esas credenciales.

**Acceptance Scenarios**:

1. **Given** un administrador, **When** crea un usuario con datos validos, rol y area, **Then** el usuario queda activo y puede iniciar sesion.
2. **Given** un usuario existente, **When** se editan sus datos, rol o area, **Then** los cambios se reflejan en su proximo acceso.

---

### User Story 3 - Activar, desactivar y resetear contrasena (Priority: P2)

Un administrador controla el estado del usuario y restablece su contrasena.

**Why this priority**: Gestiona altas, bajas y recuperacion de accesos.

**Independent Test**: Desactivar un usuario y verificar que no puede iniciar sesion; reactivarlo y resetear su contrasena.

**Acceptance Scenarios**:

1. **Given** un usuario activo, **When** el administrador lo desactiva, **Then** el usuario no puede iniciar sesion.
2. **Given** un usuario desactivado, **When** se reactiva, **Then** recupera el acceso.
3. **Given** un usuario, **When** se resetea su contrasena, **Then** se le solicita cambiarla en el siguiente acceso.

---

### Edge Cases

- Correo o usuario duplicado: se rechaza.
- Desactivar el propio usuario administrador: se impide.
- Desactivar un usuario con contratos asignados: se permite, los contratos conservan el registro historico.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir listar usuarios con paginacion, busqueda y filtros.
- **FR-002**: El sistema MUST permitir crear usuarios con nombre, correo, usuario, rol y area.
- **FR-003**: El sistema MUST validar correo y nombre de usuario unicos.
- **FR-004**: El sistema MUST permitir editar los datos, rol y area de un usuario.
- **FR-005**: El sistema MUST permitir activar y desactivar usuarios.
- **FR-006**: El sistema MUST permitir restablecer la contrasena de un usuario.
- **FR-007**: El sistema MUST impedir que un administrador desactive su propia cuenta.
- **FR-008**: El sistema MUST registrar en auditoria los cambios sobre usuarios.

### Key Entities

- **Usuario**: nombre, correo, nombreUsuario, estado, rol, areas.
- **Credencial**: hash de contrasena, requiereCambio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un administrador crea un usuario en menos de 2 minutos.
- **SC-002**: El 100% de los usuarios activos tienen rol y area asignados.

## Assumptions

- Solo el administrador (o rol con permiso) gestiona usuarios.
- No hay autorregistro ni inicio de sesion federado.
- El reseteo de contrasena genera una contrasena temporal o enlace de cambio (a confirmar).