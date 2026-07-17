# Symptom Checker

## Goal

Permitir que un usuario autenticado reciba una orientación segura y estructurada sobre el nivel de atención que podría requerir su mascota, sin entregar diagnóstico, tratamiento ni reemplazar una consulta veterinaria.

Esta HU debe resolver un MVP conservador enfocado en:

* detectar señales de alarma
* hacer preguntas guiadas y limitadas
* clasificar el nivel de atención
* recomendar el siguiente paso
* conectar con veterinarias cuando exista urgencia
* guardar el resultado en historial
* dejar preparado un contrato de datos para futura sincronización con backend

Esta HU no debe presentarse como:

* diagnóstico veterinario
* evaluación clínica definitiva
* indicación de medicamentos
* cálculo de dosis
* sustituto de un profesional

## Scope

### Síntomas cubiertos en MVP

El MVP inicial debe cubrir solo:

* vómitos
* diarrea
* dificultad respiratoria
* sangrado
* posible intoxicación o ingestión peligrosa
* incapacidad o dificultad para orinar

### Especies cubiertas en MVP

Solo:

* perros
* gatos

### Fuera de alcance en MVP

No forma parte obligatoria de esta HU:

* chat libre veterinario
* diagnósticos diferenciales
* recomendaciones de medicamentos
* análisis de exámenes
* fotografías de lesiones
* cobertura de animales exóticos
* seguimiento inteligente encadenado
* decisiones críticas delegadas totalmente a IA

## User Flow

1. El usuario autenticado entra al flujo `Symptom Checker`.
2. La app muestra una pantalla inicial breve con límites claros:
   * no entrega diagnóstico
   * no reemplaza al veterinario
   * ante señales graves debe buscar atención inmediata
3. El usuario selecciona una mascota.
4. Al confirmar la mascota, la app navega a una pantalla separada de conversación guiada.
5. La app presenta el flujo como una conversación guiada y controlada, no como un chat libre.
6. El usuario selecciona un síntoma principal desde un catálogo controlado.
7. El sistema ejecuta reglas iniciales de seguridad.
8. Si detecta una bandera roja inmediata:
   * detiene el flujo
   * muestra resultado de emergencia
   * ofrece acceso rápido a veterinarias
9. Si no detecta emergencia inmediata:
   * muestra preguntas guiadas del síntoma seleccionado
10. El usuario responde el cuestionario mediante respuestas rápidas y mensajes estructurados.
11. El motor determinístico calcula el nivel de atención.
12. La app muestra un resultado controlado:
    * emergencia
    * urgente
    * consulta recomendada
    * vigilancia
13. El usuario puede:
    * guardar la evaluación
    * revisar historial local de chequeos
    * abrir veterinarias
    * volver al home

## Screens

### SymptomCheckerIntroScreen

Pantalla inicial del flujo.

Debe mostrar:

* título claro
* límites del sistema
* disclaimer explícito
* CTA para comenzar
* transición clara a la selección de mascota

### SymptomCheckerPetSelectionScreen

Permite seleccionar la mascota que será evaluada.

Debe mostrar:

* mascotas activas del usuario
* CTA para continuar
* feedback si no hay mascota disponible
* navegación a la pantalla conversacional

### SymptomCheckerConversationScreen

Pantalla principal de conversación guiada.

Debe mostrar:

* mensajes del sistema en formato conversacional
* selección de síntoma integrada dentro de la conversación
* respuestas controladas tipo opciones rápidas
* contexto acumulado de mascota y síntoma
* una pregunta por vez o bloques muy acotados
* opción para cancelar o volver

### SymptomCheckerEmergencyResultScreen

Resultado prioritario cuando el sistema detecta riesgo alto.

Debe mostrar:

* recomendación clara de buscar atención inmediata
* razones generales no diagnósticas
* CTA a veterinarias
* CTA para llamar o abrir ruta si ya existe soporte

### SymptomCheckerResultScreen

Resultado no emergente.

Debe mostrar:

* nivel de atención
* explicación controlada
* siguiente paso recomendado
* CTA a veterinarias si aplica
* CTA para guardar evaluación

## States

### SymptomCheckerIdle

El flujo aún no comienza.

### SymptomCheckerSelectingPet

El usuario está eligiendo mascota.

### SymptomCheckerSelectingSymptom

El usuario está eligiendo síntoma principal.

### SymptomCheckerCheckingEmergency

El sistema valida banderas rojas iniciales.

### SymptomCheckerAskingQuestions

El cuestionario guiado está activo.

### SymptomCheckerEvaluating

El motor está calculando el nivel de atención final.

### SymptomCheckerCompleted

La evaluación fue completada y existe resultado.

### SymptomCheckerEmergencyRedirected

Se detectó una situación que requiere atención inmediata.

### SymptomCheckerCancelled

El usuario salió del flujo antes de completarlo.

## Validations

### Clinical Safety Rules

* el flujo no debe emitir diagnósticos
* el flujo no debe recomendar medicamentos ni dosis
* el flujo debe ser conservador si falta información importante
* las reglas determinísticas deben tener prioridad sobre cualquier capa de IA futura

### Product Rules

* el usuario debe seleccionar una mascota antes de evaluar síntomas
* el síntoma principal debe provenir de un catálogo controlado en MVP
* la UI puede sentirse como chat, pero no debe convertirse en un chat libre
* las respuestas deben seguir siendo controladas por catálogo y reglas
* el resultado debe enfocarse en prioridad de atención, no en enfermedad probable

