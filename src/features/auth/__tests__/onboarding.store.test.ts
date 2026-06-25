import { useOnboardingStore } from '../store/onboarding.store';
import {
  getOnboardedValue,
  setOnboardedValue,
} from '../services/onboarding.service';

jest.mock('../services/onboarding.service', () => ({
  getOnboardedValue: jest.fn(),
  setOnboardedValue: jest.fn(),
}));

const mockedGetOnboardedValue =
  getOnboardedValue as jest.MockedFunction<
    typeof getOnboardedValue
  >;
const mockedSetOnboardedValue =
  setOnboardedValue as jest.MockedFunction<
    typeof setOnboardedValue
  >;

describe('onboarding.store', () => {
  beforeEach(() => {
    useOnboardingStore.setState({
      isOnboarded: false,
      isHydrating: false,
      hasHydrated: false,
    });
    jest.clearAllMocks();
  });

  test('hydrates onboarding state from storage', async () => {
    mockedGetOnboardedValue.mockResolvedValue(true);

    await useOnboardingStore
      .getState()
      .hydrateOnboarding();

    expect(mockedGetOnboardedValue).toHaveBeenCalled();
    expect(useOnboardingStore.getState()).toMatchObject(
      {
        isOnboarded: true,
        isHydrating: false,
        hasHydrated: true,
      }
    );
  });

  test('marks onboarding as complete and persists it', async () => {
    mockedSetOnboardedValue.mockResolvedValue(
      undefined
    );

    await useOnboardingStore
      .getState()
      .completeOnboarding();

    expect(
      mockedSetOnboardedValue
    ).toHaveBeenCalledWith(true);
    expect(useOnboardingStore.getState()).toMatchObject(
      {
        isOnboarded: true,
        isHydrating: false,
        hasHydrated: true,
      }
    );
  });
});
