import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import { useCareProfileScreen } from '../hooks/useCareProfileScreen';
import { buildCareProfile } from '../services/care-profile.service';
import { shareCareProfile } from '../services/care-profile-share.service';
import {
  PetGender,
  PetType,
} from '@/features/pets/types/pet.types';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../services/care-profile.service', () => ({
  buildCareProfile: jest.fn(),
}));

jest.mock('../services/care-profile-share.service', () => ({
  shareCareProfile: jest.fn(),
}));

jest.mock('@/features/auth/store/auth.store', () => ({
  useAuthStore: (
    selector: (state: {
      user: { id: string } | null;
    }) => unknown
  ) =>
    selector({
      user: { id: 'user-1' },
    }),
}));

const mockPet = {
  id: 'pet-1',
  owner_id: 'user-1',
  name: 'Luna',
  pet_type: PetType.Cat,
  gender: PetGender.Female,
  breed: 'mixed',
  birth_date: '2023-01-10',
  age_years: null,
  weight_kg: 4,
  photo_url: null,
  allergies: ['Polen'],
  medical_conditions: ['Artritis'],
  is_active: true,
  created_at: null,
  updated_at: null,
};

jest.mock('@/features/pets/store/pet.store', () => ({
  usePetStore: (
    selector?: (state: {
      pets: typeof mockPet[];
      activePetId: string | null;
      isHydrating: boolean;
    }) => unknown
  ) => {
    const state = {
      pets: [mockPet],
      activePetId: 'pet-1',
      isHydrating: false,
    };

    return selector ? selector(state) : state;
  },
}));

const mockedBuildCareProfile =
  buildCareProfile as jest.MockedFunction<
    typeof buildCareProfile
  >;
const mockedShareCareProfile =
  shareCareProfile as jest.MockedFunction<
    typeof shareCareProfile
  >;

describe('useCareProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hydrates care profile data', async () => {
    mockedBuildCareProfile.mockResolvedValue({
      pet: mockPet,
      vaccinations: [],
      latestMedicalVisit: null,
      hasPartialSections: true,
    });

    const { result } = renderHook(() =>
      useCareProfileScreen()
    );

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull();
    });

    expect(mockedBuildCareProfile).toHaveBeenCalled();
  });

  test('navigates to edit pet', async () => {
    mockedBuildCareProfile.mockResolvedValue({
      pet: mockPet,
      vaccinations: [],
      latestMedicalVisit: null,
      hasPartialSections: true,
    });

    const { result } = renderHook(() =>
      useCareProfileScreen()
    );

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull();
    });

    act(() => {
      result.current.goToEditPet();
    });

    expect(mockPush).toHaveBeenCalledWith(
      '/pet-detail?petId=pet-1'
    );
  });

  test('shares profile when data is available', async () => {
    mockedBuildCareProfile.mockResolvedValue({
      pet: mockPet,
      vaccinations: [],
      latestMedicalVisit: null,
      hasPartialSections: true,
    });

    const { result } = renderHook(() =>
      useCareProfileScreen()
    );

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull();
    });

    await act(async () => {
      await result.current.handleShare();
    });

    expect(
      mockedShareCareProfile
    ).toHaveBeenCalled();
  });
});
