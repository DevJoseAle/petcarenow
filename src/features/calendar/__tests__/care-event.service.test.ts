import {
  __resetCareEventsMock,
  createCareEvent,
  listCareEvents,
  listUpcomingCareEventsByPet,
  listVaccinesByPet,
} from '../services/care-event.service';

describe('care-event.service', () => {
  beforeEach(() => {
    __resetCareEventsMock();
  });

  test('creates a care event and lists it for the owner', async () => {
    const event = await createCareEvent({
      owner_id: 'user-1',
      pet_id: 'pet-1',
      event_type: 'consultation',
      title: 'Control general',
      starts_at: '2026-06-30T14:00:00.000Z',
    });

    const events = await listCareEvents('user-1');

    expect(event.title).toBe('Control general');
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: event.id,
          title: 'Control general',
        }),
      ])
    );
  });

  test('filters upcoming care events by pet', async () => {
    await createCareEvent({
      owner_id: 'user-1',
      pet_id: 'pet-1',
      event_type: 'medication',
      title: 'Dosis noche',
      starts_at: '2026-06-30T14:00:00.000Z',
    });
    await createCareEvent({
      owner_id: 'user-1',
      pet_id: 'pet-2',
      event_type: 'medication',
      title: 'Dosis mañana',
      starts_at: '2026-06-30T09:00:00.000Z',
    });

    const events = await listUpcomingCareEventsByPet(
      'user-1',
      'pet-1'
    );

    expect(events).toEqual([
      expect.objectContaining({
        pet_id: 'pet-1',
        title: 'Dosis noche',
      }),
    ]);
  });

  test('returns only vaccines for the selected pet', async () => {
    await createCareEvent({
      owner_id: 'user-1',
      pet_id: 'pet-1',
      event_type: 'vaccine',
      title: 'Vacuna anual',
      starts_at: '2026-06-30T14:00:00.000Z',
    });
    await createCareEvent({
      owner_id: 'user-1',
      pet_id: 'pet-1',
      event_type: 'custom',
      title: 'Baño',
      starts_at: '2026-07-01T14:00:00.000Z',
    });

    const vaccines = await listVaccinesByPet(
      'user-1',
      'pet-1'
    );

    expect(vaccines).toEqual([
      expect.objectContaining({
        event_type: 'vaccine',
      }),
    ]);
  });
});
