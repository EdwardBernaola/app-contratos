# Feature Specification: Alertas de Vencimiento

**Feature Branch**: `008-alertas-vencimiento`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Alertas automaticas cuando un contrato esta proximo a vencer.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Detectar contratos proximos a vencer (Priority: P1)

El sistema evalua periodicamente las fechas de fin y marca los contratos que cruzan un umbral.

**Why this priority**: Es el valor central solicitado: anticipar vencimientos.

**Independent Test**: Cargar un contrato con fecha de fin dentro del umbral y verificar que aparece como "por vencer".

**Acceptance Scenarios**:

1. **Given** un contrato vigente cuya fecha de fin esta dentro del umbral, **When** el sistema evalua los vencimientos, **Then** el contrato se marca como "por vencer" y se genera una alerta.
2. **Given** un contrato cuya fecha de fin ya paso, **When** el sistema evalua, **Then** el contrato se marca como "vencido" y se genera la alerta correspondiente.

---

### User Story 2 - Visualizar alertas en la interfaz (Priority: P1)

Un usuario ve las alertas de vencimiento en el listado, el detalle y el dashboard.

**Why this priority**: Sin visibilidad, la alerta no es util.

**Independent Test**: Verificar el indicador de severidad en listado y detalle y el widget del dashboard.

**Acceptance Scenarios**:

1. **Given** contratos por vencer o vencidos, **When** el usuario abre el listado, **Then** cada fila muestra un indicador de severidad por color.
2. **Given** el dashboard, **When** el usuario lo abre, **Then** ve el widget de contratos proximos a vencer ordenado por dias restantes.

---

### User Story 3 - Configurar umbrales (Priority: P2)

Un administrador define los umbrales de alerta y su activacion.

**Why this priority**: Cada organizacion tiene horizontes de anticipacion distintos.

**Independent Test**: Cambiar los umbrales y verificar que las alertas se recalculan.

**Acceptance Scenarios**:

1. **Given** la configuracion de alertas, **When** el administrador define umbrales (por ejemplo 30, 15, 7 y vencido), **Then** las alertas se generan segun esos valores.

---

### User Story 4 - Notificar a los responsables (Priority: P2)

El sistema notifica a los destinatarios definidos cuando se genera una alerta.

**Why this priority**: Convierte la deteccion en accion.

**Independent Test**: Provocar una alerta y verificar la notificacion al responsable.

**Acceptance Scenarios**:

1. **Given** una alerta generada, **When** el periodo de evaluacion se ejecuta, **Then** los destinatarios reciben la notificacion por el canal configurado.

---

### Edge Cases

- Contrato terminado o liquidado: no genera alertas.
- Contrato borrador: no genera alertas.
- Cambio de fecha de fin: recalcula dias restantes y alertas.
- Umbral duplicado: se rechaza.
- Sin destinatarios configurados: la alerta queda registrada pero no se notifica, y se advierte.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST calcular los dias restantes a partir de la fecha de fin.
- **FR-002**: El sistema MUST generar alertas al cruzar umbrales configurables.
- **FR-003**: El sistema MUST clasificar la severidad (por vencer, vencido) segun los umbrales.
- **FR-004**: El sistema MUST mostrar indicadores de severidad en listado y detalle.
- **FR-005**: El sistema MUST exponer un widget de contratos proximos a vencer en el dashboard.
- **FR-006**: El sistema MUST permitir configurar umbrales y activacion de alertas.
- **FR-007**: El sistema MUST notificar a los destinatarios definidos por el canal configurado.
- **FR-008**: El sistema MUST registrar en auditoria las alertas emitidas y las notificaciones.
- **FR-009**: El sistema MUST excluir contratos borrador, terminados y liquidados de las alertas.

### Key Entities

- **AlertaVencimiento**: contrato, tipo, severidad, diasRestantes, emitidaEn, notificada.
- **ConfiguracionAlerta**: umbrales, activa, canal, destinatarios.
- **Contrato**: entidad evaluada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los contratos vigentes con vencimiento dentro del umbral generan alerta.
- **SC-002**: Las alertas se reflejan en la interfaz dentro del ciclo de evaluacion siguiente.
- **SC-003**: Cero alertas para contratos en estados excluidos.

## Assumptions

- La evaluacion se ejecuta de forma programada (job/cron) en el backend.
- Canales de notificacion a confirmar (in-app y/o correo).
- Los destinatarios por defecto son el responsable del contrato y/o su area.
- Los umbrales iniciales propuestos: 30, 15, 7 dias y vencido.