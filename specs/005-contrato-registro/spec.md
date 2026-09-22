# Feature Specification: Registro de Contratos

**Feature Branch**: `005-contrato-registro`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Alta de un contrato con sus metadatos (documento = contrato).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar un contrato (Priority: P1)

Un usuario autorizado registra un nuevo contrato con sus datos generales y fechas.

**Why this priority**: Es el punto de entrada del dominio; sin contratos no hay gestion documental.

**Independent Test**: Crear un contrato con datos validos y verificar que aparece en el listado.

**Acceptance Scenarios**:

1. **Given** un usuario con permiso de creacion, **When** completa los campos obligatorios y guarda, **Then** el contrato se crea en estado borrador.
2. **Given** que la fecha de fin es anterior o igual a la de inicio, **When** se intenta guardar, **Then** el sistema rechaza el registro con un mensaje claro.
3. **Given** un codigo de contrato ya existente, **When** se intenta guardar, **Then** el sistema rechaza el duplicado.

---

### User Story 2 - Guardar como borrador (Priority: P2)

Un usuario guarda un contrato incompleto para completarlo despues.

**Why this priority**: Agiliza la captura de informacion en varios pasos.

**Independent Test**: Guardar un contrato incompleto y recuperarlo en estado borrador.

**Acceptance Scenarios**:

1. **Given** un formulario parcial, **When** el usuario guarda como borrador, **Then** el contrato persiste en estado borrador y no genera alertas.

---

### User Story 3 - Asociar clasificacion (Priority: P2)

Un usuario asigna area, responsable, tipo y contratista al contrato.

**Why this priority**: Permite clasificar y filtrar contratos en el resto del sistema.

**Independent Test**: Registrar un contrato con area y responsable y verificar los filtros por esos campos.

**Acceptance Scenarios**:

1. **Given** el formulario de contrato, **When** se seleccionan area, responsable, tipo y contratista, **Then** estos quedan asociados al contrato.

---

### Edge Cases

- Campos obligatorios incompletos al intentar pasar de borrador a vigente: se rechaza.
- Contratista no registrado: se permite texto libre o requiere catalogo (a confirmar).
- Fechas de largo plazo y valor cero o nulo: se validan segun reglas de negocio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir crear un contrato con codigo, titulo/objeto, tipo, contratista, area, responsable, fecha de inicio, fecha de fin, valor, moneda, estado y descripcion.
- **FR-002**: El sistema MUST validar que la fecha de fin sea posterior a la fecha de inicio.
- **FR-003**: El sistema MUST validar la unicidad del codigo de contrato.
- **FR-004**: El sistema MUST permitir guardar un contrato en estado borrador.
- **FR-005**: El sistema MUST permitir adjuntar documentos en un paso posterior al alta.
- **FR-006**: El sistema MUST registrar en auditoria la creacion del contrato.
- **FR-007**: El sistema MUST calcular y almacenar los dias restantes para el vencimiento a partir de la fecha de fin.

### Key Entities

- **Contrato**: codigo, titulo/objeto, tipo, contratista, area, responsable, fechaInicio, fechaFin, valor, moneda, estado, descripcion, creadoPor, timestamps.
- **Contratista**: identificacion, nombre, contacto.
- **Area**: clasificacion del contrato.
- **Usuario**: responsable del contrato.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario registra un contrato completo en menos de 5 minutos.
- **SC-002**: El 100% de los contratos tienen fechas validas y codigo unico.
- **SC-003**: Cero contratos con fecha de fin anterior a la de inicio.

## Assumptions

- "Documento" y "contrato" se refieren a la misma entidad.
- Los catalogos de tipo y contratista existen o se administran aparte (a confirmar).
- El estado inicial es borrador.
- Las alertas de vencimiento aplican solo a contratos vigentes.