# Feature Specification: Bitacora y Auditoria

**Feature Branch**: `010-auditoria-registros`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Registro de eventos y trazabilidad de acciones del sistema.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar eventos (Priority: P1)

El sistema registra automaticamente las acciones relevantes de los usuarios.

**Why this priority**: Es un requisito transversal de seguridad y trazabilidad.

**Independent Test**: Realizar un login y una edicion de contrato y verificar los registros generados.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** realiza una accion auditada (login, creacion, edicion, eliminacion, cambio de estado, alerta), **Then** se registra el evento con actor, accion, entidad y fecha.

---

### User Story 2 - Consultar y filtrar la bitacora (Priority: P1)

Un administrador consulta los eventos registrados con filtros.

**Why this priority**: Permite investigar y rendir cuentas.

**Independent Test**: Abrir la bitacora y filtrar por usuario, modulo, accion y fechas.

**Acceptance Scenarios**:

1. **Given** eventos registrados, **When** el administrador abre la bitacora, **Then** ve una tabla paginada con actor, accion, entidad, fecha y origen.
2. **Given** la bitacora, **When** aplica filtros, **Then** los resultados se ajustan.

---

### User Story 3 - Ver detalle del cambio (Priority: P2)

Un administrador consulta el antes y despues de un cambio.

**Why this priority**: Facilita el analisis de modificaciones sensibles.

**Independent Test**: Abrir el detalle de un evento de edicion y verificar los valores previos y nuevos.

**Acceptance Scenarios**:

1. **Given** un evento de edicion, **When** el administrador abre su detalle, **Then** ve los valores anteriores y posteriores.

---

### User Story 4 - Exportar bitacora (Priority: P3)

Un administrador exporta los eventos filtrados.

**Why this priority**: Apoya auditorias externas y respaldos.

**Independent Test**: Exportar los eventos filtrados y verificar el archivo generado.

**Acceptance Scenarios**:

1. **Given** eventos filtrados, **When** el administrador exporta, **Then** se genera un archivo con los eventos mostrados.

---

### Edge Cases

- Intento de modificar o borrar un registro: se impide (solo lectura).
- Volumen alto de eventos: la consulta pagina y filtra del lado del servidor.
- Eventos sin cambios de valor (por ejemplo login): el detalle indica el tipo de accion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST registrar eventos de login, logout e intentos fallidos.
- **FR-002**: El sistema MUST registrar altas, ediciones y eliminaciones de contratos, usuarios, roles y areas.
- **FR-003**: El sistema MUST registrar cargas y eliminaciones de archivos.
- **FR-004**: El sistema MUST registrar cambios de estado de contratos y alertas emitidas.
- **FR-005**: El sistema MUST registrar actor, accion, entidad, valores anteriores y posteriores, fecha y origen.
- **FR-006**: El sistema MUST permitir consultar y filtrar la bitacora por usuario, modulo, accion y rango de fechas.
- **FR-007**: El sistema MUST garantizar que la bitacora sea de solo lectura e inmutable.
- **FR-008**: El sistema MUST permitir exportar los eventos filtrados.
- **FR-009**: El sistema MUST restringir el acceso a la bitacora segun permisos.

### Key Entities

- **RegistroAuditoria**: actor, accion, entidad, entidadId, valorAnterior, valorNuevo, fecha, origen, resultado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las acciones criticas quedan registradas.
- **SC-002**: La bitacora no admite modificacion ni eliminacion desde la aplicacion.
- **SC-003**: La consulta filtrada responde en menos de 2 segundos en condiciones normales.

## Assumptions

- La bitacora almacena los cambios de valor en formato estructurado (JSON) o comparable.
- Los registros se conservan segun politica de retencion (a definir en RNF).
- Solo roles con permiso de auditoria acceden a esta vista.