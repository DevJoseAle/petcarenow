# Auth Login

## Goal

Permitir que un usuario existente inicie sesión de forma segura con correo electrónico y contraseña para acceder al área autenticada de la aplicación.

## User Flow

1. El usuario abre la pantalla de Login.
2. El usuario visualiza branding, campos de correo y contraseña, acción principal y accesos secundarios.
3. El usuario ingresa su correo electrónico.
4. El usuario ingresa su contraseña.
5. El usuario toca "Iniciar Sesión".
6. El sistema valida los datos localmente antes de enviar la solicitud.
7. Si la autenticación es exitosa, el usuario es redirigido al flujo autenticado principal.
8. Si la autenticación falla, el usuario permanece en Login y ve un mensaje de error claro.
9. Si el usuario no tiene cuenta, puede navegar a Register.
10. Si el usuario olvidó su contraseña, puede iniciar el flujo de recuperación.

## Screens

### LoginScreen

Pantalla principal del flujo de acceso.

Contenido esperado:

* Logo o elemento visual de marca
* Título de bienvenida
* Campo de correo electrónico
* Campo de contraseña
* Botón principal de inicio de sesión
* Acción secundaria de recuperación de contraseña
* Acción secundaria para navegar a registro

Responsabilidades:

* Renderizar el formulario
* Mostrar estados visuales del formulario
* Delegar lógica al hook correspondiente

## States

### Initial

El formulario se muestra vacío y listo para interacción.

### Editing

El usuario está escribiendo en uno o ambos campos.

### Invalid

Existen errores de validación local y el formulario no debe enviarse.

### Submitting

Se ejecuta la autenticación remota. El botón principal debe deshabilitarse para evitar envíos duplicados.

### Success

La autenticación se completa correctamente y el usuario avanza al área autenticada.

### Error

La autenticación falla por credenciales inválidas, problema de red o error inesperado. Se muestra feedback visible y accionable.

## Validations

### Email

* Requerido
* Debe tener formato de correo válido
* Debe ignorar espacios accidentales al inicio y al final

### Password

* Requerida
* No debe enviarse vacía
* Debe preservar el valor exacto ingresado por el usuario, excepto espacios accidentales al inicio y al final si el equipo decide normalizar ese caso

### Form

* El envío solo ocurre si ambos campos son válidos
* Los errores deben mostrarse cerca del campo correspondiente o en una zona visible del formulario
* El formulario no debe permitir múltiples envíos simultáneos

## Error Handling

### Invalid Credentials

Mostrar un mensaje genérico y claro, por ejemplo indicando que el correo o la contraseña no son correctos.

### Network Error

Mostrar un mensaje que indique problema de conexión y permitir reintento.

### Unexpected Error

Mostrar un mensaje de error genérico sin exponer detalles internos.

### Session Persistence Error

Si la autenticación remota fue exitosa pero no se puede persistir la sesión local, mostrar error genérico y evitar navegación incompleta.

## Services

### Auth Service

Responsabilidad:

* Ejecutar login con Supabase usando correo y contraseña
* Normalizar la respuesta de éxito o error
* No contener lógica visual

Método esperado:

* `loginWithEmail(email, password)`

Resultado esperado:

* Usuario autenticado y sesión disponible
* Error tipado o normalizado para credenciales inválidas, red y error inesperado

## Store

### Auth Store

Responsabilidad:

* Mantener el estado global de sesión autenticada
* Exponer usuario actual, sesión y estado de carga inicial de auth si aplica

### Login Local State

El estado efímero del formulario debe vivir en el hook de la pantalla, no en store global, salvo que el equipo defina reutilización explícita entre pantallas.

Estado local esperado:

* `email`
* `password`
* `errors`
* `isSubmitting`
* `generalError`

## Tests

### Hook Tests

* Debe actualizar email y password correctamente
* Debe validar campos requeridos antes del submit
* Debe bloquear envío si hay errores locales
* Debe activar `isSubmitting` durante el request
* Debe navegar al área autenticada en login exitoso
* Debe exponer error general en fallo de autenticación

### Service Tests

* Debe llamar a Supabase con email y password
* Debe mapear credenciales inválidas a un error entendible por la UI
* Debe mapear errores de red
* Debe mapear errores inesperados

### Screen Tests

* Debe renderizar los campos y acciones principales
* Debe disparar submit desde el botón principal
* Debe navegar a Register al tocar la acción correspondiente
* Debe mostrar feedback visual en estado de error
* Debe deshabilitar el botón durante `Submitting`

## Acceptance Criteria

* El usuario puede ingresar correo y contraseña desde `LoginScreen`.
* El formulario valida campos requeridos antes de invocar autenticación remota.
* El login usa un servicio de autenticación separado de la pantalla.
* La pantalla muestra estado de carga mientras se procesa el login.
* La pantalla evita envíos duplicados durante la autenticación.
* Un login exitoso lleva al usuario al flujo autenticado principal.
* Un login fallido muestra un mensaje claro sin cerrar la pantalla.
* El usuario puede navegar a Register desde Login.
* El flujo contempla acceso a recuperación de contraseña.
* La lógica de presentación reside en hook y la lógica de integración reside en service.
