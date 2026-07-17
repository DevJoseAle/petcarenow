import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@/components/icons/Ionicons';
import PrimaryButton from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import { useSymptomCheckerFlow } from '../hooks/useSymptomCheckerFlow';

export default function SymptomCheckerScreen() {
  const theme = useTheme();
  const {
    currentStep,
    pets,
    selectedPetId,
    usageSnapshot,
    usageAllowance,
    isUsageHydrating,
    usageError,
    isPremium,
    isPetsHydrating,
    petsError,
    generalError,
    hasPets,
    selectPetAndContinue,
    retryPets,
    handleBack,
    handleContinue,
    goToCreatePet,
    retryUsage,
    openSubscription,
    openHistory,
  } = useSymptomCheckerFlow();

  return (
    <Screen scroll>
      <View style={styles.content}>
        <Pressable
          onPress={handleBack}
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
            Symptom Checker
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Primero dejemos el contexto listo. Después
            te llevaremos a una conversación guiada
            enfocada solo en el síntoma principal.
          </Text>
        </View>

        <View style={styles.section}>
          {isUsageHydrating ? (
            <SectionState
              type="loading"
              message="Cargando uso mensual..."
            />
          ) : usageError ? (
            <SectionState
              type="error"
              message={usageError}
              onRetry={retryUsage}
            />
          ) : (
            <UsageCard
              theme={theme}
              isPremium={isPremium}
              monthKey={usageSnapshot?.monthKey ?? null}
              completedEvaluations={
                usageSnapshot?.completedEvaluations ??
                0
              }
              remaining={usageAllowance.remaining}
              limit={usageAllowance.limit}
              isBlocked={usageAllowance.isBlocked}
              onOpenSubscription={openSubscription}
              onOpenHistory={openHistory}
            />
          )}
        </View>

        {currentStep === 'intro' ? (
          <View style={styles.section}>
            <InfoCard
              title="Lo que sí hace"
              body="Detecta señales de alarma, organiza preguntas importantes y orienta la prioridad de atención."
              theme={theme}
            />
            <InfoCard
              title="Lo que no hace"
              body="No entrega diagnóstico, no indica medicamentos y no reemplaza una evaluación veterinaria."
              theme={theme}
            />
            <InfoCard
              title="Importante"
              body="Si tu mascota está muy comprometida o no puedes responder con seguridad, busca atención inmediata."
              theme={theme}
              variant="warning"
            />
          </View>
        ) : null}

        {currentStep === 'pet_selection' ? (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.textPrimary },
              ]}
            >
              Selecciona la mascota
            </Text>
            <Text
              style={[
                styles.sectionCopy,
                { color: theme.textSecondary },
              ]}
            >
              Apenas la confirmes, abriremos la pantalla
              conversacional para revisar el síntoma.
            </Text>

            {isPetsHydrating ? (
              <SectionState
                type="loading"
                message="Cargando mascotas..."
              />
            ) : petsError ? (
              <SectionState
                type="error"
                message={petsError}
                onRetry={retryPets}
              />
            ) : !hasPets ? (
              <View style={styles.emptyState}>
                <SectionState
                  type="empty"
                  message="Necesitas al menos una mascota activa para comenzar."
                />
                <PrimaryButton
                  title="Agregar mascota"
                  action={goToCreatePet}
                />
              </View>
            ) : (
              <View style={styles.optionList}>
                {pets.map((pet) => {
                  const isSelected =
                    pet.id === selectedPetId;

                  return (
                    <Pressable
                      key={pet.id}
                      onPress={() =>
                        selectPetAndContinue(
                          pet.id
                        )
                      }
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor:
                            theme.background,
                          borderColor: isSelected
                            ? theme.primary
                            : theme.border,
                        },
                      ]}
                    >
                      <View style={styles.optionCopy}>
                        <Text
                          style={[
                            styles.optionTitle,
                            {
                              color:
                                theme.textPrimary,
                            },
                          ]}
                        >
                          {pet.name}
                        </Text>
                        <Text
                          style={[
                            styles.optionDescription,
                            {
                              color:
                                theme.textSecondary,
                            },
                          ]}
                        >
                          {pet.pet_type === 'dog'
                            ? 'Perro'
                            : pet.pet_type === 'cat'
                              ? 'Gato'
                              : 'Mascota'}
                        </Text>
                      </View>
                      {isSelected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={theme.primary}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}

        {generalError ? (
          <Text
            style={[
              styles.errorText,
              { color: theme.emergency },
            ]}
          >
            {generalError}
          </Text>
        ) : null}

        {currentStep === 'intro' ? (
          <PrimaryButton
            title="Comenzar revisión"
            action={handleContinue}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const InfoCard = ({
  title,
  body,
  theme,
  variant = 'default',
}: {
  title: string;
  body: string;
  theme: ReturnType<typeof useTheme>;
  variant?: 'default' | 'warning';
}) => (
  <View
    style={[
      styles.infoCard,
      {
        backgroundColor:
          variant === 'warning'
            ? theme.warningBackground
            : theme.background,
        borderColor:
          variant === 'warning'
            ? theme.warning
            : theme.border,
      },
    ]}
  >
    <Text
      style={[
        styles.infoTitle,
        {
          color:
            variant === 'warning'
              ? theme.warning
              : theme.textPrimary,
        },
      ]}
    >
      {title}
    </Text>
    <Text
      style={[
        styles.infoBody,
        { color: theme.textSecondary },
      ]}
    >
      {body}
    </Text>
  </View>
);

const UsageCard = ({
  theme,
  isPremium,
  monthKey,
  completedEvaluations,
  remaining,
  limit,
  isBlocked,
  onOpenSubscription,
  onOpenHistory,
}: {
  theme: ReturnType<typeof useTheme>;
  isPremium: boolean;
  monthKey: string | null;
  completedEvaluations: number;
  remaining: number | null;
  limit: number | null;
  isBlocked: boolean;
  onOpenSubscription: () => void;
  onOpenHistory: () => void;
}) => (
  <View
    style={[
      styles.usageCard,
      {
        backgroundColor: isBlocked
          ? theme.warningBackground
          : theme.background,
        borderColor: isBlocked
          ? theme.warning
          : theme.border,
      },
    ]}
  >
    <View style={styles.usageHeader}>
      <Text
        style={[
          styles.usageTitle,
          { color: theme.textPrimary },
        ]}
      >
        Uso mensual
      </Text>
      <View
        style={[
          styles.usageBadge,
          {
            backgroundColor: isPremium
              ? theme.infoBackground
              : theme.surface,
            borderColor: isPremium
              ? theme.info
              : theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.usageBadgeText,
            {
              color: isPremium
                ? theme.info
                : theme.textSecondary,
            },
          ]}
        >
          {isPremium ? 'Premium' : 'Gratis'}
        </Text>
      </View>
    </View>
    <Text
      style={[
        styles.usageBody,
        { color: theme.textSecondary },
      ]}
    >
      {isPremium
        ? 'Tu plan Premium mantiene el Symptom Checker disponible sin tope mensual local en esta etapa.'
        : `Has cerrado ${completedEvaluations} chequeos${
            limit !== null
              ? ` de ${limit}`
              : ''
          } este mes${
            monthKey ? ` (${monthKey})` : ''
          }.`}
    </Text>
    {!isPremium && remaining !== null ? (
      <Text
        style={[
          styles.usageHighlight,
          {
            color: isBlocked
              ? theme.warning
              : theme.textPrimary,
          },
        ]}
      >
        {isBlocked
          ? 'Alcanzaste el límite mensual del plan gratuito.'
          : `Te quedan ${remaining} chequeos este mes.`}
      </Text>
    ) : null}
    <View style={styles.usageActionsRow}>
      {!isPremium ? (
        <Pressable
          onPress={onOpenSubscription}
          style={[
            styles.upgradeButton,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.upgradeButtonLabel,
              { color: theme.textPrimary },
            ]}
          >
            Ver Premium
          </Text>
        </Pressable>
      ) : null}
      <Pressable
        onPress={onOpenHistory}
        style={[
          styles.upgradeButton,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.upgradeButtonLabel,
            { color: theme.textPrimary },
          ]}
        >
          Ver historial
        </Text>
      </Pressable>
    </View>
  </View>
);

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
    lineHeight: 22,
  },
  section: {
    gap: 14,
  },
  usageCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  usageBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  usageBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  usageBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  usageHighlight: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  upgradeButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  usageActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  upgradeButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  infoBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  sectionCopy: {
    fontSize: 15,
    lineHeight: 22,
  },
  optionList: {
    gap: 10,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    gap: 10,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
