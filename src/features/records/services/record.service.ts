import type {
  CreatePetRecordInput,
  PetRecord,
} from '../types/record.types';

let petRecordsMock: PetRecord[] = [];

const createMockId = () =>
  `record-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

export const listPetRecords = async (
  ownerId: string,
  petId?: string
) => {
  return petRecordsMock
    .filter((record) => record.owner_id === ownerId)
    .filter((record) =>
      petId ? record.pet_id === petId : true
    )
    .sort((left, right) =>
      right.recorded_at.localeCompare(
        left.recorded_at
      )
    );
};

export const createPetRecord = async (
  input: CreatePetRecordInput
) => {
  const now = new Date().toISOString();
  const nextRecord: PetRecord = {
    id: createMockId(),
    pet_id: input.pet_id,
    owner_id: input.owner_id,
    record_type: input.record_type,
    recorded_at: input.recorded_at,
    description: input.description,
    value_numeric: input.value_numeric ?? null,
    value_unit: input.value_unit ?? null,
    metadata: input.metadata ?? null,
    created_at: now,
    updated_at: now,
  };

  petRecordsMock = [nextRecord, ...petRecordsMock];

  return nextRecord;
};

export const __resetPetRecordsMock = () => {
  petRecordsMock = [];
};
