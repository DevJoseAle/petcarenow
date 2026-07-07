# Post-Auth Roadmap TODO

## Estado

- [x] Auth con persistencia de sesión
- [x] Onboarding inicial de usuario
- [x] Onboarding de primera mascota
- [x] Home base navegable
- [x] Tabs reales de la app
- [x] CRUD completo de mascotas
- [x] Perfil de cuidado
- [x] Registro rápido
- [x] Próximos cuidados / calendario
- [~] Emergencias y veterinarias
- [~] Veterinarias guardadas
- [x] Vacunas ocultas pero implementadas

## Backlog Activo

### Navegación

- [x] Reemplazar shell actual por tabs: Inicio, Mascotas, +, Calendario, Más
- [x] Dejar `pet-onboarding` como ruta oculta dentro del grupo autenticado
- [x] Agregar rutas ocultas para perfil de cuidado, detalle de mascota, registro rápido, creación de evento, veterinarias y perfil de veterinaria

### Datos

- [x] Mantener `pets` como entidad real de mascota
- [x] Implementar contratos de `pet_records`
- [x] Implementar contratos de `care_events`
- [x] Implementar contratos de `veterinaries`
- [x] Implementar contratos de `saved_veterinaries`
- [x] Conectar servicios reales con Supabase para `pet_records` y `care_events`
- [x] Conectar servicios reales con Supabase para `veterinaries` y `saved_veterinaries`

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
- [x] Permitir agregar mascota reutilizando el onboarding actual
- [x] Permitir editar mascota
- [x] Permitir eliminar mascota con confirmación

### Registros

- [x] Crear formulario base para peso, síntoma, medicación y nota
- [x] Guardar fecha/hora combinadas
- [x] Crear pantalla/tab dedicado de historial de registros
- [x] Crear detalle, edición y eliminación de registros
- [ ] Refrescar home luego del registro

### Calendario y Cuidados

- [x] Crear listado de eventos
- [x] Crear formulario de evento programado
- [x] Crear detalle, edición y eliminación de eventos
- [x] Mostrar eventos próximos en home
- [x] Exponer vacunas como subset de `care_events`

### Emergencia y Veterinarias

- [x] Crear listado de veterinarias
- [x] Crear mapa de veterinarias con `react-native-maps`
- [x] Solicitar ubicación actual con `expo-location`
- [x] Crear pantalla de perfil de veterinaria
- [x] Guardar/desguardar veterinarias favoritas
- [x] Mostrar veterinaria seleccionada del mapa en una sección destacada
- [x] Filtrar veterinarias cercanas por rango
- [x] Crear pantalla/listado de veterinarias guardadas dentro de `Más`
- [x] Ocultar en el listado la veterinaria ya seleccionada en el mapa
- [ ] Validar build Android real con API key de Google Maps
- [ ] Reemplazar seed/mock inicial por dataset curado final

### Más

- [x] Crear listado de opciones
- [x] Activar perfil de usuario
- [x] Activar veterinarias guardadas
- [x] Marcar opciones no implementadas con label `Próximamente`
- [x] Mantener placeholders para settings, premium, ayuda y legal
- [x] Mantener logout dentro de esta sección

## Siguiente HU

- HU-Más
- Objetivo: validar y pulir la HU antes de marcarla como cerrada.

## Notas

- `veterinaries` y `saved_veterinaries` ya tienen contrato, SQL, servicios y acceso desde `Más`. Falta validar completamente el flujo Android productivo.
- `pet_records` y `care_events` ya cuentan con contrato y servicios conectados a Supabase.
- Vacunas se implementan usando `care_events` con `event_type = vaccine`.
