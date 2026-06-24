import * as SecureStore from 'expo-secure-store';

const ONBOARDED_KEY = 'userOnboarded';

export const getOnboardedValue =
  async (): Promise<boolean> => {
    const value =
      await SecureStore.getItemAsync(
        ONBOARDED_KEY
      );

    return value === 'true';
  };

export const setOnboardedValue = async (
  value: boolean
) => {
  await SecureStore.setItemAsync(
    ONBOARDED_KEY,
    String(value)
  );
};
