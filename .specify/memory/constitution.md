# Contrataciones Constitution

Sistema de gestion de contratos (web). Documento de gobierno de la arquitectura,
el desarrollo y la calidad del proyecto.

## Core Principles

### I. Arquitectura Hexagonal (NON-NEGOTIABLE)

Todo el desarrollo, backend y frontend, sigue arquitectura de puertos y adaptadores.

- La regla de dependencia apunta siempre hacia el interior: `infraestructura` -> `aplicacion` -> `dominio`.
- El dominio (entidades, objetos de valor, reglas de negocio y puertos) MUST NOT depender de frameworks, HTTP, persistencia ni librerias de UI.
- Todo acceso a recursos externos (base de datos, API REST, sistema de archivos, email, notificaciones) entra por un puerto y se implementa en un adaptador.
- El backend se organiza por bounded context: `auth`, `usuarios`, `roles`, `areas`, `contratos`, `documentos`, `alertas`, `auditoria`, `dashboard`. Cada contexto contiene `domain/`, `application/` e `infrastructure/`.
- El frontend replica el patron: `core/domain` (modelos y puertos), `core/application` (casos de uso/facades), `infrastructure` (adaptadores HTTP, storage, interceptores) y `presentation` (features/paginas). Los componentes dependen de casos de uso, nunca directamente de `HttpClient`.

### II. Spec-Driven Development (NON-NEGOTIABLE)

La especificacion precede a la implementacion.

- Todo trabajo funcional parte de una spec en `specs/` y sigue el flujo: `specify` -> `clarify` -> `plan` -> `checklist` -> `tasks` -> `analyze` -> `implement`.
- Los **requerimientos funcionales** se redactan primero y se validan; los **requerimientos no funcionales** se incorporan en una segunda pasada que los cruza con los funcionales.
- No se escribe codigo sin tareas derivadas de una spec aprobada.
- Los requisitos ambiguos se marcan como `[NEEDS CLARIFICATION]` y se resuelven en `clarify`, no se asumen silenciosamente.

### III. Contrato de API Primero

El contrato de API (OpenAPI) es el puerto de entrada del backend y el puerto de salida del frontend.

- Toda interaccion entre frontend y backend se define antes de implementar cualquiera de los dos lados.
- Frontend y backend pueden avanzar en paralelo contra el contrato; en frontend se usan datos mock hasta que el endpoint exista.

### IV. Seguridad por Diseno

- Toda accion esta sujeta a permisos de rol (RBAC), validados en backend y reflejados en la UI.
- La autenticacion usa JWT; el token se almacena de forma segura y se adjunta mediante interceptor.
- El backend no confia en validaciones del cliente: toda regla de negocio se revalida en servidor.

### V. Testing por Capa

- Dominio: pruebas unitarias puras, sin infraestructura.
- Aplicacion: pruebas de casos de uso con dobles de puertos.
- Infraestructura: pruebas de integracion de adaptadores (web, persistencia, storage).
- La cobertura de la logica de negocio critica (estados de contrato, calculo de vencimiento, permisos) es obligatoria.

## Stack Tecnologico

- **Frontend**: Angular 22 (standalone) + Angular Material + SCSS, pruebas con Vitest.
- **Backend**: Spring Boot 3 + Java + PostgreSQL, Spring Security (JWT), JPA / Flyway.
- **Persistencia**: PostgreSQL; migraciones versionadas con Flyway.
- **Archivos**: almacenamiento abstraido por puerto (local en desarrollo, S3/MinIO preparado para produccion).
- **Documentacion / UI**: espanol.

## Restricciones y Convenciones

- **Idioma**: documentacion, especificaciones y UI en espanol; codigo e identificadores en ingles.
- **Dominio**: un "documento" es un **contrato**, con fecha de inicio y fin, y control de vencimiento por umbrales.
- **Estados de contrato**: borrador, vigente, por vencer, vencido, terminado, liquidado.
- **Simplicidad (YAGNI)**: no agregar capas, abstracciones ni dependencias sin una necesidad justificada por la spec.
- **Formato**: Prettier para el frontend; convenciones de Java/Spring para el backend.

## Flujo de Trabajo y Calidad

- Ramas y features siguen la numeracion de `specs/` (`###-nombre`).
- Cada feature se desarrolla, prueba y demuestra de forma independiente (historia P1 = MVP).
- Antes de cerrar una feature: pruebas en verde, `analyze` sin hallazgos criticos y verificacion contra los criterios de aceptacion.
- Los cambios de arquitectura requieren actualizar esta constitucion y justificarse.

## Governance

- Esta constitucion prevalece sobre cualquier practica o preferencia no documentada.
- Toda spec, plan y tarea debe respetar y verificar estos principios.
- Las enmiendas requieren documentacion del cambio, justificacion y actualizacion de version.
- Las violaciones a la regla de dependencia hexagonal o al flujo SDD bloquean la implementacion.

**Version**: 1.0.0 | **Ratified**: 2026-09-21 | **Last Amended**: 2026-09-21