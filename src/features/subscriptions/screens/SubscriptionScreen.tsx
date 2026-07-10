import type { ReactNode } from 'react';
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
import { useSubscriptionScreen } from '../hooks/useSubscriptionScreen';

export default function SubscriptionScreen() {
  const theme = useTheme();
  const {
    benefits,
    snapshot,
    currentPackage,
    isHydrating,
    isPurchasing,
    isRestoring,
    generalError,
    feedbackMessage,
    goBack,
    retry,
    handlePurchase,
    handleRestore,
  } = useSubscriptionScreen();

  const isPremium =
    snapshot?.access === 'premium';
  const isPreview =
    snapshot?.environment === 'preview';
  const isConfigMissing =
    snapshot?.environment === 'missing_keys';
  const isUnsupported =
    snapshot?.environment ===
    'unsupported_platform';

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
            Suscripción / Premium
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Revisa tu acceso actual, explora los beneficios premium y deja lista la monetización real de la app.
          </Text>
        </View>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando suscripción..."
          />
        ) : generalError && !snapshot ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : (
          <>
            <SubscriptionSection
              title="Tu acceso actual"
            >
              <StatusRow
                label="Estado"
                value={
                  isPremium
                    ? 'Premium activo'
                    : 'Plan gratuito'
                }
                tone={
                  isPremium
                    ? 'positive'
                    : 'neutral'
                }
              />
              <Text
                style={[
                  styles.helperText,
                  { color: theme.textSecondary },
                ]}
              >
                {isPremium
                  ? `Tu entitlement activo es ${snapshot?.entitlementId}.`
                  : 'Aún no hay un entitlement premium activo para esta cuenta.'}
              </Text>
            </SubscriptionSection>

            {isPreview ? (
              <SubscriptionSection title="Preview mode">
                <Text
                  style={[
                    styles.helperText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Estás usando Expo Go. Aquí puedes validar la UI y el flujo general, pero las compras reales y la restauración efectiva requieren un development build.
                </Text>
              </SubscriptionSection>
            ) : null}

            {isConfigMissing ? (
              <SubscriptionSection title="Configuración pendiente">
                <Text
                  style={[
                    styles.helperText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Faltan las llaves públicas de RevenueCat para esta plataforma. Agrega las variables públicas y vuelve a cargar la pantalla.
                </Text>
              </SubscriptionSection>
            ) : null}

            {isUnsupported ? (
              <SubscriptionSection title="Plataforma no soportada">
                <Text
                  style={[
                    styles.helperText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Esta experiencia de suscripción está pensada para iOS y Android.
                </Text>
              </SubscriptionSection>
            ) : null}

            <SubscriptionSection
              title="Beneficios premium"
            >
              {benefits.map((benefit) => (
                <View
                  key={benefit.id}
                  style={[
                    styles.benefitCard,
                    {
                      borderColor: theme.border,
                      backgroundColor:
                        theme.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.benefitTitle,
                      {
                        color:
                          theme.textPrimary,
                      },
                    ]}
                  >
                    {benefit.title}
                  </Text>
                  <Text
                    style={[
                      styles.benefitDescription,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    {benefit.description}
                  </Text>
                </View>
              ))}
            </SubscriptionSection>

            <SubscriptionSection
              title="Plan disponible"
            >
              {currentPackage ? (
                <View
                  style={[
                    styles.packageCard,
                    {
                      borderColor: theme.border,
                      backgroundColor:
                        theme.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.packageTitle,
                      {
                        color:
                          theme.textPrimary,
                      },
                    ]}
                  >
                    {currentPackage.title}
                  </Text>
                  <Text
                    style={[
                      styles.packagePrice,
                      {
                        color:
                          theme.primaryPressed,
                      },
                    ]}
                  >
                    {currentPackage.price}
                  </Text>
                  <Text
                    style={[
                      styles.packageDescription,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    {currentPackage.description}
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.helperText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Todavía no encontramos offerings activos para esta app o plataforma.
                </Text>
              )}
            </SubscriptionSection>

            <PrimaryButton
              title={
                isPremium
                  ? 'Ya tienes Premium activo'
                  : isPurchasing
                  ? 'Procesando...'
                  : isPreview
                  ? 'Probar flujo en preview'
                  : 'Continuar con Premium'
              }
              action={handlePurchase}
              disabled={
                isPremium ||
                isPurchasing ||
                !snapshot ||
                isConfigMissing ||
                isUnsupported
              }
            />

            <PrimaryButton
              title={
                isRestoring
                  ? 'Restaurando...'
                  : 'Restaurar compras'
              }
              action={handleRestore}
              disabled={
                isRestoring ||
                !snapshot ||
                isConfigMissing ||
                isUnsupported
              }
            />

            {feedbackMessage ? (
              <Text
                style={[
                  styles.successText,
                  {
                    color:
                      theme.primaryPressed,
                  },
                ]}
              >
                {feedbackMessage}
              </Text>
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
          </>
        )}
      </View>
    </Screen>
  );
}

function SubscriptionSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.textPrimary },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'positive' | 'neutral';
}) {
  const theme = useTheme();
  const toneColor =
    tone === 'positive'
      ? theme.primaryPressed
      : theme.textSecondary;

  return (
    <View style={styles.statusRow}>
      <Text
        style={[
          styles.statusLabel,
          { color: theme.textPrimary },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.statusValue,
          { color: toneColor },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
  },
  benefitCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  packageCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: '800',
  },
  packageDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
