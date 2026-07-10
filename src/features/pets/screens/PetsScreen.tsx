import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@/components/icons/Ionicons';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import { usePetsScreen } from '../hooks/usePetsScreen';
import SectionState from '@/features/home/components/SectionState';
import {
  getPetAgeLabel,
  getPetBreedLabel,
  getPetWeightLabel,
} from '../utils/pet.presenters';

export default function PetsScreen() {
  const theme = useTheme();
  const {
    pets,
    activePetId,
    isHydrating,
    generalError,
    retry,
    selectPet,
    goToCreatePet,
    goToPetDetail,
  } = usePetsScreen();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary },
            ]}
          >
            Tus mascotas
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Elige la mascota activa o administra su
            perfil.
          </Text>
        </View>

        <PrimaryButton
          title={
            pets.length === 0
              ? 'Agregar mascota'
              : 'Agregar otra mascota'
          }
          action={goToCreatePet}
        />

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando mascotas..."
          />
        ) : generalError ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : pets.length === 0 ? (
          <SectionState
            type="empty"
            message="No encontramos mascotas activas todavía."
          />
        ) : (
          <View style={styles.list}>
            {pets.map((pet) => {
              const isActive = pet.id === activePetId;

              return (
                <Pressable
                  key={pet.id}
                  onPress={() => goToPetDetail(pet.id)}
                  style={[
                    styles.card,
                    {
                      backgroundColor:
                        theme.background,
                      borderColor: isActive
                        ? '#6D4DFF'
                        : theme.border,
                    },
                  ]}
                >
                  <View style={styles.left}>
                    <View style={styles.photoWrap}>
                      {pet.photo_url ? (
                        <Image
                          source={{
                            uri: pet.photo_url,
                          }}
                          style={styles.photo}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={styles.fallback}>
                          <Ionicons
                            name="paw"
                            size={24}
                            color="#8C6CFF"
                          />
                        </View>
                      )}
                    </View>
                    <View style={styles.copy}>
                      <Text
                        style={[
                          styles.petName,
                          {
                            color: theme.textPrimary,
                          },
                        ]}
                      >
                        {pet.name}
                      </Text>
                      <Text
                        style={[
                          styles.meta,
                          {
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        {getPetBreedLabel(pet)}
                      </Text>
                      <Text
                        style={[
                          styles.meta,
                          {
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        {getPetAgeLabel(pet)} •{' '}
                        {getPetWeightLabel(pet)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.right}>
                    {isActive ? (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeText}>
                          Activa
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => selectPet(pet.id)}
                        style={styles.switchButton}
                      >
                        <Text style={styles.switchText}>
                          Activar
                        </Text>
                      </Pressable>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={theme.textSecondary}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 18,
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
    lineHeight: 22,
  },
  list: {
    gap: 14,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1.4,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  photoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#F2ECFF',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  petName: {
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    fontSize: 14,
  },
  right: {
    alignItems: 'flex-end',
    gap: 10,
  },
  activeBadge: {
    backgroundColor: '#F1EAFE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeText: {
    color: '#6D4DFF',
    fontWeight: '700',
    fontSize: 12,
  },
  switchButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EEF4FF',
  },
  switchText: {
    color: '#4C6FFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
