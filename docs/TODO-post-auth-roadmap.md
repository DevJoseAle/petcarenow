# Post-Auth Roadmap TODO

## Estado

- [x] Auth con persistencia de sesión
- [x] Onboarding inicial de usuario
- [x] Onboarding de primera mascota
- [x] Home base navegable
- [x] Tabs reales de la app
- [ ] CRUD completo de mascotas
- [ ] Perfil de cuidado
- [ ] Registro rápido
- [ ] Próximos cuidados / calendario
- [ ] Emergencias y veterinarias
- [ ] Veterinarias guardadas
- [ ] Vacunas ocultas pero implementadas

## Backlog Activo

### Navegación

- [x] Reemplazar shell actual por tabs: Inicio, Mascotas, +, Calendario, Más
- [x] Dejar `pet-onboarding` como ruta oculta dentro del grupo autenticado
- [x] Agregar rutas ocultas para perfil de cuidado, detalle de mascota, registro rápido, creación de evento, veterinarias y perfil de veterinaria

### Datos

- [ ] Mantener `pets` como entidad real de mascota
- [x] Implementar contratos de `pet_records`
- [x] Implementar contratos de `care_events`
- [x] Implementar contratos de `veterinaries`
- [x] Implementar contratos de `saved_veterinaries`
- [x] Conectar servicios mock-first mientras no existan tablas nuevas en Supabase

### Home

- [x] Construir home visual alineado al diseño externo
- [x] Mostrar mascota activa real
- [x] Mostrar CTA de cambio de mascota si hay más de una
- [x] Implementar card de emergencia con menú
- [x] Implementar registro rápido con accesos directos
- [x] Implementar próximos cuidados con eventos
- [x] Implementar card de perfil de cuidado
- [x] Dejar vacunas listas detrás de flag

### Mascotas

- [x] Crear store global de mascota activa
- [x] Listar mascotas del usuario
- [x] Seleccionar mascota activa
- [ ] Permitir agregar mascota reutilizando el onboarding actual
- [ ] Permitir editar mascota
- [ ] Permitir eliminar mascota con confirmación

### Registros

- [ ] Crear formulario base para peso, síntoma, medicación y nota
- [ ] Guardar fecha/hora combinadas
- [ ] Refrescar home luego del registro

### Calendario y Cuidados

- [ ] Crear listado de eventos
- [ ] Crear formulario de evento programado
- [ ] Mostrar eventos próximos en home
- [ ] Exponer vacunas como subset de `care_events`

### Emergencia y Veterinarias

- [ ] Crear listado de veterinarias
- [ ] Crear mapa/listado placeholder sin librería de mapas adicional
- [ ] Crear pantalla de perfil de veterinaria
- [ ] Guardar/desguardar veterinarias favoritas

### Más

- [x] Crear listado de opciones
- [ ] Activar perfil de usuario
- [ ] Activar veterinarias guardadas
- [x] Mantener placeholders para settings, premium, ayuda y legal
- [x] Mantener logout dentro de esta sección

## Siguiente HU

- HU-Mascotas
- Objetivo: cerrar el CRUD completo de mascotas con alta adicional, edición, eliminación con confirmación y mejor flujo de mascota activa.

## Notas

- `veterinaries` y `saved_veterinaries` se implementan mock-first dentro de la app hasta que existan tablas.
- `pet_records` y `care_events` quedan con servicios listos para intercambiar el backend sin rehacer pantallas.
- Vacunas se implementan usando `care_events` con `event_type = vaccine`.
