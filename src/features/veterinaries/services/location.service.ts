import * as Location from 'expo-location';
import type {
  LocationCoordinates,
  MapRegion,
} from '../types/veterinary.types';

export const SANTIAGO_REGION: MapRegion = {
  latitude: -33.4489,
  longitude: -70.6693,
  latitudeDelta: 0.15,
  longitudeDelta: 0.12,
};

export type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied';

export interface UserLocationResult {
  coordinates: LocationCoordinates | null;
  status: LocationStatus;
}

const toRadians = (value: number) =>
  (value * Math.PI) / 180;

export const getUserLocation = async (): Promise<UserLocationResult> => {
  const permission =
    await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    return {
      coordinates: null,
      status: 'denied',
    };
  }

  const lastKnownLocation =
    await Location.getLastKnownPositionAsync();
  const location =
    lastKnownLocation ??
    (await Location.getCurrentPositionAsync({
      accuracy:
        Location.Accuracy.Balanced,
    }));

  return {
    coordinates: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
    status: 'granted',
  };
};

export const buildRegion = (
  coordinates?: LocationCoordinates | null
): MapRegion => ({
  latitude:
    coordinates?.latitude ??
    SANTIAGO_REGION.latitude,
  longitude:
    coordinates?.longitude ??
    SANTIAGO_REGION.longitude,
  latitudeDelta:
    SANTIAGO_REGION.latitudeDelta,
  longitudeDelta:
    SANTIAGO_REGION.longitudeDelta,
});

export const calculateDistanceKm = (
  from: LocationCoordinates,
  to: LocationCoordinates
) => {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(
    to.latitude - from.latitude
  );
  const longitudeDelta = toRadians(
    to.longitude - from.longitude
  );
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  const distance =
    2 *
    Math.atan2(
      Math.sqrt(haversine),
      Math.sqrt(1 - haversine)
    );

  return earthRadiusKm * distance;
};
