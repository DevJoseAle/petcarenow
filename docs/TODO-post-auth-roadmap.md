# Post-Auth Roadmap TODO

## Estado

- [x] Auth con persistencia de sesión
- [x] Onboarding inicial de usuario
- [x] Onboarding de primera mascota
- [x] Home base navegable
- [ ] Tabs reales de la app
- [ ] CRUD completo de mascotas
- [ ] Perfil de cuidado
- [ ] Registro rápido
- [ ] Próximos cuidados / calendario
- [ ] Emergencias y veterinarias
- [ ] Veterinarias guardadas
- [ ] Vacunas ocultas pero implementadas

## Backlog Activo

### Navegación

- [ ] Reemplazar shell actual por tabs: Inicio, Mascotas, +, Calendario, Más
- [ ] Dejar `pet-onboarding` como ruta oculta dentro del grupo autenticado
- [ ] Agregar rutas ocultas para perfil de cuidado, detalle de mascota, registro rápido, creación de evento, veterinarias y perfil de veterinaria

### Datos

- [ ] Mantener `pets` como entidad real de mascota
- [ ] Implementar contratos de `pet_records`
- [ ] Implementar contratos de `care_events`
- [ ] Implementar contratos de `veterinaries`
- [ ] Implementar contratos de `saved_veterinaries`
- [ ] Conectar servicios mock-first mientras no existan tablas nuevas en Supabase

### Home

- [ ] Construir home visual alineado al diseño externo
- [ ] Mostrar mascota activa real
- [ ] Mostrar CTA de cambio de mascota si hay más de una
- [ ] Implementar card de emergencia con menú
- [ ] Implementar registro rápido con accesos directos
- [ ] Implementar próximos cuidados con eventos
- [ ] Implementar card de perfil de cuidado
- [ ] Dejar vacunas listas detrás de flag

### Mascotas

- [ ] Crear store global de mascota activa
- [ ] Listar mascotas del usuario
- [ ] Seleccionar mascota activa
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

- [ ] Crear listado de opciones
- [ ] Activar perfil de usuario
- [ ] Activar veterinarias guardadas
- [ ] Mantener placeholders para settings, premium, ayuda y legal
- [ ] Mantener logout dentro de esta sección

## Notas

- `veterinaries` y `saved_veterinaries` se implementan mock-first dentro de la app hasta que existan tablas.
- `pet_records` y `care_events` quedan con servicios listos para intercambiar el backend sin rehacer pantallas.
- Vacunas se implementan usando `care_events` con `event_type = vaccine`.
