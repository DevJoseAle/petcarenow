import { useVeterinariesStore } from '../store/veterinaries.store';

describe('veterinaries.store', () => {
  beforeEach(() => {
    useVeterinariesStore.setState({
      savedVeterinaryIds: [],
    });
  });

  test('hydrates saved ids', () => {
    useVeterinariesStore
      .getState()
      .setSavedVeterinaryIds([
        'vet-1',
        'vet-2',
      ]);

    expect(
      useVeterinariesStore.getState()
        .savedVeterinaryIds
    ).toEqual(['vet-1', 'vet-2']);
  });

  test('marks a veterinary as saved without duplicating it', () => {
    useVeterinariesStore
      .getState()
      .markSavedVeterinary('vet-1');
    useVeterinariesStore
      .getState()
      .markSavedVeterinary('vet-1');

    expect(
      useVeterinariesStore.getState()
        .savedVeterinaryIds
    ).toEqual(['vet-1']);
  });

  test('unmarks a saved veterinary', () => {
    useVeterinariesStore.setState({
      savedVeterinaryIds: ['vet-1', 'vet-2'],
    });

    useVeterinariesStore
      .getState()
      .unmarkSavedVeterinary('vet-1');

    expect(
      useVeterinariesStore.getState()
        .savedVeterinaryIds
    ).toEqual(['vet-2']);
  });
});
