# Symptom Checker Rule Catalog

## Goal

Traducir la lógica clínica conservadora del MVP a reglas de producto entendibles por backend, frontend y QA.

## Rule Engine Policy

* El motor usa `MAX_PRIORITY`.
* Una regla puede establecer un piso de prioridad.
* Si `stop_flow=true`, la UI debe dejar de pedir preguntas no esenciales.
* `unknown` en preguntas críticas puede escalar el riesgo si impide descartar una bandera roja.
* Ninguna capa de IA puede bajar la prioridad definida por reglas.

## Rule Table

| Rule Code | Symptom | Trigger Condition | Min Priority | Stop Flow | Notes |
| --- | --- | --- | --- | --- | --- |
| `GLOBAL_001` | `any` | colapso, inconsciencia, convulsión o incapacidad para mantenerse en pie | `emergency` | `true` | Regla transversal. |
| `GLOBAL_002` | `any` | dificultad respiratoria activa o mucosas azuladas/grisáceas | `emergency` | `true` | Regla transversal. |
| `GLOBAL_003` | `any` | una respuesta crítica queda como `unknown` y no permite descartar emergencia | `emergency` | `true` | Política conservadora. |
| `VOM_001` | `vomiting` | vómitos repetidos + no retiene agua | `urgent` | `false` | Escala a `emergency` si hay debilidad marcada. |
| `VOM_002` | `vomiting` | arcadas improductivas + abdomen distendido, duro o muy doloroso | `emergency` | `true` | Regla de corte inmediata. |
| `VOM_003` | `vomiting` | sangre visible relevante + debilidad o palidez | `emergency` | `true` | Requiere validación veterinaria. |
| `VOM_004` | `vomiting` | posible ingestión peligrosa | `emergency` | `true` | Redirigir al flujo de ingestión peligrosa. |
| `VOM_005` | `vomiting` | vómitos + diarrea + menor actividad | `urgent` | `false` | Pérdidas combinadas. |
| `VOM_006` | `vomiting` | episodio único + paciente normal + tolera agua + sin banderas rojas | `monitor` | `false` | Observación limitada. |
| `VOM_007` | `vomiting` | vómitos persistentes o recurrentes en paciente estable | `consult` | `false` | No normalizar recurrencia. |
| `DIA_001` | `diarrhea` | heces negras tipo alquitrán + debilidad o palidez | `emergency` | `true` | Sangrado potencialmente relevante. |
| `DIA_002` | `diarrhea` | sangre repetida o importante + deterioro | `emergency` | `true` | Requiere validación veterinaria. |
| `DIA_003` | `diarrhea` | diarrea frecuente + vómitos + no retiene agua | `urgent` | `false` | Priorizar evaluación pronta. |
| `DIA_004` | `diarrhea` | diarrea en paciente vulnerable | `urgent` | `false` | Vulnerabilidad eleva riesgo. |
| `DIA_005` | `diarrhea` | posible ingestión peligrosa | `emergency` | `true` | Redirigir. |
| `DIA_006` | `diarrhea` | episodio aislado + paciente normal + tolera agua + sin sangre | `monitor` | `false` | Seguimiento corto. |
| `DIA_007` | `diarrhea` | diarrea persistente o recurrente en paciente estable | `consult` | `false` | No cerrar como benigno. |
| `RESP_001` | `breathing_difficulty` | dificultad respiratoria activa | `emergency` | `true` | No seguir con flujo largo. |
| `RESP_002` | `breathing_difficulty` | gato respirando con boca abierta | `emergency` | `true` | Corte inmediato. |
| `RESP_003` | `breathing_difficulty` | esfuerzo marcado, postura forzada o cuello extendido | `emergency` | `true` | Corte inmediato. |
| `RESP_004` | `breathing_difficulty` | mucosas azuladas, grises o muy pálidas | `emergency` | `true` | Corte inmediato. |
| `RESP_005` | `breathing_difficulty` | episodio que ya cedió pero se repite o aparece en reposo | `urgent` | `false` | Mantener CTA prioritario. |
| `RESP_006` | `breathing_difficulty` | respiración ruidosa nueva con paciente estable | `urgent` | `false` | Requiere revisión pronta. |
| `BLD_001` | `bleeding` | sangrado activo más que mínimo o cantidad incierta | `emergency` | `true` | No retrasar por detalles. |
| `BLD_002` | `bleeding` | sangrado + debilidad, palidez o disnea | `emergency` | `true` | Compromiso sistémico posible. |
| `BLD_003` | `bleeding` | sangrado posterior a trauma importante | `emergency` | `true` | No asumir herida superficial. |
| `BLD_004` | `bleeding` | objeto incrustado o herida penetrante | `emergency` | `true` | No pedir retirarlo. |
| `BLD_005` | `bleeding` | pocas gotas o vetas, ya cedió, paciente estable | `urgent` | `false` | Aún requiere evaluación. |
| `BLD_006` | `bleeding` | sangrado menor recurrente | `consult` | `false` | Agendar consulta. |
| `ING_001` | `hazardous_ingestion` | exposición probable o confirmada + signos neurológicos o respiratorios | `emergency` | `true` | Prioridad máxima. |
| `ING_002` | `hazardous_ingestion` | medicamento humano o veterinario | `emergency` | `true` | No esperar síntomas. |
| `ING_003` | `hazardous_ingestion` | químico, pesticida o rodenticida | `emergency` | `true` | No maniobras caseras. |
| `ING_004` | `hazardous_ingestion` | batería, imán, hilo, cuerda, aguja, objeto filoso | `emergency` | `true` | Riesgo alto. |
| `ING_005` | `hazardous_ingestion` | sustancia desconocida | `emergency` | `true` | Incertidumbre crítica. |
| `ING_006` | `hazardous_ingestion` | exposición posible, paciente asintomático y sin sustancia claramente de alto riesgo | `urgent` | `false` | Solo veterinario puede bajar luego la prioridad. |
| `URI_001` | `urination_difficulty` | gato macho + incapacidad o dificultad actual para orinar | `emergency` | `true` | Regla conservadora. |
| `URI_002` | `urination_difficulty` | intentos repetidos + gotas, nada o producción incierta | `emergency` | `true` | No esperar confirmación adicional. |
| `URI_003` | `urination_difficulty` | dificultad urinaria + vómitos, debilidad o colapso | `emergency` | `true` | Riesgo alto. |
| `URI_004` | `urination_difficulty` | dificultad urinaria después de trauma | `emergency` | `true` | Corte inmediato. |
| `URI_005` | `urination_difficulty` | dolor al orinar con volumen aparentemente conservado | `urgent` | `false` | Evaluación prioritaria. |
| `URI_006` | `urination_difficulty` | sangre en orina con paciente estable | `urgent` | `false` | No dejar en monitor. |
| `URI_007` | `urination_difficulty` | cambio urinario recurrente con producción normal | `consult` | `false` | Consulta programada. |

## Product Constraints

### Forbidden Downgrades

No se permite bajar prioridad cuando:

* ya se activó una regla `emergency`
* el usuario no sabe responder una pregunta crítica
* existe conflicto entre reglas de distinta prioridad

### Copy Goals

Los mensajes de salida deben enfocarse en:

* nivel de atención
* siguiente paso
* criterios de escalamiento

Nunca en:

* causa probable
* diagnóstico
* tratamiento sugerido

## Validation Queue

Las siguientes reglas deben revisarse con veterinario antes de producción:

* `URI_001`
* `ING_006`
* `DIA_004`
* `VOM_006`
* `RESP_006`
