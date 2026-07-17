# Symptom Checker Triage Matrix

## Goal

Definir la matriz de triage conservadora del MVP de `Symptom Checker` para PetCareNow.

Este documento sirve como base para:

* priorización de atención
* reglas de corte
* UX del cuestionario
* validación veterinaria

No sirve para:

* diagnóstico
* tratamiento
* medicación
* cálculo de dosis

## Scope

### Species

* `dog`
* `cat`

### MVP Symptoms

* `vomiting`
* `diarrhea`
* `breathing_difficulty`
* `bleeding`
* `hazardous_ingestion`
* `urination_difficulty`

## Priority Levels

| Code | Visible Label | Definition | Action |
| --- | --- | --- | --- |
| `emergency` | Atención veterinaria inmediata | Existe compromiso potencialmente vital, deterioro rápido, obstrucción, hemorragia relevante o exposición peligrosa. | Detener flujo y mostrar CTA inmediato a urgencias. |
| `urgent` | Consulta veterinaria prioritaria | No hay una señal vital inequívoca en curso, pero la combinación de síntomas requiere evaluación el mismo día o dentro de horas. | Mantener CTA de llamada / reserva prioritaria. |
| `consult` | Consulta veterinaria recomendada | El cuadro parece estable, pero necesita revisión profesional programada. | Agendar consulta y explicar criterios de escalamiento. |
| `monitor` | Observación con seguimiento | Episodio aislado, paciente estable y sin banderas rojas aparentes. | Observación limitada con reevaluación y seguimiento. |

## Global Safety Rules

Las siguientes condiciones deben elevar el flujo a `emergency` sin importar el síntoma principal:

* colapso
* inconsciencia
* convulsión
* incapacidad para mantenerse de pie
* dificultad respiratoria activa
* mucosas azuladas, grises o muy pálidas

### Unknown Policy

Si una respuesta crítica queda como `unknown` y no permite descartar una bandera roja, el sistema debe escalar conservadoramente.

## Symptom Matrix

### `vomiting`

#### Mandatory observations

* número de episodios
* inicio
* tolerancia al agua
* sangre visible
* estado general
* abdomen distendido o doloroso
* posible ingestión peligrosa

#### Emergency

* arcadas repetidas improductivas + abdomen hinchado, duro o muy doloroso
* sangre relevante + debilidad marcada o palidez
* dificultad respiratoria o colapso
* posible tóxico, medicamento, químico o cuerpo extraño peligroso

#### Urgent

* vómitos repetidos + no retiene agua
* vómitos + diarrea + menor actividad
* vómitos repetidos en paciente vulnerable

#### Consult

* vómitos recurrentes o persistentes en paciente estable

#### Monitor

* episodio único
* estado general normal
* retiene agua
* no hay sangre
* no hay banderas rojas

#### Stop Flow

Detener de inmediato si aparece `emergency`.

### `diarrhea`

#### Mandatory observations

* frecuencia
* inicio
* sangre roja o heces negras
* vómitos asociados
* tolerancia al agua
* estado general
* dolor abdominal
* posible ingestión peligrosa

#### Emergency

* heces negras tipo alquitrán + debilidad o palidez
* sangrado importante o repetido + deterioro marcado
* colapso o dificultad respiratoria
* posible ingestión tóxica o peligrosa

#### Urgent

* diarrea frecuente + vómitos
* diarrea + no retiene agua
* diarrea en paciente vulnerable

#### Consult

* diarrea persistente o recurrente en paciente estable

#### Monitor

* episodio aislado
* sin sangre
* estado general normal
* bebe y tolera agua
* sin banderas rojas

#### Stop Flow

Detener en presencia de sangrado relevante, colapso, disnea o exposición peligrosa.

### `breathing_difficulty`

#### Mandatory observations

* si la dificultad respiratoria ocurre ahora
* si ocurre en reposo
* esfuerzo respiratorio marcado
* postura forzada
* respiración con boca abierta en gato
* color de encías
* si el episodio ya cedió o se repite

#### Emergency

* dificultad respiratoria activa
* gato respirando con boca abierta
* postura ortopneica o cuello extendido
* mucosas azuladas, grises o muy pálidas
* colapso o imposibilidad de mantenerse en pie

#### Urgent

* episodio respiratorio que ya cedió pero se repite
* respiración ruidosa nueva aunque el paciente esté estable

#### Consult

No se recomienda dejar este síntoma en `consult` sin validación veterinaria adicional.

#### Monitor

No se recomienda usar `monitor` para este síntoma en MVP.

#### Stop Flow

Siempre detener cuando la dificultad respiratoria sea actual o no pueda descartarse con seguridad.

### `bleeding`

#### Mandatory observations

* sitio del sangrado
* cantidad aparente
* si continúa activo
* trauma asociado
* debilidad o palidez
* dificultad respiratoria
* objeto incrustado

#### Emergency

* sangrado activo más que mínimo
* sangrado con palidez, debilidad marcada o dificultad respiratoria
* sangrado tras trauma importante
* objeto incrustado o herida penetrante
* sangrado por múltiples sitios

#### Urgent

* pocas gotas o vetas que ya cedieron, con paciente estable

#### Consult

* sangrado menor recurrente en paciente estable

#### Monitor

No se recomienda `monitor` por defecto para sangrado en MVP.

#### Stop Flow

Detener si el sangrado sigue activo, si la cantidad es incierta o si existe deterioro sistémico.

### `hazardous_ingestion`

#### Mandatory observations

* tipo de sustancia u objeto
* tiempo desde la exposición
* signos neurológicos
* signos respiratorios
* estado general
* si el objeto es batería, imán, hilo, cuerda, aguja, hueso o filo

#### Emergency

* exposición probable o confirmada a medicamento humano o veterinario
* exposición a químico, pesticida o rodenticida
* sustancia desconocida
* signos neurológicos, colapso o disnea
* cuerpo extraño de alto riesgo

#### Urgent

* exposición posible con paciente asintomático y sin criterios claros de alto riesgo

#### Consult

No se recomienda `consult` para este síntoma en MVP.

#### Monitor

No se recomienda `monitor` para este síntoma en MVP.

#### Stop Flow

Detener de inmediato. El flujo de ingestión peligrosa debe privilegiar velocidad sobre detalle.

### `urination_difficulty`

#### Mandatory observations

* si intenta orinar repetidamente
* si sale orina normal, gotas, nada o es incierto
* dolor al intentarlo
* presencia de sangre
* vómitos o debilidad
* trauma asociado
* sexo del animal

#### Emergency

* gato macho + dificultad o incapacidad para orinar
* intentos repetidos + gotas, nada o producción incierta
* dificultad para orinar + vómitos, debilidad marcada o colapso
* dificultad urinaria después de trauma

#### Urgent

* dolor al orinar con volumen aparentemente conservado
* sangre en orina con paciente estable

#### Consult

* cambio urinario recurrente con producción actual normal y paciente estable

#### Monitor

No se recomienda `monitor` para este síntoma en MVP.

#### Stop Flow

Detener si no se puede confirmar producción urinaria adecuada o si el paciente es gato macho con dificultad actual.

## Validation Notes

Todos los siguientes puntos requieren revisión veterinaria antes de producción:

* umbrales exactos de repetición
* definición visible de “poca” o “mucha” sangre
* ventana de observación en `monitor`
* clasificación final de diarrea y vómitos en pacientes vulnerables
* si `breathing_difficulty` puede tener algún escenario `consult` o `monitor`
