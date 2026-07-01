import {
  useEffect,
  useRef,
} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {
  Marker,
} from 'react-native-maps';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import VeterinaryFilterChip from '../components/VeterinaryFilterChip';
import VeterinaryListCard from '../components/VeterinaryListCard';
import VeterinaryMapSummaryCard from '../components/VeterinaryMapSummaryCard';
import { useVeterinariesScreen } from '../hooks/useVeterinariesScreen';

export default function VeterinariesScreen() {
  const theme = useTheme();
  const {
    mode,
    veterinaries,
    selectedVeterinary,
    isHydrating,
    generalError,
    filters,
    onlyNearby,
    nearbyRangeKm,
    locationStatus,
    userLocation,
    mapRegion,
    goBack,
    retry,
    toggleOnlyEmergency,
    toggleOnly24Hours,
    toggleOnlyNearby,
    clearFilters,
    selectVeterinary,
    goToProfile,
  } = useVeterinariesScreen();
  const mapRef = useRef<MapView | null>(null);

  const isMapMode = mode === 'map';

  useEffect(() => {
    if (!isMapMode || veterinaries.length === 0) {
      return;
    }

    const coordinates = [
      ...veterinaries.map((veterinary) => ({
        latitude: veterinary.latitude,
        longitude: veterinary.longitude,
      })),
      ...(userLocation
        ? [userLocation]
        : []),
    ];

    if (coordinates.length === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        coordinates,
        {
          edgePadding: {
            top: 60,
            right: 60,
            bottom: 60,
            left: 60,
          },
          animated: true,
        }
      );
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [
    isMapMode,
    userLocation,
    veterinaries,
  ]);

  return (
    <Screen scroll>
      <View style={styles.content}>
        <Pressable
          onPress={goBack}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={theme.textPrimary}
          />
          <Text
            style={[
              styles.backLabel,
              { color: theme.textPrimary },
            ]}
          >
            Volver
          </Text>
        </Pressable>

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary },
            ]}
          >
            {isMapMode
              ? 'Mapa de veterinarias'
              : 'Listado de veterinarias'}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            {isMapMode
              ? locationStatus === 'denied'
                ? 'Usaremos Santiago como referencia mientras activas tu ubicación.'
                : 'Explora veterinarias cercanas y elige la mejor opción para tu mascota.'
              : 'Consulta clínicas y centros de urgencia disponibles.'}
          </Text>
        </View>

        <View style={styles.filtersRow}>
          <VeterinaryFilterChip
            label="Solo emergencia"
            isActive={filters.onlyEmergency}
            onPress={toggleOnlyEmergency}
          />
          <VeterinaryFilterChip
            label="Solo 24/7"
            isActive={filters.only24Hours}
            onPress={toggleOnly24Hours}
          />
          {locationStatus === 'granted' ? (
            <VeterinaryFilterChip
              label={`Cerca de mi (${nearbyRangeKm} km)`}
              isActive={onlyNearby}
              onPress={toggleOnlyNearby}
            />
          ) : null}
          {(filters.onlyEmergency ||
            filters.only24Hours ||
            onlyNearby) && (
            <VeterinaryFilterChip
              label="Limpiar"
              isActive={false}
              onPress={() => {
                if (onlyNearby) {
                  toggleOnlyNearby();
                }
                clearFilters();
              }}
            />
          )}
        </View>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando veterinarias..."
          />
        ) : generalError ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : veterinaries.length === 0 ? (
          <SectionState
            type="empty"
            message="No encontramos veterinarias con esos filtros."
            onRetry={clearFilters}
          />
        ) : (
          <>
            {isMapMode ? (
              <View
                style={[
                  styles.mapCard,
                  {
                    backgroundColor:
                      theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  initialRegion={mapRegion}
                  showsUserLocation={
                    locationStatus === 'granted'
                  }
                  showsMyLocationButton
                >
                  {veterinaries.map(
                    (veterinary) => (
                      <Marker
                        key={veterinary.id}
                        coordinate={{
                          latitude:
                            veterinary.latitude,
                          longitude:
                            veterinary.longitude,
                        }}
                        title={veterinary.name}
                        description={`${veterinary.address}${
                          veterinary.distanceKm !== null
                            ? ` • ${veterinary.distanceKm.toFixed(
                                1
                              )} km`
                            : ''
                        }`}
                        pinColor={
                          veterinary.is_emergency
                            ? theme.emergency
                            : theme.primary
                        }
                        onPress={() =>
                          selectVeterinary(
                            veterinary.id
                          )
                        }
                      />
                    )
                  )}
                </MapView>
              </View>
            ) : null}

            {isMapMode && selectedVeterinary ? (
              <View
                style={[
                  styles.selectedSection,
                  {
                    backgroundColor:
                      theme.infoBackground,
                    borderColor: theme.info,
                  },
                ]}
              >
                <View style={styles.selectedSectionHeader}>
                  <Text
                    style={[
                      styles.selectedSectionEyebrow,
                      { color: theme.info },
                    ]}
                  >
                    SELECCIONADA DEL MAPA
                  </Text>
                  <Text
                    style={[
                      styles.selectedSectionTitle,
                      {
                        color:
                          theme.textPrimary,
                      },
                    ]}
                  >
                    Veterinaria activa
                  </Text>
                  <Text
                    style={[
                      styles.selectedSectionSubtitle,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Esta es la veterinaria que
                    seleccionaste desde el mapa.
                  </Text>
                </View>

                <VeterinaryMapSummaryCard
                  veterinary={selectedVeterinary}
                  onOpenProfile={() =>
                    goToProfile(
                      selectedVeterinary.id
                    )
                  }
                />
              </View>
            ) : null}

            <View style={styles.list}>
              {veterinaries.map((veterinary) => (
                <VeterinaryListCard
                  key={veterinary.id}
                  veterinary={veterinary}
                  isSelected={
                    veterinary.id ===
                    selectedVeterinary?.id
                  }
                  onSelect={() =>
                    selectVeterinary(
                      veterinary.id
                    )
                  }
                  onPress={() =>
                    goToProfile(veterinary.id)
                  }
                />
              ))}
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  mapCard: {
    borderWidth: 1,
    borderRadius: 28,
    overflow: 'hidden',
    height: 320,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  list: {
    gap: 14,
  },
  selectedSection: {
    borderWidth: 1,
    borderRadius: 30,
    padding: 16,
    gap: 14,
  },
  selectedSectionHeader: {
    gap: 4,
  },
  selectedSectionEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  selectedSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  selectedSectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
