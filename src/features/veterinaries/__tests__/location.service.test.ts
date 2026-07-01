import * as ExpoLocation from 'expo-location';
import {
  buildRegion,
  getUserLocation,
  SANTIAGO_REGION,
} from '../services/location.service';

jest.mock('expo-location', () => ({
  Accuracy: {
    Balanced: 3,
  },
  requestForegroundPermissionsAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

const mockedLocation =
  ExpoLocation as jest.Mocked<typeof ExpoLocation>;

describe('location.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns denied when permission is not granted', async () => {
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue(
      {
        status: 'denied',
        canAskAgain: true,
        expires: 'never',
        granted: false,
      } as never
    );

    await expect(
      getUserLocation()
    ).resolves.toEqual({
      coordinates: null,
      status: 'denied',
    });
  });

  test('returns user coordinates when permission is granted', async () => {
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue(
      {
        status: 'granted',
        canAskAgain: true,
        expires: 'never',
        granted: true,
      } as never
    );
    mockedLocation.getLastKnownPositionAsync.mockResolvedValue(
      null as never
    );
    mockedLocation.getCurrentPositionAsync.mockResolvedValue(
      {
        coords: {
          latitude: -33.45,
          longitude: -70.66,
        },
      } as never
    );

    await expect(
      getUserLocation()
    ).resolves.toEqual({
      coordinates: {
        latitude: -33.45,
        longitude: -70.66,
      },
      status: 'granted',
    });
  });

  test('prefers last known location when available', async () => {
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue(
      {
        status: 'granted',
        canAskAgain: true,
        expires: 'never',
        granted: true,
      } as never
    );
    mockedLocation.getLastKnownPositionAsync.mockResolvedValue(
      {
        coords: {
          latitude: -33.44,
          longitude: -70.65,
        },
      } as never
    );

    await expect(
      getUserLocation()
    ).resolves.toEqual({
      coordinates: {
        latitude: -33.44,
        longitude: -70.65,
      },
      status: 'granted',
    });

    expect(
      mockedLocation.getCurrentPositionAsync
    ).not.toHaveBeenCalled();
  });

  test('builds a region from fallback coordinates', () => {
    expect(buildRegion(null)).toEqual(
      SANTIAGO_REGION
    );
  });
});
