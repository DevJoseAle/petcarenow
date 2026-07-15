import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@/components/icons/Ionicons';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import { useHelpScreen } from '../hooks/useHelpScreen';

export default function HelpScreen() {
  const theme = useTheme();
  const {
    faqItems,
    contactOptions,
    legalLinks,
    isOpeningId,
    generalError,
    goBack,
    handleOpenContactOption,
    handleOpenLegalLink,
  } = useHelpScreen();

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
            Ayuda
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Encuentra respuestas rápidas, vías de contacto y accesos legales básicos desde un solo lugar.
          </Text>
        </View>

        <HelpSection title="Preguntas frecuentes">
          {faqItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  borderColor: theme.border,
                  backgroundColor:
                    theme.background,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: theme.textPrimary },
                ]}
              >
                {item.question}
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                {item.answer}
              </Text>
            </View>
          ))}
        </HelpSection>

        <HelpSection title="Contacto">
          {contactOptions.map((item) => (
            <ActionRow
              key={item.id}
              label={item.label}
              description={item.description}
              disabled={isOpeningId === item.id}
              onPress={() =>
                handleOpenContactOption(item)
              }
            />
          ))}
        </HelpSection>

        <HelpSection title="Legal">
          {legalLinks.map((item) => (
            <ActionRow
              key={item.id}
              label={item.label}
              description={item.description}
              disabled={isOpeningId === item.id}
              onPress={() =>
                handleOpenLegalLink(item)
              }
            />
          ))}
        </HelpSection>

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
      </View>
    </Screen>
  );
}

function HelpSection({
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
      {children}
    </View>
  );
}

function ActionRow({
  label,
  description,
  onPress,
  disabled,
}: {
  label: string;
  description: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.card,
        {
          borderColor: theme.border,
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme.textPrimary },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.cardDescription,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {description}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.textSecondary}
        />
      </View>
    </Pressable>
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
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowContent: {
    flex: 1,
    gap: 6,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
