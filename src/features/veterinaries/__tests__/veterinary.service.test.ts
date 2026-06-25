import {
  getVeterinaryById,
  listVeterinaries,
} from '../services/veterinary.service';

describe('veterinary.service', () => {
  test('lists mock veterinaries', async () => {
    const veterinaries = await listVeterinaries();

    expect(veterinaries.length).toBeGreaterThan(0);
    expect(veterinaries[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
      })
    );
  });

  test('returns a veterinary by id', async () => {
    const veterinaries = await listVeterinaries();
    const veterinary = await getVeterinaryById(
      veterinaries[0].id
    );

    expect(veterinary).toEqual(
      expect.objectContaining({
        id: veterinaries[0].id,
      })
    );
  });
});
