import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import {
  type AppLanguagePreference,
} from '../services/settings.service';
import { useSettingsScreen } from '../hooks/useSettingsScreen';

export default function SettingsScreen() {
  const theme = useTheme();
  const {
    language,
    languageLabels,
    themeSummary,
    activePetName,
    activePetSummary,
    isHydrating,
    hasLoadError,
    isUpdating,
    generalError,
    successMessage,
    retry,
    goBack,
    openProfile,
    openPets,
    handleLanguageChange,
    showThemeInfo,
  } = useSettingsScreen();

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
            Configuración
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Ajusta tu experiencia y encuentra accesos clave de la cuenta desde un solo lugar.
          </Text>
        </View>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando configuración..."
          />
        ) : hasLoadError ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : (
          <>
            <SettingsSection
              title="Cuenta y app"
            >
              <ActionRow
                label="Editar perfil"
                description="Actualiza tu nombre, país e idioma base."
                onPress={openProfile}
              />
              <ActionRow
                label={activePetName}
                description={activePetSummary}
                onPress={openPets}
              />
            </SettingsSection>

            <SettingsSection
              title="Experiencia"
            >
              <View
                style={[
                  styles.block,
                  {
                    borderColor: theme.border,
                    backgroundColor:
                      theme.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.blockLabel,
                    {
                      color:
                        theme.textPrimary,
                    },
                  ]}
                >
                  Idioma preferido
                </Text>
                <Text
                  style={[
                    styles.blockDescription,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Lo usaremos para futuras personalizaciones de contenido.
                </Text>

                <View
                  style={styles.languageRow}
                >
                  {(
                    Object.keys(
                      languageLabels
                    ) as AppLanguagePreference[]
                  ).map((value) => {
                    const isSelected =
                      value === language;

                    return (
                      <Pressable
                        key={value}
                        onPress={() =>
                          handleLanguageChange(
                            value
                          )
                        }
                        disabled={isUpdating}
                        style={[
                          styles.languageChip,
                          {
                            borderColor:
                              isSelected
                                ? theme.primary
                                : theme.border,
                            backgroundColor:
                              isSelected
                                ? theme.infoBackground
                                : theme.surface,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.languageChipText,
                            {
                              color:
                                isSelected
                                  ? theme.primaryPressed
                                  : theme.textPrimary,
                            },
                          ]}
                        >
                          {
                            languageLabels[
                              value
                            ]
                          }
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <ActionRow
                label="Tema"
                description={`La app sigue el tema del dispositivo: ${themeSummary}.`}
                onPress={showThemeInfo}
                trailingLabel="Sistema"
              />
            </SettingsSection>

            {successMessage ? (
              <Text
                style={[
                  styles.successText,
                  {
                    color:
                      theme.primaryPressed,
                  },
                ]}
              >
                {successMessage}
              </Text>
            ) : null}

            {generalError ? (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: theme.emergency,
                  },
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

function SettingsSection({
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
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

function ActionRow({
  label,
  description,
  onPress,
  trailingLabel,
}: {
  label: string;
  description: string;
  onPress: () => void;
  trailingLabel?: string;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          borderColor: theme.border,
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowLabel,
            { color: theme.textPrimary },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.rowDescription,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {description}
        </Text>
      </View>

      <View style={styles.rowTrailing}>
        {trailingLabel ? (
          <Text
            style={[
              styles.trailingLabel,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {trailingLabel}
          </Text>
        ) : null}
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
  sectionContent: {
    gap: 12,
  },
  row: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowContent: {
    flex: 1,
    gap: 6,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  rowTrailing: {
    alignItems: 'flex-end',
    gap: 6,
  },
  trailingLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  block: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
  blockLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  blockDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  languageChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  languageChipText: {
    fontSize: 14,
    fontWeight: '700',
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
