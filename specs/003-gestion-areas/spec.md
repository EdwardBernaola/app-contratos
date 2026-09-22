# Feature Specification: Gestion de Areas y Departamentos

**Feature Branch**: `003-gestion-areas`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Modulo de administracion de areas o departamentos.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listar areas (Priority: P1)

Un usuario autorizado consulta las areas o departamentos de la organizacion.

**Why this priority**: Las areas clasifican usuarios y contratos; son un catalogo base del sistema.

**Independent Test**: Abrir el modulo de areas y verificar el listado con responsable y estado.

**Acceptance Scenarios**:

1. **Given** un usuario autorizado, **When** abre el modulo de areas, **Then** ve el listado con nombre, responsable y cantidad de contratos asociados.

---

### User Story 2 - Crear y editar areas (Priority: P1)

Un administrador crea o modifica un area y su responsable.

**Why this priority**: Permite mantener el catalogo alineado con la estructura organizacional.

**Independent Test**: Crear un area, asignarle un responsable y verificar su disponibilidad al registrar usuarios y contratos.

**Acceptance Scenarios**:

1. **Given** un administrador, **When** crea un area con nombre unico, **Then** el area queda disponible para asignacion.
2. **Given** un area existente, **When** se cambia su responsable, **Then** el cambio se refleja en el detalle.

---

### User Story 3 - Jerarquia de areas (Priority: P3)

Un administrador organiza las areas en una jerarquia padre-hijo.

**Why this priority**: Refleja estructuras organizacionales complejas; no es indispensable para el MVP.

**Independent Test**: Crear un area hija, asignarla a un usuario y verificar la ruta jerarquica.

**Acceptance Scenarios**:

1. **Given** un area padre, **When** se crea un area hija, **Then** el listado muestra la relacion jerarquica.

---

### Edge Cases

- Area con contratos o usuarios asociados: no se elimina, se desactiva.
- Ciclo en la jerarquia: se rechaza.
- Nombre duplicado dentro del mismo padre: se rechaza.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir listar areas con nombre, responsable, estado y conteo de contratos.
- **FR-002**: El sistema MUST permitir crear areas con nombre unico.
- **FR-003**: El sistema MUST permitir editar nombre, responsable y estado de un area.
- **FR-004**: El sistema MUST permitir asignar un responsable a cada area.
- **FR-005**: El sistema MUST permitir activar y desactivar areas.
- **FR-006**: El sistema MUST registrar en auditoria los cambios en areas.
- **FR-007**: El sistema MUST soportar jerarquia de areas padre-hijo sin ciclos. *(P3)*

### Key Entities

- **Area**: nombre, descripcion, responsable, areaPadre, estado.
- **Usuario**: relacion con area (uno o varias, a confirmar).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un administrador crea un area en menos de 1 minuto.
- **SC-002**: El 100% de contratos y usuarios quedan asociados a un area valida.

## Assumptions

- Un usuario puede pertenecer a una o varias areas (a confirmar en clarify).
- La jerarquia es opcional y de profundidad limitada.
- No se permite eliminar areas con dependencias; se desactivan.