import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useSettingsScreen } from '../hooks/useSettingsScreen';
import {
  getSettings,
  updateSetting,
} from '../services/settings.service';

const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
  }),
}));

jest.mock('../services/settings.service', () => ({
  getSettings: jest.fn(),
  updateSetting: jest.fn(),
}));

jest.mock('@/features/pets/store/pet.store', () => ({
  usePetStore: (
    selector: (state: {
      pets: Array<{
        id: string;
        name: string;
        breed: string | null;
      }>;
      activePetId: string | null;
    }) => unknown
  ) =>
    selector({
      pets: [
        {
          id: 'pet-1',
          name: 'Luna',
          breed: 'Labrador',
        },
      ],
      activePetId: 'pet-1',
    }),
}));

const mockedGetSettings =
  getSettings as jest.MockedFunction<
    typeof getSettings
  >;
const mockedUpdateSetting =
  updateSetting as jest.MockedFunction<
    typeof updateSetting
  >;

describe('useSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(Alert, 'alert')
      .mockImplementation(jest.fn());
  });

  test('hydrates settings and pet context', async () => {
    mockedGetSettings.mockResolvedValue({
      language: 'es',
      theme: 'system',
    });

    const { result } = renderHook(() =>
      useSettingsScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    expect(result.current.language).toBe('es');
    expect(result.current.hasLoadError).toBe(
      false
    );
    expect(result.current.activePetName).toBe(
      'Luna'
    );
    expect(
      result.current.activePetSummary
    ).toContain('Labrador');
  });

  test('updates language preference', async () => {
    mockedGetSettings.mockResolvedValue({
      language: 'es',
      theme: 'system',
    });
    mockedUpdateSetting.mockResolvedValue({
      language: 'en',
      theme: 'system',
    });

    const { result } = renderHook(() =>
      useSettingsScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    await act(async () => {
      await result.current.handleLanguageChange(
        'en'
      );
    });

    expect(
      mockedUpdateSetting
    ).toHaveBeenCalledWith('language', 'en');
    expect(result.current.language).toBe('en');
    expect(result.current.successMessage).toContain(
      'English'
    );
  });

  test('shows theme information alert', async () => {
    mockedGetSettings.mockResolvedValue({
      language: 'es',
      theme: 'system',
    });

    const { result } = renderHook(() =>
      useSettingsScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    act(() => {
      result.current.showThemeInfo();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Tema del dispositivo',
      'Por ahora la app sigue el tema del sistema. Más adelante podrás personalizarlo desde aquí.'
    );
  });
});