### Emergency Rules

* si se detecta una bandera roja crítica, el flujo debe detener preguntas no necesarias
* la pantalla de emergencia debe priorizar acción rápida
* la recomendación debe ser explícita y prudente

### Messaging Rules

El sistema sí puede decir:

* `Esto requiere atención veterinaria inmediata.`
* `Te recomendamos consultar con una veterinaria hoy.`
* `Por ahora conviene vigilar de cerca y buscar ayuda si empeora.`

El sistema no debe decir:

* `Tiene gastritis.`
* `Seguro no es grave.`
* `Dale este medicamento.`
* `No necesitas ir al veterinario.`

### Scope Rules

Si el usuario intenta usar el flujo para algo fuera del alcance del MVP:

* la app debe reconocer que no cubre ese caso todavía
* debe invitar a contactar una veterinaria si hay preocupación

## Error Handling

### Catalog Load Error

Si fallan el catálogo o las preguntas:

* debe mostrarse error claro
* debe existir retry
* no debe quedar la pantalla en blanco

### Evaluation Error

Si falla el cálculo o guardado del resultado:

* el usuario debe recibir feedback claro
* el flujo debe seguir estable
* debe existir reintento si corresponde

### Local Persistence Rules

* cada evaluación cerrada debe persistirse localmente en el dispositivo
* el historial local debe poder listarse sin depender de Supabase
* la estructura persistida debe incluir un estado de sincronización para backend futuro

### No Pets Error

Si el usuario no tiene mascotas activas:

* el flujo no puede continuar
* debe ofrecer CTA para registrar mascota

### Out Of Scope Error

Si el caso no entra en el alcance actual:

* debe mostrarse un mensaje honesto
* debe evitarse improvisar respuestas

## Services

### Symptom Checker Service

Responsabilidad:

* orquestar el flujo de evaluación
* cargar catálogo, preguntas y reglas
* evaluar respuestas
* producir resultado controlado
* guardar historial

Métodos esperados:

* `getSupportedSymptoms()`
* `getQuestionsForSymptom(symptomCode, petContext)`
* `evaluateAssessment(input)`
* `saveAssessment(result)`

### Symptom Rules Service

Responsabilidad:

* ejecutar reglas determinísticas
* detectar banderas rojas
* determinar el nivel mínimo de atención

Métodos esperados:

* `checkInitialEmergencyFlags(input)`
* `evaluateRiskLevel(input)`

### Optional AI Gateway

No es obligatorio para MVP inicial.

Si se incorpora después, debe quedar estrictamente acotado a:

* extracción de síntomas desde texto libre
* selección limitada de siguiente pregunta desde catálogo
* redacción controlada del mensaje final

La IA no debe:

* bajar el nivel de riesgo definido por reglas
* inventar preguntas
* emitir diagnósticos

## Store

Puede resolverse con un store dedicado o estado local según complejidad del flujo.

Responsabilidades mínimas:

* mascota seleccionada
* síntoma principal seleccionado
* progreso del cuestionario
* respuestas
* estado actual del flujo
* resultado final

## Data

### Persistencia mínima recomendada para MVP

Como mínimo:

* `symptom_assessments`
* `symptom_assessment_answers`
* `symptom_assessment_results`
* `symptom_catalog`
* `symptom_questions`
* `emergency_rules`

No es obligatorio iniciar con tablas más analíticas o avanzadas mientras no aporten valor inmediato al MVP.

## Clinical Input Artifact

Sí, conviene crear un documento separado con combinaciones de síntomas y señales de alerta.

Pero ese documento no debe plantearse como:

* diagnóstico por combinaciones
* verdad clínica definitiva

Debe plantearse como:

* matriz de triage
* guía de banderas rojas
* base para reglas conservadoras del sistema

Contenido sugerido:

* síntoma principal
* especie aplicable
* edad o contexto de riesgo
* combinación de señales de alerta
* nivel mínimo de atención
* preguntas obligatorias
* acciones prohibidas
* observaciones del veterinario asesor

Ejemplo de enfoque correcto:

* `gato macho + no puede orinar -> emergencia`
* `dificultad respiratoria actual -> emergencia`
* `vómitos repetidos + no retiene agua -> urgente`

Ese artefacto debe ser revisado por un veterinario antes de traducirse a reglas de producto.

## Tests

### Rules Tests

* detecta banderas rojas
* eleva correctamente el nivel de atención
* nunca baja el riesgo por debajo del piso definido

### Flow Tests

* no permite avanzar sin mascota
* no permite avanzar sin síntoma principal
* detiene el flujo cuando corresponde a emergencia
* renderiza el resultado correcto por nivel

### Service Tests

* carga catálogo y preguntas
* evalúa respuestas de forma determinística
* guarda resultados correctamente

### Scope Tests

* rechaza casos fuera de alcance
* evita respuestas libres o diagnósticas

## Acceptance Criteria

* existe un flujo real de `Symptom Checker` dentro de la app
* el flujo está limitado a perros y gatos
* el flujo cubre solo los síntomas definidos para MVP
* el usuario recibe una orientación de prioridad de atención, no un diagnóstico
* las emergencias se detectan con reglas determinísticas
* la UI conecta con veterinarias cuando corresponde
* la evaluación puede guardarse en historial
* la arquitectura deja espacio para integrar IA después sin rehacer el dominio
