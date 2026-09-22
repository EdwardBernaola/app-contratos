# Feature Specification: Dashboard de Contratos

**Feature Branch**: `009-dashboard-contratos`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Panel de resumen con indicadores de contratos.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver indicadores generales (Priority: P1)

Un usuario consulta los indicadores clave de la gestion de contratos.

**Why this priority**: Ofrece una vision inmediata del estado del sistema.

**Independent Test**: Abrir el dashboard y verificar que los indicadores coinciden con los datos.

**Acceptance Scenarios**:

1. **Given** contratos registrados, **When** el usuario abre el dashboard, **Then** ve el total de contratos, distribuidos por estado y por area.
2. **Given** el dashboard, **When** el usuario lo abre, **Then** ve el total de contratos por vencer y vencidos.

---

### User Story 2 - Ver contratos proximos a vencer (Priority: P1)

Un usuario consulta la lista de contratos con vencimiento mas cercano.

**Why this priority**: Es la accion prioritaria derivada de las alertas.

**Independent Test**: Verificar el widget ordenado por dias restantes y su enlace al listado filtrado.

**Acceptance Scenarios**:

1. **Given** contratos por vencer, **When** el usuario abre el dashboard, **Then** ve el widget ordenado por dias restantes.

---

### User Story 3 - Navegar a vistas filtradas (Priority: P2)

Un usuario hace clic en un indicador y accede al listado correspondiente.

**Why this priority**: Conecta el resumen con la operacion.

**Independent Test**: Hacer clic en "por vencer" y verificar que el listado abre con el filtro aplicado.

**Acceptance Scenarios**:

1. **Given** un indicador del dashboard, **When** el usuario hace clic, **Then** se abre el listado con el filtro correspondiente.

---

### User Story 4 - Ver graficos (Priority: P3)

Un usuario visualiza la distribucion de contratos por estado, area y tipo.

**Why this priority**: Enriquece el analisis; no es indispensable para el MVP.

**Independent Test**: Verificar que los graficos renderizan y coinciden con los datos.

**Acceptance Scenarios**:

1. **Given** contratos registrados, **When** el usuario abre el dashboard, **Then** ve graficos de distribucion por estado y area.

---

### Edge Cases

- Sin contratos: se muestra estado vacio informativo.
- Datos no disponibles: se muestra estado de error con reintento.
- Usuario sin permiso de dashboard: acceso restringido.
- Periodos sin actividad: los indicadores muestran cero sin error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar el total de contratos y su distribucion por estado.
- **FR-002**: El sistema MUST mostrar la distribucion de contratos por area.
- **FR-003**: El sistema MUST mostrar el total de contratos por vencer y vencidos.
- **FR-004**: El sistema MUST mostrar un widget de contratos proximos a vencer ordenado por dias restantes.
- **FR-005**: El sistema MUST permitir navegar desde un indicador al listado con el filtro aplicado.
- **FR-006**: El sistema MUST mostrar graficos de distribucion por estado, area y tipo.
- **FR-007**: El sistema MUST gestionar estados de carga, vacio y error.
- **FR-008**: El sistema MUST respetar los permisos del usuario sobre los datos mostrados.

### Key Entities

- **IndicadorDashboard**: metrica, valor, etiqueta.
- **Contrato**: fuente de datos agregados.
- **AlertaVencimiento**: alimenta los indicadores de vencimiento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El dashboard carga sus indicadores en menos de 3 segundos en condiciones normales.
- **SC-002**: El 100% de los indicadores navegan a la vista filtrada correspondiente.
- **SC-003**: Los indicadores coinciden con el conteo real del listado filtrado.

## Assumptions

- El dashboard es la pantalla posterior al login.
- Es responsivo para web de escritorio y tablet.
- Los graficos se implementan con una libreria de visualizacion (a definir en plan).
- Los indicadores se calculan en el backend mediante un endpoint de resumen.