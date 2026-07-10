# Post-Auth Roadmap TODO

## Estado Actual

- [x] Auth completo base: registro, login, logout, persistencia y recuperación
- [x] Onboarding inicial de usuario
- [x] Onboarding de primera mascota
- [x] Home shell con tabs reales
- [x] CRUD completo de mascotas
- [x] Perfil de mascota / cuidado editable
- [x] Registro rápido e historial de registros
- [x] Próximos cuidados y calendario
- [x] Emergencias y veterinarias
- [x] Veterinarias guardadas
- [x] Perfil enriquecido de veterinaria
- [x] Más con perfil de usuario y guardadas
- [ ] Configuración
- [ ] Notificaciones
- [ ] Suscripción / Premium
- [ ] Ayuda
- [ ] Términos y privacidad

## HUs Cerradas

- [x] HU-Auth Login
- [x] HU-Home Shell
- [x] HU-Mascotas
- [x] HU-Perfil de cuidado
- [x] HU-Registro rápido
- [x] HU-Próximos cuidados / Calendario
- [x] HU-Emergencia + Veterinarias
- [x] HU-Veterinary Rich Profile
- [x] HU-Más v1

## Pendientes Reales

### Auth y acceso

- [ ] Validar flujo completo de confirmación de correo vía deep link real
- [ ] Validar recuperación de contraseña vía deep link real
- [ ] Documentar configuración final de deep links por ambiente

### Veterinarias

- [ ] Aplicar schema enriquecido en Supabase real
- [ ] Poblar al menos 3 veterinarias con contenido completo
- [ ] Curar imágenes/logo/cover reales o definitivas
- [ ] Validar Android real con Google Maps API key

### Más

- [ ] Crear pantalla de Configuración
- [ ] Crear pantalla de Notificaciones
- [ ] Crear pantalla de Suscripción / Premium
- [ ] Crear pantalla de Ayuda
- [ ] Crear pantalla de Términos y privacidad

### Calidad

- [ ] Completar suite de tests de screens críticas
- [ ] Ejecutar smoke test manual del flujo completo post-auth
- [ ] Revisar consistencia visual final entre Home, Veterinarias, Mascotas y Más

## Orden Recomendado

1. Cerrar `Más` completo:
   Configuración, Notificaciones, Premium, Ayuda, TYC.
2. Normalizar Supabase real de veterinarias:
   migración + seed curado.
3. Validar flujos reales de auth con deep links.
4. Fortalecer tests y smoke tests MVP.

## Notas

- El roadmap original post-auth ya no está en etapa de construcción base.
- La mayoría de los módulos core del MVP ya están implementados.
- Lo que queda ahora es principalmente:
  cierre funcional de `Más`, estabilización de datos reales y validación productiva.
