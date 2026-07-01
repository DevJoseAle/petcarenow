import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  buildRegion,
  calculateDistanceKm,
  getUserLocation,
  SANTIAGO_REGION,
  type LocationStatus,
} from '../services/location.service';
import { listVeterinaries } from '../services/veterinary.service';
import type {
  LocationCoordinates,
  Veterinary,
  VeterinaryFilters,
  VeterinaryWithDistance,
} from '../types/veterinary.types';

const defaultFilters: VeterinaryFilters = {
  onlyEmergency: false,
  only24Hours: false,
};
const NEARBY_RANGE_KM = 12;

export const useVeterinariesScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
  }>();
  const [veterinaries, setVeterinaries] =
    useState<Veterinary[]>([]);
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');
  const [filters, setFilters] =
    useState<VeterinaryFilters>(defaultFilters);
  const [selectedVeterinaryId, setSelectedVeterinaryId] =
    useState<string>('');
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>('idle');
  const [userLocation, setUserLocation] =
    useState<LocationCoordinates | null>(null);
  const [onlyNearby, setOnlyNearby] =
    useState(true);

  const hydrateVeterinaries = async (
    nextFilters: VeterinaryFilters
  ) => {
    setIsHydrating(true);
    setGeneralError('');

    try {
      const data = await listVeterinaries(nextFilters);
      setVeterinaries(data);
      setSelectedVeterinaryId((current) =>
        data.some(
          (veterinary) =>
            veterinary.id === current
        )
          ? current
          : data[0]?.id ?? ''
      );
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar las veterinarias.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  const hydrateLocation = async () => {
    setLocationStatus('requesting');

    try {
      const result = await getUserLocation();
      setLocationStatus(result.status);
      setUserLocation(result.coordinates);
    } catch {
      setLocationStatus('denied');
      setUserLocation(null);
    }
  };

  const hydrate = async (
    nextFilters: VeterinaryFilters = filters
  ) => {
    await Promise.all([
      hydrateVeterinaries(nextFilters),
      locationStatus === 'idle'
        ? hydrateLocation()
        : Promise.resolve(),
    ]);
  };

  useEffect(() => {
    hydrate(defaultFilters);
  }, []);

  const veterinariesWithDistance = useMemo<
    VeterinaryWithDistance[]
  >(
    () =>
      veterinaries
        .map((veterinary) => ({
          ...veterinary,
          distanceKm: userLocation
            ? calculateDistanceKm(
                userLocation,
                {
                  latitude:
                    veterinary.latitude,
                  longitude:
                    veterinary.longitude,
                }
              )
            : null,
        }))
        .sort((left, right) => {
          if (
            left.distanceKm === null &&
            right.distanceKm === null
          ) {
            return 0;
          }

          if (left.distanceKm === null) {
            return 1;
          }

          if (right.distanceKm === null) {
            return -1;
          }

          return left.distanceKm - right.distanceKm;
        }),
    [userLocation, veterinaries]
  );

  const visibleVeterinaries = useMemo(
    () =>
      onlyNearby && userLocation
        ? veterinariesWithDistance.filter(
            (veterinary) =>
              veterinary.distanceKm !== null &&
              veterinary.distanceKm <=
                NEARBY_RANGE_KM
          )
        : veterinariesWithDistance,
    [
      onlyNearby,
      userLocation,
      veterinariesWithDistance,
    ]
  );

  const listedVeterinaries = useMemo(
    () =>
      params.mode === 'map' &&
      selectedVeterinaryId
        ? visibleVeterinaries.filter(
            (veterinary) =>
              veterinary.id !==
              selectedVeterinaryId
          )
        : visibleVeterinaries,
    [
      params.mode,
      selectedVeterinaryId,
      visibleVeterinaries,
    ]
  );

  const selectedVeterinary = useMemo(
    () =>
      visibleVeterinaries.find(
        (veterinary) =>
          veterinary.id ===
          selectedVeterinaryId
      ) ?? null,
    [
      selectedVeterinaryId,
      visibleVeterinaries,
    ]
  );

  const mapRegion = useMemo(
    () => buildRegion(userLocation),
    [userLocation]
  );

  return {
    mode: params.mode === 'map' ? 'map' : 'list',
    veterinaries: listedVeterinaries,
    selectedVeterinary,
    isHydrating,
    generalError,
    filters,
    onlyNearby,
    nearbyRangeKm: NEARBY_RANGE_KM,
    locationStatus,
    userLocation,
    mapRegion,
    fallbackRegion: SANTIAGO_REGION,
    goBack: () => router.back(),
    retry: () => hydrate(filters),
    toggleOnlyEmergency: () => {
      const nextFilters = {
        ...filters,
        onlyEmergency: !filters.onlyEmergency,
      };

      setFilters(nextFilters);
      hydrateVeterinaries(nextFilters);
    },
    toggleOnly24Hours: () => {
      const nextFilters = {
        ...filters,
        only24Hours: !filters.only24Hours,
      };

      setFilters(nextFilters);
      hydrateVeterinaries(nextFilters);
    },
    clearFilters: () => {
      setFilters(defaultFilters);
      hydrateVeterinaries(defaultFilters);
    },
    toggleOnlyNearby: () =>
      setOnlyNearby((current) => !current),
    selectVeterinary: (id: string) =>
      setSelectedVeterinaryId(id),
    goToProfile: (id: string) =>
      router.push(`/veterinary-profile?id=${id}`),
  };
};
