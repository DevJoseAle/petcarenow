import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@/components/icons/Ionicons';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import { useSymptomCheckerFlow } from '../hooks/useSymptomCheckerFlow';
import type {
  SymptomCheckerStep,
  SymptomQuestionOption,
} from '../types/symptom-checker.types';

export default function SymptomCheckerConversationScreen() {
  const theme = useTheme();
  const {
    currentStep,
    selectedPet,
    selectedSymptom,
    selectedSymptomCode,
    symptoms,
    currentQuestion,
    currentQuestionOptions,
    answers,
    result,
    selectSymptomAndStart,
    answerCurrentQuestion,
    goBackFromConversation,
    restartConversation,
    closeEvaluation,
    openVeterinariesList,
    openVeterinariesMap,
    openSubscription,
    openHistory,
    usageSnapshot,
    usageAllowance,
    isPremium,
    generalError,
  } = useSymptomCheckerFlow();

  const shouldBlockConversation =
    !selectedPet;

  return (
    <Screen scroll>
      <View style={styles.content}>
        <Pressable
          onPress={goBackFromConversation}
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
            Revisión guiada
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Haremos preguntas cerradas y prudentes
            para orientar la prioridad de atención.
          </Text>
        </View>

        <StagePill
          currentStep={currentStep}
          theme={theme}
        />

        {shouldBlockConversation ? (
          <SectionState
            type="empty"
            message="Primero selecciona una mascota para abrir la conversación."
          />
        ) : (
          <View style={styles.chat}>
            <ConversationUsageCard
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

            <AssistantBubble
              theme={theme}
              title="Contexto confirmado"
              body={`Revisaremos a ${selectedPet.name} antes de seguir.`}
            />

            <UserBubble
              theme={theme}
              text={`${selectedPet.name} · ${getPetTypeLabel(
                selectedPet.pet_type
              )}`}
            />

            {!selectedSymptomCode ? (
              <>
                <AssistantBubble
                  theme={theme}
                  title="¿Qué síntoma principal quieres revisar?"
                  body="Elige lo que más te preocupa en este momento. Después profundizaremos solo en lo necesario."
                />

                <View style={styles.optionGroup}>
                  {symptoms.map((symptom) => (
                    <SelectionCard
                      key={symptom.code}
                      title={symptom.title}
                      description={
                        symptom.shortDescription
                      }
                      note={symptom.cautionLabel}
                      isSelected={false}
                      onPress={() =>
                        selectSymptomAndStart(
                          symptom.code
                        )
                      }
                      theme={theme}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {selectedSymptom ? (
              <>
                <UserBubble
                  theme={theme}
                  text={selectedSymptom.title}
                />
                <AssistantBubble
                  theme={theme}
                  variant="muted"
                  title="Síntoma seleccionado"
                  body={selectedSymptom.cautionLabel}
                />
              </>
            ) : null}

            {answers.map((answer, index) => (
              <View
                key={`${answer.questionCode}-${index}`}
                style={styles.answerBlock}
              >
                <AssistantBubble
                  theme={theme}
                  title="Pregunta respondida"
                  body={answer.questionText}
                />
                <UserBubble
                  theme={theme}
                  text={answer.label}
                />
              </View>
            ))}

            {currentStep === 'questionnaire' &&
            currentQuestion ? (
              <>
                <AssistantBubble
                  theme={theme}
                  title="Siguiente pregunta"
                  body={currentQuestion.text}
                />

                <View style={styles.optionGroup}>
                  {currentQuestionOptions.map(
                    (option) => (
                      <AnswerOptionCard
                        key={option.value}
                        option={option}
                        onPress={() =>
                          answerCurrentQuestion({
                            questionCode:
                              currentQuestion.code,
                            questionText:
                              currentQuestion.text,
                            value: option.value,
                            label: option.label,
                          })
                        }
                        theme={theme}
                      />
                    )
                  )}
                </View>
              </>
            ) : null}

            {currentStep === 'result' && result ? (
              <ResultCard
                title={result.title}
                summary={result.summary}
                actionLabel={result.actionLabel}
                escalationSignals={
                  result.escalationSignals
                }
                priority={result.priority}
                triggeredRules={result.triggeredRules}
                onRestart={restartConversation}
                onClose={closeEvaluation}
                onOpenVeterinariesList={
                  openVeterinariesList
                }
                onOpenVeterinariesMap={
                  openVeterinariesMap
                }
                onOpenHistory={openHistory}
                theme={theme}
              />
            ) : null}
          </View>
        )}
      </View>
    </Screen>
  );
}

const StagePill = ({
  currentStep,
  theme,
}: {
  currentStep: SymptomCheckerStep;
  theme: ReturnType<typeof useTheme>;
}) => {
  const labels: Record<
    SymptomCheckerStep,
    string
  > = {
    intro: 'Preparación',
    pet_selection: 'Preparación',
    symptom_selection: 'Chat guiado',
    questionnaire: 'Chat guiado',
    result: 'Resultado',
  };

  return (
    <View
      style={[
        styles.stagePill,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.stageText,
          { color: theme.textSecondary },
        ]}
      >
        {labels[currentStep]}
      </Text>
    </View>
  );
};

const ConversationUsageCard = ({
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
          : theme.surface,
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
        Chequeos del mes
      </Text>
      <Text
        style={[
          styles.usagePill,
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
    <Text
      style={[
        styles.usageText,
        { color: theme.textSecondary },
      ]}
    >
      {isPremium
        ? 'Tu plan Premium mantiene este flujo disponible sin tope local en esta etapa.'
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
          styles.usageHint,
          {
            color: isBlocked
              ? theme.warning
              : theme.textPrimary,
          },
        ]}
      >
        {isBlocked
          ? 'Ya no te quedan chequeos disponibles en el plan gratuito.'
          : `Te quedan ${remaining} chequeos disponibles.`}
      </Text>
    ) : null}
    <View style={styles.usageActionsRow}>
      {!isPremium ? (
        <Pressable
          onPress={onOpenSubscription}
          style={[
            styles.usageButton,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.usageButtonLabel,
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
          styles.usageButton,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.usageButtonLabel,
            { color: theme.textPrimary },
          ]}
        >
          Ver historial
        </Text>
      </Pressable>
    </View>
  </View>
);

const AssistantBubble = ({
  theme,
  title,
  body,
  variant = 'default',
}: {
  theme: ReturnType<typeof useTheme>;
  title: string;
  body: string;
  variant?: 'default' | 'muted';
}) => (
  <View style={styles.messageRow}>
    <View
      style={[
        styles.assistantAvatar,
        {
          backgroundColor:
            variant === 'muted'
              ? theme.surface
              : theme.infoBackground,
        },
      ]}
    >
      <Ionicons
        name="sparkles-outline"
        size={16}
        color={
          variant === 'muted'
            ? theme.textSecondary
            : theme.info
        }
      />
    </View>
    <View
      style={[
        styles.assistantBubble,
        {
          backgroundColor:
            variant === 'muted'
              ? theme.surface
              : theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.bubbleTitle,
          { color: theme.textPrimary },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.bubbleBody,
          { color: theme.textPrimary },
        ]}
      >
        {body}
      </Text>
    </View>
  </View>
);

const UserBubble = ({
  theme,
  text,
}: {
  theme: ReturnType<typeof useTheme>;
  text: string;
}) => (
  <View style={styles.userRow}>
    <View
      style={[
        styles.userBubble,
        { backgroundColor: theme.primary },
      ]}
    >
      <Text style={styles.userBubbleText}>{text}</Text>
    </View>
  </View>
);

const SelectionCard = ({
  title,
  description,
  note,
  isSelected,
  onPress,
  theme,
}: {
  title: string;
  description: string;
  note?: string;
  isSelected: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.selectionCard,
      {
        backgroundColor: theme.background,
        borderColor: isSelected
          ? theme.primary
          : theme.border,
      },
    ]}
  >
    <View style={styles.selectionCopy}>
      <Text
        style={[
          styles.selectionTitle,
          { color: theme.textPrimary },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.selectionDescription,
          { color: theme.textSecondary },
        ]}
      >
        {description}
      </Text>
      {note ? (
        <Text
          style={[
            styles.selectionNote,
            { color: theme.textSecondary },
          ]}
        >
          {note}
        </Text>
      ) : null}
    </View>
    <Ionicons
      name="chatbubble-ellipses-outline"
      size={20}
      color={theme.textSecondary}
    />
  </Pressable>
);

const AnswerOptionCard = ({
  option,
  onPress,
  theme,
}: {
  option: SymptomQuestionOption;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.answerCard,
      {
        backgroundColor: theme.background,
        borderColor: theme.border,
      },
    ]}
  >
    <Text
      style={[
        styles.answerCardText,
        { color: theme.textPrimary },
      ]}
    >
      {option.label}
    </Text>
  </Pressable>
);

const ResultCard = ({
  title,
  summary,
  actionLabel,
  escalationSignals,
  priority,
  triggeredRules,
  onRestart,
  onClose,
  onOpenVeterinariesList,
  onOpenVeterinariesMap,
  onOpenHistory,
  theme,
}: {
  title: string;
  summary: string;
  actionLabel: string;
  escalationSignals: string[];
  priority: string;
  triggeredRules: string[];
  onRestart: () => void;
  onClose: () => Promise<void>;
  onOpenVeterinariesList: () => void;
  onOpenVeterinariesMap: () => void;
  onOpenHistory: () => void;
  theme: ReturnType<typeof useTheme>;
}) => {
  const isEmergency =
    priority === 'emergency';
  const isUrgent = priority === 'urgent';
  const showVeterinariesCta =
    isEmergency || isUrgent;

  return (
    <View
      style={[
        styles.resultCard,
        {
          backgroundColor: isEmergency
            ? theme.emergencyBackground
            : isUrgent
              ? theme.warningBackground
              : theme.background,
          borderColor: isEmergency
            ? theme.emergency
            : isUrgent
              ? theme.warning
              : theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.resultTitle,
          {
            color: isEmergency
              ? theme.emergency
              : isUrgent
                ? theme.warning
                : theme.textPrimary,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.resultSummary,
          { color: theme.textPrimary },
        ]}
      >
        {summary}
      </Text>
      <Text
        style={[
          styles.resultAction,
          { color: theme.textSecondary },
        ]}
      >
        {actionLabel}
      </Text>
      <View style={styles.signalList}>
        {escalationSignals.map((signal) => (
          <View
            key={signal}
            style={styles.signalRow}
          >
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={
                isEmergency
                  ? theme.emergency
                  : isUrgent
                    ? theme.warning
                    : theme.info
              }
            />
            <Text
              style={[
                styles.signalText,
                { color: theme.textPrimary },
              ]}
            >
              {signal}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={[
          styles.resultRules,
          { color: theme.textSecondary },
        ]}
      >
        Reglas activadas: {triggeredRules.join(', ')}
      </Text>
      {showVeterinariesCta ? (
        <View style={styles.ctaGroup}>
          <Pressable
            onPress={onOpenVeterinariesMap}
            style={[
              styles.primaryActionButton,
              {
                backgroundColor: isEmergency
                  ? theme.emergency
                  : theme.warning,
                borderColor: isEmergency
                  ? theme.emergency
                  : theme.warning,
              },
            ]}
          >
            <Text style={styles.primaryActionLabel}>
              Ver veterinarias cercanas
            </Text>
          </Pressable>
          <Pressable
            onPress={onOpenVeterinariesList}
            style={[
              styles.secondaryActionButton,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.secondaryActionLabel,
                { color: theme.textPrimary },
              ]}
            >
              Ver listado
            </Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.resultActionsRow}>
        <Pressable
          onPress={onRestart}
          style={[
            styles.secondaryActionButton,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.secondaryActionLabel,
              { color: theme.textPrimary },
            ]}
          >
            Seguir consultando
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            void onClose();
          }}
          style={[
            styles.primaryActionButton,
            {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
            },
          ]}
        >
          <Text style={styles.primaryActionLabel}>
            Cerrar evaluación
          </Text>
        </Pressable>
        <Pressable
          onPress={onOpenHistory}
          style={[
            styles.secondaryActionButton,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.secondaryActionLabel,
              { color: theme.textPrimary },
            ]}
          >
            Ver historial
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const getPetTypeLabel = (petType: string) => {
  if (petType === 'dog') {
    return 'Perro';
  }

  if (petType === 'cat') {
    return 'Gato';
  }

  return 'Mascota';
};

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
  stagePill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stageText: {
    fontSize: 13,
    fontWeight: '700',
  },
  usageCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  usageTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  usagePill: {
    fontSize: 12,
    fontWeight: '700',
  },
  usageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  usageHint: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  usageButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  usageButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  usageActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chat: {
    gap: 14,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  answerBlock: {
    gap: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  assistantAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  assistantBubble: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  bubbleTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  bubbleBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  userRow: {
    alignItems: 'flex-end',
  },
  userBubble: {
    maxWidth: '84%',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  optionGroup: {
    gap: 10,
    marginLeft: 40,
  },
  selectionCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  selectionCopy: {
    flex: 1,
    gap: 4,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  selectionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  selectionNote: {
    fontSize: 13,
    lineHeight: 18,
  },
  answerCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  answerCardText: {
    fontSize: 15,
    fontWeight: '700',
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  resultSummary: {
    fontSize: 15,
    lineHeight: 22,
  },
  resultAction: {
    fontSize: 14,
    lineHeight: 20,
  },
  resultRules: {
    fontSize: 13,
    lineHeight: 18,
  },
  ctaGroup: {
    gap: 10,
  },
  resultActionsRow: {
    gap: 10,
  },
  signalList: {
    gap: 8,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  signalText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryActionButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryActionButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryActionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});
