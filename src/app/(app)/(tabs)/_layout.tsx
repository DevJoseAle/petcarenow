import {
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Ionicons from '@/components/icons/Ionicons';
import { useMemo, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeQuickActionsSheet from '@/features/home/components/HomeQuickActionsSheet';
import { buildQuickActions } from '@/features/home/utils/buildQuickActions';

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isQuickActionsOpen, setIsQuickActionsOpen] =
    useState(false);
  const floatingButtonBottomOffset =
    insets.bottom +
    (Platform.OS === 'android' ? 80 : 48);

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

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#6D4DFF',
          tabBarInactiveTintColor: '#A3A3A3',
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            title: 'Mascotas',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'paw' : 'paw-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="records"
          options={{
            title: 'Registros',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={
                  focused
                    ? 'clipboard'
                    : 'clipboard-outline'
                }
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendario',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={
                  focused
                    ? 'calendar'
                    : 'calendar-outline'
                }
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'Más',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'menu' : 'menu-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <View
        pointerEvents="box-none"
        style={styles.floatingButtonLayer}
      >
        <Pressable
          onPress={() => setIsQuickActionsOpen(true)}
          style={[
            styles.plusButtonPressable,
            {
              bottom: floatingButtonBottomOffset,
              right: 20,
            },
          ]}
        >
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
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  floatingButtonLayer: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'box-none',
  },
  plusButtonPressable: {
    position: 'absolute',
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
