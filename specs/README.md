# Especificaciones — Contrataciones

Sistema de gestion de contratos (web). Documento = contrato, con fecha de inicio/fin
y alertas de vencimiento.

- **Constitucion**: `.specify/memory/constitution.md`
- **Memoria del proyecto**: `memories.md`

## Orden de desarrollo

| # | Spec | Modulo | Prioridad | Depende de |
|---|------|--------|-----------|------------|
| 001 | [auth-login](001-auth-login/spec.md) | Autenticacion y login | P1 | — |
| 002 | [gestion-roles](002-gestion-roles/spec.md) | Roles y permisos | P1 | 001 |
| 003 | [gestion-areas](003-gestion-areas/spec.md) | Areas/departamentos | P1 | 001 |
| 004 | [gestion-usuarios](004-gestion-usuarios/spec.md) | Usuarios | P1 | 001, 002, 003 |
| 005 | [contrato-registro](005-contrato-registro/spec.md) | Alta de contratos | P1 | 004 |
| 006 | [contrato-carga](006-contrato-carga/spec.md) | Carga de documentos | P1 | 005 |
| 007 | [contratos-crud](007-contratos-crud/spec.md) | CRUD de contratos | P1 | 005, 006 |
| 008 | [alertas-vencimiento](008-alertas-vencimiento/spec.md) | Alertas de vencimiento | P1 | 005, 007 |
| 009 | [dashboard-contratos](009-dashboard-contratos/spec.md) | Dashboard | P3 | 007, 008 |
| 010 | [auditoria-registros](010-auditoria-registros/spec.md) | Bitacora y auditoria | P2 | transversal |

## Flujo SDD por feature

`/speckit.clarify` -> `/speckit.plan` -> `/speckit.checklist` -> `/speckit.tasks` -> `/speckit.analyze` -> `/speckit.implement`

La feature activa se registra en `.specify/feature.json`.