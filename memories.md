# Memories

## Rules

- Arquitectura hexagonal obligatoria: la dependencia apunta hacia el dominio; nada externo entra sin puerto/adaptador.
- Especificar antes de implementar (Spec-Driven Development): spec -> clarify -> plan -> tasks -> implement.
- Primera pasada de requerimientos funcionales (RF); los no funcionales (RNF) se cruzan en una segunda pasada.
- Contrato de API (OpenAPI) primero; frontend y backend avanzan contra el contrato.
- Seguridad RBAC validada en backend y reflejada en la UI; JWT con interceptor.
- Documentacion, specs y UI en espanol; codigo e identificadores en ingles.
- No agregar dependencias ni capas sin justificacion en la spec (YAGNI).

## 2026-09-21 (proyecto)

**Type:** decision
**Tags:** stack, arquitectura

Sistema "Contrataciones": gestion de contratos. Frontend Angular 22 (standalone) + Angular Material + SCSS, pruebas con Vitest. Backend Spring Boot 3 + Java + PostgreSQL + Spring Security (JWT), JPA/Flyway. Solo web (se descarto Flutter/movil). Arquitectura hexagonal por bounded context.

---

## 2026-09-21 (dominio)

**Type:** fact
**Tags:** dominio, contratos, alertas

Un "documento" es un Contrato con fechaInicio y fechaFin. Estados: borrador, vigente, por vencer, vencido, terminado, liquidado. Alertas de vencimiento por umbrales configurables (propuestos 30/15/7 y vencido); excluyen borrador, terminado y liquidado. Alertas se evaluan por job programado.

---

## 2026-09-21 (specs)

**Type:** note
**Tags:** specs, sdd

Specs creadas en specs/: 001-auth-login, 002-gestion-roles, 003-gestion-areas, 004-gestion-usuarios, 005-contrato-registro, 006-contrato-carga, 007-contratos-crud, 008-alertas-vencimiento, 009-dashboard-contratos, 010-auditoria-registros. Constitución en .specify/memory/constitution.md. Spec Kit inicializado con integracion opencode.

---

## 2026-09-21 (implementacion specs 005, 006, 007)

**Type:** decision
**Tags:** implementacion, specs, contratos, documentos

Implementados los specs 005 (Registro de Contratos), 006 (Carga de Documentos) y 007 (CRUD de Contratos) siguiendo arquitectura hexagonal:

**Core Domain:**
- Modelos: Contrato, EstadoContrato (enum), TipoContrato (enum), Moneda (enum), ArchivoAdjunto, Contratista, Area, Responsable
- Puertos: ContratoRepository, DocumentoRepository

**Application Layer:**
- ContratoUseCases: crear, listar (paginado/filtros), obtenerPorId, actualizar, eliminar, obtenerEstadisticas, validarFechas, validarCodigoUnico, calcularVencimiento
- DocumentoUseCases: subir (con validacion), listarPorContrato, descargar, eliminar

**Infrastructure (Mock):**
- ContratoMockRepository: 5 contratos demo (consultoria, suministros, servicios, arrendamiento, obras) con datos realistas, filtros, paginación, recalculo automatico de diasParaVencer y estado por vencimiento
- DocumentoMockRepository: 3 archivos demo, subida con validacion tipo/tamaño, descarga simulada, eliminacion logica

**Infrastructure (HTTP ready):**
- ContratoHttpRepository, DocumentoHttpRepository listos para Spring Boot backend

**Presentation (Angular Material):**
- ContratosLista: tabla con paginacion, ordenamiento, filtros multiples, chips de severidad vencimiento (normal/alerta/critico)
- ContratoFormulario: crear/editar con validaciones reactivas, fecha fin > inicio, codigo unico, guardado borrador, selecciones tipo/estado/moneda/area/responsable
- ContratoDetalle: tabs (info general, contratista, auditoria, documentos, historial), carga documentos via dialog
- DocumentoCargaDialog: drag&drop, multi-archivo, validacion cliente (PDF/DOCX/XLSX/imagenes, max 25MB), progreso, previsualizacion PDF/imagenes

**Rutas:**
/contratos (lista), /contratos/nuevo, /contratos/:id (detalle), /contratos/:id/editar

**Tests & Build:** `npm run build` y `npm test` pasan correctamente.

---

## 2026-09-21 (usuarios demo)

**Type:** fact
**Tags:** auth, usuarios, mock

Usuarios de prueba en AuthMockRepository:
- admin@demo.com / Admin123* (rol ADMIN, permisos: *)
- gestor@demo.com / Gestor123* (rol GESTOR, permisos: contratos.ver, crear, editar)