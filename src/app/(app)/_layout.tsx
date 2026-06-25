import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import {
  GlassView,
  isGlassEffectAPIAvailable,
} from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/store/auth.store';
import HomeQuickActionsSheet from '@/features/home/components/HomeQuickActionsSheet';
import { buildQuickActions } from '@/features/home/utils/buildQuickActions';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { logger } from '@/core/utils/debug';

export default function HomeLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isQuickActionsOpen, setIsQuickActionsOpen] =
    useState(false);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isHydrating = useAuthStore(
    (state) => state.isHydrating
  );
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const hasPets = usePetOnboardingGateStore(
    (state) => state.hasPets
  );
  const isPetGateHydrating =
    usePetOnboardingGateStore(
      (state) => state.isHydrating
    );
  const petGateError =
    usePetOnboardingGateStore(
      (state) => state.generalError
    );
  const hydratePetStatus =
    usePetOnboardingGateStore(
      (state) => state.hydratePetStatus
    );
  const hydratePets = usePetStore(
    (state) => state.hydratePets
  );
  const resetPets = usePetStore(
    (state) => state.reset
  );
  const prevUserIdRef = useRef<string | null>(null);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      userId &&
      userId !== prevUserIdRef.current
    ) {
      logger.debug(
        'HomeLayout calling hydratePetStatus',
        { userId }
      );
      prevUserIdRef.current = userId;
      hasNavigatedRef.current = false;
      hydratePetStatus(userId);
      hydratePets(userId);
    }

    if (!userId) {
      prevUserIdRef.current = null;
      resetPets();
    }
  }, [
    hydratePetStatus,
    hydratePets,
    isAuthenticated,
    resetPets,
    userId,
  ]);

  useEffect(() => {
    if (
      isHydrating ||
      isPetGateHydrating ||
      !isAuthenticated
    ) {
      return;
    }

    const needsOnboarding = petGateError || !hasPets;

    if (
      needsOnboarding &&
      !hasNavigatedRef.current
    ) {
      hasNavigatedRef.current = true;
      router.replace('/pet-onboarding');
    } else if (
      !needsOnboarding &&
      hasNavigatedRef.current
    ) {
      hasNavigatedRef.current = false;
    }
  }, [
    hasPets,
    isAuthenticated,
    isHydrating,
    isPetGateHydrating,
    petGateError,
    router,
  ]);

  const quickActions = useMemo(
    () =>
      buildQuickActions({
        navigateToRecordEntry: (type) => {
          setIsQuickActionsOpen(false);
          router.push(
            type
              ? `/record-entry?type=${type}`
              : '/record-entry'
          );
        },
        navigateToEventEntry: () => {
          setIsQuickActionsOpen(false);
          router.push('/event-entry');
        },
        navigateToAddPet: () => {
          setIsQuickActionsOpen(false);
          router.push('/pet-detail?mode=create');
        },
      }),
    [router]
  );

  const canUseGlassButton =
    Platform.OS === 'ios' &&
    isGlassEffectAPIAvailable();

  if (isHydrating || isPetGateHydrating) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <NativeTabs
        backgroundColor="#FFFFFF"
        tintColor="#6D4DFF"
        iconColor={{
          default: '#A3A3A3',
          selected: '#6D4DFF',
        }}
        labelStyle={{
          default: styles.tabLabel,
          selected: styles.tabLabelSelected,
        }}
        minimizeBehavior="onScrollDown"
      >
        <NativeTabs.Trigger
          name="index"
          disableAutomaticContentInsets
        >
          <NativeTabs.Trigger.Icon
            sf={{
              default: 'house',
              selected: 'house.fill',
            }}
            drawable="ic_menu_view"
          />
          <NativeTabs.Trigger.Label>
            Inicio
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger
          name="pets"
          disableAutomaticContentInsets
        >
          <NativeTabs.Trigger.Icon
            sf={{
              default: 'pawprint',
              selected: 'pawprint.fill',
            }}
            drawable="ic_menu_myplaces"
          />
          <NativeTabs.Trigger.Label>
            Mascotas
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger
          name="calendar"
          disableAutomaticContentInsets
        >
          <NativeTabs.Trigger.Icon
            sf={{
              default: 'calendar',
              selected: 'calendar.circle.fill',
            }}
            drawable="ic_menu_month_calendar"
          />
          <NativeTabs.Trigger.Label>
            Calendario
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger
          name="more"
          disableAutomaticContentInsets
        >
          <NativeTabs.Trigger.Icon
            sf={{
              default: 'line.3.horizontal',
              selected:
                'line.3.horizontal.decrease.circle.fill',
            }}
            drawable="ic_menu_manage"
          />
          <NativeTabs.Trigger.Label>
            Más
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>

      <View
        pointerEvents="box-none"
        style={styles.floatingButtonLayer}
      >
        <Pressable
          onPress={() => setIsQuickActionsOpen(true)}
          style={[
            styles.plusButtonPressable,
            { bottom: insets.bottom + 6 },
          ]}
        >
          {canUseGlassButton ? (
            <GlassView
              glassEffectStyle="regular"
              tintColor="rgba(109, 77, 255, 0.18)"
              isInteractive
              style={styles.plusButtonGlass}
            >
              <Ionicons
                name="add"
                size={32}
                color="#6D4DFF"
              />
            </GlassView>
          ) : (
            <LinearGradient
              colors={['#7C63FF', '#6D4DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.plusButtonFallback}
            >
              <Ionicons
                name="add"
                size={32}
                color="#FFFFFF"
              />
            </LinearGradient>
          )}
        </Pressable>
      </View>

      <HomeQuickActionsSheet
        visible={isQuickActionsOpen}
        title="Acciones rápidas"
        actions={quickActions}
        onClose={() => setIsQuickActionsOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabLabelSelected: {
    fontSize: 12,
    fontWeight: '700',
  },
  floatingButtonLayer: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'box-none',
  },
  plusButtonPressable: {
    position: 'absolute',
    alignSelf: 'center',
  },
  plusButtonGlass: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButtonFallback: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D4DFF',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 5,
  },
});
