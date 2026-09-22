# Feature Specification: Carga de Documentos de Contrato

**Feature Branch**: `006-contrato-carga`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Carga de archivos asociados a un contrato.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cargar archivos a un contrato (Priority: P1)

Un usuario autorizado adjunta uno o varios archivos a un contrato existente.

**Why this priority**: Los contratos se materializan en documentos; la carga es esencial.

**Independent Test**: Subir un archivo permitido a un contrato y verificar que queda asociado y descargable.

**Acceptance Scenarios**:

1. **Given** un contrato existente y un archivo de tipo permitido dentro del tamano maximo, **When** el usuario lo carga, **Then** el archivo queda asociado y visible en el detalle del contrato.
2. **Given** un archivo de tipo no permitido o que excede el tamano, **When** se intenta cargar, **Then** el sistema lo rechaza con un mensaje claro.

---

### User Story 2 - Cargar multiples archivos (Priority: P2)

Un usuario carga varios archivos en una sola operacion.

**Why this priority**: Agiliza contratos con multiples anexos.

**Independent Test**: Cargar tres archivos simultaneamente y verificar el resultado por archivo.

**Acceptance Scenarios**:

1. **Given** varios archivos seleccionados, **When** se inicia la carga, **Then** el sistema muestra el progreso y el resultado individual de cada archivo.

---

### User Story 3 - Descargar o previsualizar (Priority: P2)

Un usuario descarga o previsualiza un archivo asociado.

**Why this priority**: Permite consultar el contenido del contrato sin salir del sistema.

**Independent Test**: Descargar un archivo y previsualizar un PDF.

**Acceptance Scenarios**:

1. **Given** un archivo asociado, **When** el usuario solicita descargarlo, **Then** se descarga con su nombre y tipo correctos.

---

### User Story 4 - Eliminar un adjunto (Priority: P3)

Un usuario elimina un archivo asociado, dejando registro.

**Why this priority**: Corrige cargas erroneas manteniendo trazabilidad.

**Independent Test**: Eliminar un adjunto y verificar que desaparece del detalle y queda en auditoria.

**Acceptance Scenarios**:

1. **Given** un contrato no cerrado y un adjunto, **When** el usuario lo elimina con confirmacion, **Then** el archivo se elimina y se registra en auditoria.

---

### Edge Cases

- Carga interrumpida por red: el archivo no queda asociado y se informa el error.
- Archivo duplicado (mismo nombre): se permite con versionado o se advierte (a confirmar).
- Contrato en estado cerrado: no admite nuevas cargas.
- Archivo corrupto o vacio: se rechaza.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir cargar uno o varios archivos asociados a un contrato.
- **FR-002**: El sistema MUST validar tipo y tamano maximo de archivo en cliente y servidor.
- **FR-003**: El sistema MUST mostrar progreso y resultado por archivo.
- **FR-004**: El sistema MUST permitir descargar y previsualizar archivos cuando el formato lo permita.
- **FR-005**: El sistema MUST permitir eliminar adjuntos con confirmacion y registro en auditoria.
- **FR-006**: El sistema MUST impedir cargas en contratos en estado cerrado.
- **FR-007**: El sistema MUST almacenar metadatos del archivo (nombre, tipo, tamano, cargadoPor, fecha).

### Key Entities

- **ArchivoAdjunto**: nombre, tipo, tamano, ruta, contrato, cargadoPor, fecha.
- **Contrato**: entidad propietaria de los adjuntos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un archivo de hasta el tamano maximo se carga en menos de 30 segundos en red normal.
- **SC-002**: El 100% de archivos rechazados informan el motivo al usuario.
- **SC-003**: Cero archivos asociados a contratos con identificador invalido.

## Assumptions

- Tipos y tamano permitidos por defecto: PDF, DOCX, XLSX, imagenes; maximo a definir en RNF.
- Almacenamiento abstraido por puerto (local en desarrollo, S3/MinIO preparado).
- No hay edicion de version en linea; se cargan nuevas versiones como archivos nuevos.
- Se requiere contrato existente antes de cargar (aunque el alta puede completarse despues).