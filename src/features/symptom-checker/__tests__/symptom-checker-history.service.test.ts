import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  buildSymptomCheckerEvaluationPayload,
  listSymptomCheckerEvaluations,
  saveSymptomCheckerEvaluation,
} from '../services/symptom-checker-history.service';

describe('symptom-checker-history.service', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('saves and lists history entries for the active user', async () => {
    const savedRecord =
      await saveSymptomCheckerEvaluation({
        ownerId: 'user-1',
        petId: 'pet-1',
        petName: 'Luna',
        petType: 'dog',
        symptomCode: 'vomiting',
        symptomLabel: 'Vómitos',
        answers: [
          {
            questionCode: 'VOM_COUNT',
            questionText:
              '¿Cuántas veces ha vomitado desde que comenzó?',
            value: '2',
            label: '2 veces',
          },
        ],
        result: {
          priority: 'consult',
          title: 'Consulta recomendada',
          summary:
            'Conviene revisar a tu mascota con una veterinaria.',
          actionLabel:
            'Agenda una consulta si el cuadro continúa.',
          escalationSignals: ['Vómitos repetidos'],
          stopFlow: false,
          triggeredRules: ['VOM_003'],
        },
      });

    await saveSymptomCheckerEvaluation({
      ownerId: 'user-2',
      petId: 'pet-2',
      petName: 'Milo',
      petType: 'cat',
      symptomCode: 'diarrhea',
      symptomLabel: 'Diarrea',
      answers: [],
      result: {
        priority: 'monitor',
        title: 'Monitoreo cercano',
        summary: 'Sigue observando la evolución.',
        actionLabel:
          'Busca ayuda si aparecen nuevas señales.',
        escalationSignals: ['Sin alarma inmediata'],
        stopFlow: false,
        triggeredRules: ['DIA_004'],
      },
    });

    const records =
      await listSymptomCheckerEvaluations(
        'user-1'
      );

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      id: savedRecord.id,
      ownerId: 'user-1',
      petName: 'Luna',
      symptomLabel: 'Vómitos',
      syncStatus: 'pending',
      source: 'local',
    });
  });

  test('builds the future backend payload from a local record', async () => {
    const savedRecord =
      await saveSymptomCheckerEvaluation({
        ownerId: 'user-1',
        petId: 'pet-1',
        petName: 'Luna',
        petType: 'dog',
        symptomCode: 'vomiting',
        symptomLabel: 'Vómitos',
        answers: [],
        result: {
          priority: 'urgent',
          title: 'Atención hoy',
          summary:
            'Conviene revisión veterinaria durante el día.',
          actionLabel: 'Busca atención hoy.',
          escalationSignals: ['No retiene agua'],
          stopFlow: false,
          triggeredRules: ['VOM_001'],
        },
      });

    expect(
      buildSymptomCheckerEvaluationPayload(
        savedRecord
      )
    ).toMatchObject({
      owner_id: 'user-1',
      pet_id: 'pet-1',
      pet_name: 'Luna',
      pet_type: 'dog',
      symptom_code: 'vomiting',
      symptom_label: 'Vómitos',
      result_priority: 'urgent',
      result_title: 'Atención hoy',
      result_summary:
        'Conviene revisión veterinaria durante el día.',
      result_action_label: 'Busca atención hoy.',
      escalation_signals: ['No retiene agua'],
      triggered_rules: ['VOM_001'],
      source: 'local',
    });
  });
});
