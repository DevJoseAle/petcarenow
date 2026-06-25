import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Image } from 'expo-image';

import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';

import HomeCareItem from '../components/HomeCareItem';
import HomeEmergencyCard from '../components/HomeEmergencyCard';
import HomePetSummaryCard from '../components/HomePetSummaryCard';
import HomeProfileCompletionCard from '../components/HomeProfileCompletionCard';
import HomeQuickActionTile from '../components/HomeQuickActionTile';
import HomeSectionCard from '../components/HomeSectionCard';
import SectionState from '../components/SectionState';
import { useHomeScreen } from '../hooks/useHomeScreen';

const SHOW_VACCINES_CARD = false;

export default function HomeScreen() {
  const theme = useTheme();
  const {
    greeting,
    currentDateLabel,
    activePet,
    canSwitchPets,
    activePetAgeLabel,
    activePetWeightLabel,
    profileProgress,
    quickActions,
    careEvents,
    isPetsHydrating,
    petsError,
    isCareEventsHydrating,
    careEventsError,
    isEmergencyHydrating,
    emergencyError,
    navigateToPets,
    navigateToCareProfile,
    navigateToCalendar,
    openEmergencyMenu,
    retryPets,
    retryCareEvents,
    retryEmergency,
    selectNextPet,
  } = useHomeScreen();

  return (
    <Screen scroll>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text
              style={[
                styles.greeting,
                { color: theme.textPrimary },
              ]}
            >
              {greeting}
            </Text>
            <Text
              style={[
                styles.date,
                { color: theme.textSecondary },
              ]}
            >
              {currentDateLabel}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.notificationWrap}>
              <Ionicons
                name="notifications-outline"
                size={30}
                color={theme.textPrimary}
              />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  2
                </Text>
              </View>
            </View>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
              }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
        </View>

        {isPetsHydrating ? (
          <HomeSectionCard>
            <SectionState
              type="loading"
              message="Cargando tu mascota..."
            />
          </HomeSectionCard>
        ) : petsError ? (
          <HomeSectionCard>
            <SectionState
              type="error"
              message={petsError}
              onRetry={retryPets}
            />
          </HomeSectionCard>
        ) : activePet ? (
          <HomePetSummaryCard
            pet={activePet}
            ageLabel={activePetAgeLabel}
            weightLabel={activePetWeightLabel}
            canSwitchPets={canSwitchPets}
            onPressProfile={navigateToPets}
            onPressChangePet={selectNextPet}
          />
        ) : (
          <HomeSectionCard>
            <SectionState
              type="empty"
              message="Aún no encontramos una mascota activa."
            />
          </HomeSectionCard>
        )}

        {isEmergencyHydrating ? (
          <HomeSectionCard>
            <SectionState
              type="loading"
              message="Cargando acceso de emergencia..."
            />
          </HomeSectionCard>
        ) : emergencyError ? (
          <HomeSectionCard>
            <SectionState
              type="error"
              message={emergencyError}
              onRetry={retryEmergency}
            />
          </HomeSectionCard>
        ) : (
          <HomeEmergencyCard
            onPress={openEmergencyMenu}
          />
        )}

        {SHOW_VACCINES_CARD ? (
          <HomeSectionCard title="Hoy para tu mascota">
            <HomeCareItem
              iconName="medkit-outline"
              iconBackground="#F3EEFF"
              title="Vacuna anual pendiente"
              subtitle="Vence en 5 días"
              onPress={navigateToCalendar}
            />
          </HomeSectionCard>
        ) : null}

        <HomeSectionCard title="Registro rápido">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.quickActionsRow
            }
          >
            {quickActions.map((action, index) => (
              <HomeQuickActionTile
                key={action.id}
                label={action.label}
                description={action.description}
                iconName={action.iconName}
                tint={
                  [
                    '#53C17F',
                    '#E7A63C',
                    '#7FA3FF',
                    '#8C6CFF',
                    '#4DB082',
                    '#F97316',
                  ][index] ?? '#53C17F'
                }
                onPress={action.onPress}
              />
            ))}
          </ScrollView>
        </HomeSectionCard>

        <HomeSectionCard
          title="Próximos cuidados"
          actionLabel="Ver calendario"
          onActionPress={navigateToCalendar}
        >
          {isCareEventsHydrating ? (
            <SectionState
              type="loading"
              message="Cargando próximos cuidados..."
            />
          ) : careEventsError ? (
            <SectionState
              type="error"
              message={careEventsError}
              onRetry={retryCareEvents}
            />
          ) : careEvents.length === 0 ? (
            <SectionState
              type="empty"
              message="No hay cuidados programados todavía."
            />
          ) : (
            <View style={styles.careList}>
              {careEvents.slice(0, 2).map((event) => (
                <HomeCareItem
                  key={event.id}
                  iconName={
                    event.event_type === 'consultation'
                      ? 'medkit-outline'
                      : event.event_type === 'vaccine'
                        ? 'shield-checkmark-outline'
                        : 'calendar-outline'
                  }
                  iconBackground={
                    event.event_type === 'consultation'
                      ? '#FFF0F0'
                      : '#EEF4FF'
                  }
                  title={event.title}
                  subtitle={
                    event.starts_at
                      ? new Intl.DateTimeFormat('es-CL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }).format(new Date(event.starts_at))
                      : 'Sin fecha programada'
                  }
                  tagLabel={
                    event.starts_at
                      ? 'Programado'
                      : 'Pendiente'
                  }
                  onPress={navigateToCalendar}
                />
              ))}
            </View>
          )}
        </HomeSectionCard>

        <HomeSectionCard title="Perfil de cuidado">
          <HomeProfileCompletionCard
            progress={profileProgress}
            onPress={navigateToCareProfile}
          />
        </HomeSectionCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 36,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
  },
  date: {
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationWrap: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: '#FF4D4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  quickActionsRow: {
    gap: 14,
    paddingRight: 10,
  },
  careList: {
    gap: 10,
  },
});
