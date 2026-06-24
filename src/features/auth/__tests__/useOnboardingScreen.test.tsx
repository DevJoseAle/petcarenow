import {
  act,
  renderHook,
} from '@testing-library/react-native';
import { useOnboardingScreen } from '../hooks/useOnboardingScreen';

const mockReplace = jest.fn();
const mockCompleteOnboarding = jest.fn();

let mockIsOnboarded = false;

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('../store/onboarding.store', () => ({
  useOnboardingStore: (
    selector: (state: {
      isOnboarded: boolean;
      completeOnboarding: typeof mockCompleteOnboarding;
    }) => unknown
  ) =>
    selector({
      isOnboarded: mockIsOnboarded,
      completeOnboarding: mockCompleteOnboarding,
    }),
}));

describe('useOnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsOnboarded = false;
  });

  test('advances to the next slide when not on the last item', async () => {
    const scrollToIndex = jest.fn();
    const { result } = renderHook(() =>
      useOnboardingScreen(100)
    );

    act(() => {
      result.current.listRef.current = {
        scrollToIndex,
      } as never;
    });

    await act(async () => {
      await result.current.goToNextSlide();
    });

    expect(scrollToIndex).toHaveBeenCalledWith({
      animated: true,
      index: 1,
    });
    expect(result.current.currentIndex).toBe(1);
  });

  test('completes onboarding on the last slide and redirects to login', async () => {
    mockCompleteOnboarding.mockResolvedValue(
      undefined
    );

    const { result } = renderHook(() =>
      useOnboardingScreen(100)
    );

    act(() => {
      result.current.handleScrollEnd({
        nativeEvent: {
          contentOffset: { x: 200 },
        },
      } as never);
    });

    await act(async () => {
      await result.current.goToNextSlide();
    });

    expect(
      mockCompleteOnboarding
    ).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      '/(auth)/login'
    );
  });
});
