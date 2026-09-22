# Feature Specification: CRUD de Contratos

**Feature Branch**: `007-contratos-crud`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Listado, consulta, edicion y eliminacion de contratos.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listar y buscar contratos (Priority: P1)

Un usuario consulta los contratos con paginacion, busqueda y filtros.

**Why this priority**: Es la vista principal de trabajo del sistema.

**Independent Test**: Abrir el listado, aplicar filtros y verificar resultados paginados.

**Acceptance Scenarios**:

1. **Given** contratos registrados, **When** el usuario abre el listado, **Then** ve una tabla paginada con codigo, titulo, area, responsable, fechas, estado y dias para vencer.
2. **Given** el listado, **When** el usuario busca por codigo o titulo, **Then** los resultados se filtran.
3. **Given** el listado, **When** el usuario filtra por estado, area, tipo, responsable o rango de fechas, **Then** los resultados se ajustan.
4. **Given** el listado, **When** el usuario ordena por una columna, **Then** el orden se aplica.

---

### User Story 2 - Ver detalle de un contrato (Priority: P1)

Un usuario consulta toda la informacion de un contrato y sus adjuntos.

**Why this priority**: Permite tomar decisiones informadas y acceder a documentos.

**Independent Test**: Abrir el detalle y verificar datos, adjuntos y estado.

**Acceptance Scenarios**:

1. **Given** un contrato, **When** el usuario abre su detalle, **Then** ve datos generales, economicos, plazos, adjuntos e historial.

---

### User Story 3 - Editar contrato (Priority: P2)

Un usuario autorizado modifica los datos de un contrato.

**Why this priority**: Mantiene la informacion actualizada.

**Independent Test**: Editar el titulo y la fecha de fin y verificar la actualizacion y revalidacion.

**Acceptance Scenarios**:

1. **Given** un contrato editable, **When** el usuario modifica campos validos, **Then** los cambios persisten y se auditan.
2. **Given** una fecha de fin invalida, **When** se intenta guardar, **Then** el sistema lo rechaza.

---

### User Story 4 - Eliminar contrato (Priority: P3)

Un usuario autorizado da de baja un contrato.

**Why this priority**: Permite descartar registros erroneos conservando trazabilidad.

**Independent Test**: Eliminar con confirmacion y verificar baja logica y registro en auditoria.

**Acceptance Scenarios**:

1. **Given** un contrato y permisos suficientes, **When** el usuario confirma la eliminacion, **Then** el contrato se marca como eliminado y se registra en auditoria.

---

### Edge Cases

- Listado vacio: se muestra estado vacio con accion para crear.
- Error del backend: se muestra estado de error con reintento.
- Contratos vencidos o por vencer: se resaltan con indicador de severidad.
- Edicion concurrente: el sistema detecta y advierte sobre cambios recientes (a confirmar).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST listar contratos con paginacion del lado del servidor.
- **FR-002**: El sistema MUST permitir busqueda por codigo, titulo y contratista.
- **FR-003**: El sistema MUST permitir filtrar por estado, area, tipo, responsable y rango de fechas.
- **FR-004**: El sistema MUST permitir ordenar por columnas.
- **FR-005**: El sistema MUST mostrar los dias restantes para el vencimiento y su severidad.
- **FR-006**: El sistema MUST permitir consultar el detalle completo del contrato.
- **FR-007**: El sistema MUST permitir editar contratos revalidando fechas y unicidad.
- **FR-008**: El sistema MUST permitir eliminar contratos con confirmacion y baja logica.
- **FR-009**: El sistema MUST permitir exportar el listado filtrado (CSV/PDF).
- **FR-010**: El sistema MUST gestionar estados de carga, vacio y error.
- **FR-011**: El sistema MUST registrar en auditoria ediciones y eliminaciones.

### Key Entities

- **Contrato**: entidad principal descrita en la spec de registro.
- **ArchivoAdjunto**: adjuntos del contrato.
- **RegistroAuditoria**: trazabilidad de cambios.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El listado carga la primera pagina en menos de 2 segundos en condiciones normales.
- **SC-002**: El 100% de contratos muestran su indicador de vencimiento.
- **SC-003**: Toda edicion o eliminacion queda auditada.

## Assumptions

- La eliminacion es logica (baja) para conservar historial.
- La exportacion es una necesidad confirmada (formato a definir en RNF).
- No se contempla edicion en linea de adjuntos en este modulo.
- Los permisos determinan visibilidad de acciones.