# PetCareNow MVP TODO

## Estado General

### Base de producto

* [x] Arquitectura feature-first activa
* [x] Expo Router con shell autenticado
* [x] Zustand para auth, onboarding y mascota activa
* [x] Supabase integrado
* [x] Persistencia de sesión
* [x] Upload de foto de mascota a Storage

### Auth

* [x] Crear cuenta
* [x] Iniciar sesión
* [x] Cerrar sesión
* [x] Persistencia de sesión
* [x] Recuperar contraseña
* [x] Pantalla de actualización de contraseña
* [ ] Deep links productivos completos para auth
* [ ] Validación final de correo desde link real end-to-end

### Onboarding

* [x] Onboarding inicial de usuario
* [x] Persistencia local de onboarding completado
* [x] Redirección sin volver atrás al login
* [x] Onboarding de primera mascota
* [x] DatePicker nativo para mascota
* [x] Selección local de foto
* [x] Subida real de foto a bucket `pet-photos`

### Mascotas

* [x] Listado de mascotas
* [x] Selección de mascota activa
* [x] Crear mascota
* [x] Editar mascota
* [x] Eliminado lógico usando `isActive`
* [x] Cambio de foto al crear/editar
* [x] Redirección a empty state cuando no hay mascotas activas
* [x] Perfil de mascota editable

### Home

* [x] Home visual navegable
* [x] Card de mascota activa
* [x] CTA de cambio de mascota
* [x] Card de emergencia
* [x] Registro rápido en Home
* [x] Próximos cuidados en Home
* [x] Perfil de cuidado en Home
* [x] Vacunas implementadas detrás de flag / ocultas

### Registros

* [x] Tab de registros
* [x] Crear peso
* [x] Crear síntoma
* [x] Crear medicación
* [x] Crear nota
* [x] Listado de registros
* [x] Detalle de registro
* [x] Editar registro
* [x] Eliminar registro
* [x] Pull to refresh

### Calendario y cuidados

* [x] Tab de calendario
* [x] Crear evento futuro
* [x] Listado de eventos
* [x] Detalle de evento
* [x] Editar evento
* [x] Eliminar evento
* [x] Próximos cuidados conectados a eventos reales

### Emergencia y veterinarias

* [x] Menú de emergencia desde Home
* [x] Mapa de veterinarias
* [x] Listado de veterinarias
* [x] Permisos de ubicación con `expo-location`
* [x] Filtros de veterinarias
* [x] Guardar veterinarias favoritas
* [x] Pantalla de veterinarias guardadas
* [x] Perfil enriquecido de veterinaria
* [x] Sección seleccionada desde mapa
* [ ] Dataset final curado de veterinarias
* [ ] Validación Android real con Google Maps configurado
* [ ] Migración aplicada en Supabase para schema enriquecido de veterinarias

### Más

* [x] Perfil de usuario
* [x] Veterinarias guardadas
* [x] Logout
* [x] Placeholders marcados como `Próximamente`
* [x] Configuración
* [ ] Notificaciones
* [ ] Suscripción / Premium
* [ ] Ayuda
* [ ] Términos y privacidad

## Testing

* [x] Tests de auth críticos
* [x] Tests de servicios de mascotas
* [x] Tests de veterinarias principales
* [ ] Tests de screens de Home
* [ ] Tests de screens de Mascotas
* [ ] Tests de screens de Registros
* [ ] Tests de screens de Calendario
* [ ] Tests de screens de Más
* [ ] Smoke test end-to-end manual del flujo completo

## Cierre MVP

* [ ] Aplicar migraciones pendientes en Supabase productivo
* [ ] Curar contenido real mínimo de veterinarias
* [ ] Cerrar features pendientes de `Más`
* [ ] Validar deep links reales de auth
* [ ] Validar Android e iOS en builds reales
