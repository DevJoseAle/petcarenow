# Subscription Dev Scripts

## Goal

Documentar los scripts de desarrollo relacionados con Expo y RevenueCat para que cualquier dev pueda levantar la app en el entorno correcto sin mezclar:

* `RevenueCat Test Store`
* `Apple Sandbox / App Store`
* `Expo Go preview`

## Important Context

### RevenueCat Test Store

Se usa para simular compras directamente desde RevenueCat.

Características:

* no depende de App Store Connect
* no reutiliza compras hechas en Apple sandbox
* requiere que la app corra con `EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=true`

### Apple Sandbox / App Store

Se usa para validar productos y compras reales de Apple.

Características:

* usa la API key pública de Apple en RevenueCat
* las compras aparecen como `Sandbox Data` en RevenueCat
* no reutiliza compras hechas en `Test Store`
* requiere que la app corra con `EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=false`

### Expo Go

Expo Go solo sirve para preview de UI y flujos básicos.

No debe usarse para validar compras reales ni restauración efectiva.

## Script Reference

### Generic Expo

#### `npm run start`

Inicia Expo con la configuración actual del entorno.

Úsalo cuando:

* no necesitas limpiar Metro
* no estás cambiando entre `test_store` y `app_store`

#### `npm run start:dev`

Alias simple de `expo start`.

Úsalo igual que `npm run start`.

### Cleanup

#### `npm run doctor:expo`

Limpia procesos Expo del proyecto, borra watches de Watchman y elimina `.expo`.

Úsalo cuando:

* Metro quedó pegado
* Expo dejó procesos zombis
* vas a arrancar desde cero

#### `npm run start:clean`

Ejecuta `doctor:expo` y luego arranca Expo con caché limpia.

Útil cuando:

* Metro está inestable
* cambiaste configuración de Expo
* quieres un arranque limpio sin cambiar el modo de RevenueCat

### RevenueCat Modes

#### `npm run start:teststore`

Inicia Expo forzando:

```bash
EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=true
```

Úsalo cuando:

* quieras probar compras simuladas con `RevenueCat Test Store`
* no quieras depender de Apple sandbox

No esperes ver aquí compras hechas en App Store sandbox.

#### `npm run start:appstore`

Inicia Expo forzando:

```bash
EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=false
```

Úsalo cuando:

* quieras probar compras sandbox reales de Apple
* quieras leer productos configurados desde App Store Connect

No esperes ver aquí compras hechas en `Test Store`.

#### `npm run start:clean:teststore`

Limpia Expo y luego levanta la app en `Test Store`.

Es el script recomendado cuando:

* vienes de haber probado `app_store`
* quieres evitar que Metro conserve env viejo

#### `npm run start:clean:appstore`

Limpia Expo y luego levanta la app en modo Apple sandbox / App Store.

Es el script recomendado cuando:

* vienes de haber probado `test_store`
* quieres validar compras sandbox reales

## iOS Native / Dev Build

#### `npm run ios`

Ejecuta `expo run:ios`.

Úsalo cuando:

* quieras compilar o instalar el dev build iOS
* no necesites forzar un modo específico

#### `npm run ios:dev`

Corre `expo run:ios` apuntando al dispositivo:

* `iPhone 16e`

Útil cuando:

* quieres usar siempre ese simulador

#### `npm run ios:clean`

Limpia Expo y luego compila/instala iOS sobre `iPhone 16e`.

Úsalo cuando:

* el build nativo se desalineó
* el simulador no tiene el dev build correcto

#### `npm run ios:clean:teststore`

Limpia Expo y compila/instala el dev build iOS con:

```bash
EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=true
```

Úsalo cuando:

* quieras probar `Test Store` en un dev build fresco

#### `npm run ios:clean:appstore`

Limpia Expo y compila/instala el dev build iOS con:

```bash
EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=false
```

Úsalo cuando:

* quieras probar Apple sandbox en un dev build fresco

## Recommended Flows

### Validate RevenueCat Test Store

1. Ejecutar `npm run start:clean:teststore`
2. Abrir el dev build
3. Entrar a `Suscripción / Premium`
4. Confirmar que la pantalla muestre `Modo: test_store`
5. Hacer la compra de prueba desde ese entorno

### Validate Apple Sandbox

1. Ejecutar `npm run start:clean:appstore`
2. Abrir el dev build
3. Entrar a `Suscripción / Premium`
4. Confirmar que la pantalla muestre `Modo: app_store`
5. Probar la compra sandbox de Apple

## Common Mistakes

### The subscription exists in RevenueCat but the app shows free

La causa más común es que el build esté apuntando al entorno equivocado.

Ejemplos:

* compra hecha en `Sandbox Data`, pero la app está en `test_store`
* compra hecha en `Test Store`, pero la app está en `app_store`

### Reload was not enough

Cambiar entre `test_store` y `app_store` no siempre se refleja con un simple reload.

Usar preferentemente:

* `npm run start:clean:teststore`
* `npm run start:clean:appstore`

### Expo was slow or stuck

Si Metro o Expo se quedan pegados:

1. ejecutar `npm run doctor:expo`
2. volver a arrancar con un script `start:clean:*`

## Debug Signal in App

La pantalla `Suscripción / Premium` muestra datos útiles de diagnóstico:

* `Modo`
* `App User ID`
* `Original App User ID`

Esto ayuda a validar:

* qué store está usando el build actual
* qué identidad de RevenueCat está leyendo la app

