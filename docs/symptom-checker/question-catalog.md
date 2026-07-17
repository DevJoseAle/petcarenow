# Symptom Checker Question Catalog

## Goal

Catalogar las preguntas mínimas del MVP para el flujo guiado de `Symptom Checker`.

## Question Design Rules

Todas las preguntas deben ser:

* observables por el tutor
* cerradas o casi cerradas
* de respuesta rápida
* compatibles con `unknown`
* sin exigir lenguaje clínico

No deben:

* pedir diagnóstico
* pedir mediciones imposibles
* pedir maniobras de riesgo
* retrasar un CTA de emergencia

## Global Questions

| Question Code | Text | Answer Type | Critical | Notes |
| --- | --- | --- | --- | --- |
| `GLOBAL_COLLAPSE` | ¿Tu mascota se desmayó, convulsionó o no puede mantenerse en pie? | `boolean_unknown` | `true` | Corta flujo si es `yes` o `unknown` crítico. |
| `GLOBAL_BREATHING_NOW` | ¿Tiene dificultad para respirar en este momento? | `boolean_unknown` | `true` | Corta flujo si es `yes` o `unknown` crítico. |
| `GLOBAL_GUMS_COLOR` | ¿Las encías se ven azuladas, grises o muy pálidas? | `enum_yes_no_unknown` | `true` | Ayuda a detectar compromiso sistémico. |

## Symptom Questions

### `vomiting`

| Question Code | Text | Answer Type | Critical | Notes |
| --- | --- | --- | --- | --- |
| `VOM_COUNT` | ¿Cuántas veces ha vomitado desde que comenzó? | `enum_1_2_3_4plus_unknown` | `false` | Umbral exacto requiere validación. |
| `VOM_ONSET` | ¿Cuándo comenzó? | `enum_recent_same_day_more_than_day_unknown` | `false` | Persistencia. |
| `VOM_KEEP_WATER` | ¿Puede tomar agua sin volver a vomitar? | `enum_yes_no_not_tried_unknown` | `true` | Eleva a urgente si no retiene. |
| `VOM_BLOOD` | ¿Ves sangre roja o material oscuro en el vómito? | `enum_yes_no_unsure` | `true` | Puede elevar a emergencia. |
| `VOM_GENERAL_STATE` | ¿Está alerta y responde como de costumbre? | `enum_normal_less_active_very_weak_unknown` | `true` | Debilidad marcada corta flujo. |
| `VOM_ABDOMEN` | ¿El abdomen está hinchado, duro o parece muy doloroso? | `enum_yes_no_unsure` | `true` | Junto con arcadas improductivas. |
| `VOM_UNPRODUCTIVE_RECHING` | ¿Hace arcadas repetidas sin expulsar contenido? | `boolean_unknown` | `true` | Combinación crítica. |
| `VOM_POSSIBLE_INGESTION` | ¿Pudo ingerir un tóxico, medicamento, químico, planta u objeto? | `enum_yes_no_unknown` | `true` | Redirige. |

### `diarrhea`

| Question Code | Text | Answer Type | Critical | Notes |
| --- | --- | --- | --- | --- |
| `DIA_COUNT` | ¿Cuántas deposiciones anormales ha tenido desde que comenzó? | `enum_1_2_3_4plus_continuous_unknown` | `false` | Frecuencia. |
| `DIA_ONSET` | ¿Cuándo comenzó? | `enum_recent_same_day_more_than_day_unknown` | `false` | Persistencia. |
| `DIA_BLOOD` | ¿Ves sangre roja o heces negras, brillantes y tipo alquitrán? | `enum_none_red_black_tarry_unsure` | `true` | Puede elevar a emergencia. |
| `DIA_VOMITING` | ¿También está vomitando? | `boolean_unknown` | `false` | Pérdidas combinadas. |
| `DIA_KEEP_WATER` | ¿Puede beber y mantener el agua? | `enum_yes_no_unknown` | `true` | Urgencia si no retiene. |
| `DIA_GENERAL_STATE` | ¿Está alerta y responde como de costumbre? | `enum_normal_less_active_very_weak_unknown` | `true` | Debilidad marcada corta flujo. |
| `DIA_ABDOMEN` | ¿El abdomen parece muy doloroso, hinchado o duro? | `enum_yes_no_unsure` | `true` | Señal de mayor riesgo. |
| `DIA_POSSIBLE_INGESTION` | ¿Pudo ingerir basura, tóxico, químico, planta, medicamento u objeto? | `enum_yes_no_unknown` | `true` | Redirige. |

### `breathing_difficulty`

