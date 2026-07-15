import {
  act,
  renderHook,
} from '@testing-library/react-native';
import { useHelpScreen } from '../hooks/useHelpScreen';
import * as helpService from '../services/help.service';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe('useHelpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('exposes local help content', () => {
    const { result } = renderHook(() =>
      useHelpScreen()
    );

    expect(result.current.faqItems).toHaveLength(3);
    expect(result.current.contactOptions).toHaveLength(
      2
    );
    expect(result.current.legalLinks).toHaveLength(2);
  });

  test('stores a controlled error when opening a contact option fails', async () => {
    jest
      .spyOn(
        helpService,
        'openHelpContactOption'
      )
      .mockRejectedValue(
        new Error(
          'No pudimos abrir escríbenos por email en este dispositivo.'
        )
      );

    const { result } = renderHook(() =>
      useHelpScreen()
    );

    await act(async () => {
      await result.current.handleOpenContactOption(
        result.current.contactOptions[0]
      );
    });

    expect(result.current.generalError).toContain(
      'No pudimos abrir'
    );
  });

  test('navigates back', () => {
    const { result } = renderHook(() =>
      useHelpScreen()
    );

    result.current.goBack();

    expect(mockBack).toHaveBeenCalled();
  });
});
