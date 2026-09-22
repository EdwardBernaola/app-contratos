# Feature Specification: Gestion de Roles y Permisos

**Feature Branch**: `002-gestion-roles`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Modulo de administracion de roles y permisos (RBAC).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listar y consultar roles (Priority: P1)

Un administrador visualiza los roles existentes y sus permisos.

**Why this priority**: Es la base del control de acceso; los demas modulos dependen de los roles.

**Independent Test**: Abrir el modulo de roles y verificar el listado con su matriz de permisos.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado, **When** abre el modulo de roles, **Then** ve el listado de roles con nombre, descripcion y numero de usuarios asociados.

---

### User Story 2 - Crear y editar roles (Priority: P1)

Un administrador define un rol y su matriz de permisos por modulo y accion.

**Why this priority**: Permite ajustar el acceso sin cambiar codigo.

**Independent Test**: Crear un rol, asignarle permisos y verificar que usuarios con ese rol ven afectadas sus acciones.

**Acceptance Scenarios**:

1. **Given** un administrador, **When** crea un rol con nombre unico y permisos seleccionados, **Then** el rol queda disponible para asignacion.
2. **Given** un rol existente, **When** modifica sus permisos, **Then** los cambios aplican a los usuarios con ese rol.

---

### User Story 3 - Eliminar roles (Priority: P2)

Un administrador elimina un rol que ya no se usa.

**Why this priority**: Mantiene el catalogo limpio sin romper asignaciones vigentes.

**Independent Test**: Intentar eliminar un rol en uso y verificar que el sistema lo impide o solicita reasignacion.

**Acceptance Scenarios**:

1. **Given** un rol sin usuarios asociados, **When** el administrador lo elimina, **Then** el rol desaparece del catalogo.
2. **Given** un rol con usuarios asociados, **When** se intenta eliminar, **Then** el sistema lo impide y explica el motivo.

---

### Edge Cases

- Nombre de rol duplicado: se rechaza.
- Rol de sistema (administrador): no editable ni eliminable.
- Cambio de permisos con sesiones activas: aplica en la siguiente validacion de permisos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir listar roles con su descripcion y numero de usuarios.
- **FR-002**: El sistema MUST permitir crear roles con nombre unico.
- **FR-003**: El sistema MUST permitir editar el nombre, descripcion y permisos de un rol.
- **FR-004**: El sistema MUST gestionar permisos como matriz modulo x accion (ver, crear, editar, eliminar).
- **FR-005**: El sistema MUST impedir eliminar roles con usuarios asignados.
- **FR-006**: El sistema MUST impedir modificar o eliminar roles de sistema.
- **FR-007**: El sistema MUST exponer los permisos efectivos del usuario autenticado para que la UI oculte o deshabilite acciones.
- **FR-008**: El sistema MUST registrar en auditoria los cambios de roles y permisos.

### Key Entities

- **Rol**: nombre, descripcion, esSistema.
- **Permiso**: modulo, accion, descripcion.
- **RolPermiso**: relacion rol-permiso.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un administrador puede crear un rol con permisos en menos de 2 minutos.
- **SC-002**: El 100% de las acciones de la UI reflejan los permisos efectivos del usuario.
- **SC-003**: Cero roles en uso pueden eliminarse sin reasignacion.

## Assumptions

- El control de acceso es RBAC basado en roles con permisos por modulo y accion.
- Existe al menos un rol de sistema administrador no editable.
- Los permisos se definen sobre los modulos del sistema (contratos, usuarios, roles, areas, auditoria, dashboard).