| Question Code | Text | Answer Type | Critical | Notes |
| --- | --- | --- | --- | --- |
| `RESP_ACTIVE_NOW` | ¿Le cuesta respirar ahora mismo? | `enum_yes_no_unsure` | `true` | Si `yes` o `unsure`, debe cortar. |
| `RESP_OPEN_MOUTH_CAT` | Si es gato, ¿respira con la boca abierta? | `boolean_unknown` | `true` | Regla crítica en gatos. |
| `RESP_MARKED_EFFORT` | ¿Respira con mucho esfuerzo, usando la panza o con el cuello estirado? | `boolean_unknown` | `true` | Corta flujo. |
| `RESP_NOISY` | ¿Se escucha un ruido respiratorio nuevo o llamativo? | `boolean_unknown` | `false` | Puede quedar en urgente. |
| `RESP_AT_REST` | ¿Le pasa incluso estando en reposo? | `boolean_unknown` | `true` | Prioriza riesgo. |
| `RESP_REPEATED_EPISODE` | ¿Esto ya le había pasado antes o se repitió hoy? | `boolean_unknown` | `false` | Útil si el episodio cedió. |

### `bleeding`

| Question Code | Text | Answer Type | Critical | Notes |
| --- | --- | --- | --- | --- |
| `BLD_ACTIVE_NOW` | ¿Sigue sangrando ahora mismo? | `boolean_unknown` | `true` | Sangrado activo eleva prioridad. |
| `BLD_LOCATION` | ¿De dónde sale la sangre? | `enum_external_nose_mouth_urine_stool_multiple_unknown` | `false` | Localización. |
| `BLD_AMOUNT` | ¿La sangre es más que unas pocas gotas o vetas? | `enum_yes_no_unknown` | `true` | Si no se puede estimar, tratar conservadoramente. |
| `BLD_TRAUMA` | ¿Ocurrió después de un golpe, caída, mordida o accidente? | `boolean_unknown` | `true` | Trauma cambia prioridad. |
| `BLD_OBJECT_EMBEDDED` | ¿Hay un objeto incrustado o una herida profunda? | `boolean_unknown` | `true` | Corta flujo. |
| `BLD_GENERAL_STATE` | ¿Está débil, muy pálido o le cuesta respirar? | `multi_boolean_unknown` | `true` | Compromiso sistémico. |

### `hazardous_ingestion`

| Question Code | Text | Answer Type | Critical | Notes |
| --- | --- | --- | --- | --- |
| `ING_SUBSTANCE_TYPE` | ¿Qué pudo ingerir? | `enum_medication_chemical_pesticide_rodenticide_plant_food_object_unknown` | `true` | Sustancia desconocida sigue siendo crítica. |
| `ING_TIME` | ¿Hace cuánto pudo haberlo ingerido? | `enum_less_2h_more_2h_unknown` | `false` | No debe retrasar CTA. |
| `ING_SIGNS_NOW` | ¿Tiene temblores, convulsiones, mucha debilidad o dificultad para respirar? | `multi_boolean_unknown` | `true` | Emergencia inmediata. |
| `ING_OBJECT_HIGH_RISK` | ¿Es una batería, imán, hilo, cuerda, aguja o algo filoso? | `boolean_unknown` | `true` | Objeto de alto riesgo. |
| `ING_PACKAGE_AVAILABLE` | ¿Tienes el envase o una foto del producto? | `boolean` | `false` | Útil para derivación, no para frenar CTA. |

### `urination_difficulty`

| Question Code | Text | Answer Type | Critical | Notes |
| --- | --- | --- | --- | --- |
| `URI_TRYING_REPEATEDLY` | ¿Intenta orinar una y otra vez? | `boolean_unknown` | `true` | Base del flujo. |
| `URI_OUTPUT` | Cuando lo intenta, ¿sale normal, salen gotas, no sale nada o no puedes saberlo? | `enum_normal_drops_none_unknown` | `true` | Gotas/nada/unknown deben escalar. |
| `URI_PAIN` | ¿Se nota dolor al intentar orinar? | `boolean_unknown` | `false` | Eleva al menos a urgente. |
| `URI_BLOOD` | ¿Ves sangre en la orina o en el lugar donde intenta orinar? | `boolean_unknown` | `false` | No debe quedar en monitor. |
| `URI_VOMITING_WEAKNESS` | ¿También está vomitando, muy débil o no se mantiene en pie? | `multi_boolean_unknown` | `true` | Emergencia. |
| `URI_AFTER_TRAUMA` | ¿Esto pasó después de un golpe o accidente? | `boolean_unknown` | `true` | Emergencia. |
| `URI_SEX_CONFIRM` | ¿Es macho? | `enum_male_female_unknown` | `true` | Especialmente relevante en gatos. |

## Question Ordering

Orden recomendado para cualquier síntoma:

1. preguntas globales de corte
2. preguntas específicas de corte del síntoma
3. estado general
4. tolerancia a agua / producción / cantidad
5. inicio y repetición
6. modificadores de vulnerabilidad

## Validation Notes

Requieren revisión veterinaria:

* thresholds de repetición
* definición de “más que unas pocas gotas”
* material visual para color de encías y heces negras
* qué preguntas pueden omitirse en `breathing_difficulty` o `hazardous_ingestion`
