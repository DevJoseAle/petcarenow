import type { Veterinary } from '../types/veterinary.types';

const mockVeterinaries: Veterinary[] = [
  {
    id: 'vet-1',
    name: 'Clínica Vet Central',
    address: 'Av. Siempre Viva 123',
    city: 'Santiago',
    phone: '+56 9 1111 1111',
    latitude: -33.4489,
    longitude: -70.6693,
    is_emergency: true,
    is_24_7: true,
    description:
      'Atención general y urgencias 24/7.',
  },
  {
    id: 'vet-2',
    name: 'Pet Salud Barrio Norte',
    address: 'Providencia 456',
    city: 'Santiago',
    phone: '+56 9 2222 2222',
    latitude: -33.4372,
    longitude: -70.6506,
    is_emergency: true,
    is_24_7: false,
    description:
      'Consultas médicas y farmacia veterinaria.',
  },
  {
    id: 'vet-3',
    name: 'Veterinaria Las Condes',
    address: 'Apoquindo 789',
    city: 'Santiago',
    phone: '+56 9 3333 3333',
    latitude: -33.4145,
    longitude: -70.5822,
    is_emergency: false,
    is_24_7: false,
    description:
      'Controles, vacunación y bienestar integral.',
  },
];

export const listVeterinaries = async () =>
  mockVeterinaries;

export const getVeterinaryById = async (
  veterinaryId: string
) =>
  mockVeterinaries.find(
    (veterinary) => veterinary.id === veterinaryId
  ) ?? null;
