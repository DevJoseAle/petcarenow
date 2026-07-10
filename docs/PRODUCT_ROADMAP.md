# Product Roadmap

## Resumen

PetCareNow ya tiene resuelto el núcleo del MVP mobile:

- acceso y sesión
- onboarding inicial
- gestión completa de mascotas
- registros rápidos
- próximos cuidados y calendario
- emergencia con mapa/listado de veterinarias
- perfil enriquecido de veterinaria
- sección `Más` base con perfil y guardadas

La siguiente etapa ya no es de fundación, sino de cierre, calidad y producto.

## Estado Por Fase

### Fase 1. Fundación

- [x] Auth con Supabase
- [x] Persistencia de sesión
- [x] Profiles
- [x] Pets
- [x] Storage de fotos de mascota

### Fase 2. Core Pet Care

- [x] Onboarding inicial
- [x] Onboarding de mascota
- [x] CRUD de mascotas
- [x] Mascota activa
- [x] Home navegable
- [x] Registros rápidos
- [x] Calendario / cuidados

### Fase 3. Emergencia y descubrimiento

- [x] Entry de emergencia en Home
- [x] Listado de veterinarias
- [x] Mapa con ubicación actual
- [x] Filtros
- [x] Veterinarias guardadas
- [x] Perfil enriquecido de veterinaria

### Fase 4. Cuenta y utilidades

- [x] Perfil de usuario
- [x] Guardadas dentro de `Más`
- [x] Logout robusto
- [ ] Configuración
- [ ] Notificaciones
- [ ] Suscripción / Premium
- [ ] Ayuda
- [ ] Términos y privacidad

### Fase 5. Cierre MVP

- [ ] Deep links reales de auth validados punta a punta
- [ ] Migraciones productivas de veterinarias aplicadas
- [ ] Dataset real inicial de veterinarias
- [ ] Validación Android real
- [ ] Cobertura de tests reforzada
- [ ] Smoke test manual de flujos críticos

## Siguiente Roadmap Recomendado

### Sprint 1. Cerrar `Más`

Objetivo:
Completar todas las opciones visibles del menú para eliminar placeholders del MVP.

Entregables:

- Configuración
- Notificaciones
- Suscripción / Premium
- Ayuda
- Términos y privacidad

### Sprint 2. Datos reales de veterinarias

Objetivo:
Pasar de demo enriquecida a contenido útil para usuarios reales.

Entregables:

- schema real aplicado
- seed curado
- al menos 3 perfiles bien poblados
- revisión visual del perfil de veterinaria

### Sprint 3. Hardening de auth y release

Objetivo:
Cerrar flujos externos y validaciones de release.

Entregables:

- confirmación de cuenta real
- reset password real
- deep links documentados por ambiente
- Android con Google Maps validado

### Sprint 4. Calidad y salida MVP

Objetivo:
Reducir riesgo antes de distribuir ampliamente.

Entregables:

- tests faltantes de screens clave
- smoke test integral
- lista de bugs/UI polish final

## Riesgos Actuales

- El schema de `veterinaries` en Supabase real aún puede estar desalineado con la app.
- Los deep links de auth todavía requieren validación productiva completa.
- Android Maps necesita cierre real de configuración.
- Algunas opciones de `Más` siguen visibles como futuras.
