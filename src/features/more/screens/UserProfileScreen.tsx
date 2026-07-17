import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@/components/icons/Ionicons';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import { useUserProfileScreen } from '../hooks/useUserProfileScreen';

export default function UserProfileScreen() {
  const theme = useTheme();
  const {
    email,
    fullName,
    country,
    language,
    onboardingCompleted,
    isHydrating,
    isSaving,
    isDeleteConfirmationVisible,
    isDeletingAccount,
    generalError,
    successMessage,
    deleteAccountError,
    setFullName,
    setCountry,
    setLanguage,
    retry,
    goBack,
    handleSave,
    openDeleteAccountConfirmation,
    closeDeleteAccountConfirmation,
    handleDeleteAccount,
  } = useUserProfileScreen();

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
            Perfil de usuario
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Mantén tus datos básicos actualizados para personalizar mejor la experiencia.
          </Text>
        </View>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando perfil..."
          />
        ) : generalError &&
          !fullName &&
          !country &&
          !language ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : (
          <>
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <ProfileField
                label="Correo"
                value={email}
                themeColor={theme.textSecondary}
              />
              <InputField
                label="Nombre completo"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Tu nombre"
                themeColor={theme}
              />
              <InputField
                label="País"
                value={country}
                onChangeText={setCountry}
                placeholder="Tu país"
                themeColor={theme}
              />
              <InputField
                label="Idioma"
                value={language}
                onChangeText={setLanguage}
                placeholder="es"
                autoCapitalize="none"
                themeColor={theme}
              />
            </View>

            <View
              style={[
                styles.statusCard,
                {
                  backgroundColor:
                    theme.infoBackground,
                  borderColor: theme.info,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusLabel,
                  { color: theme.info },
                ]}
              >
                Estado del perfil
              </Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: theme.textPrimary },
                ]}
              >
                {onboardingCompleted
                  ? 'Onboarding completado'
                  : 'Onboarding pendiente'}
              </Text>
            </View>

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

            {successMessage ? (
              <Text
                style={[
                  styles.successText,
                  { color: theme.primaryPressed },
                ]}
              >
                {successMessage}
              </Text>
            ) : null}

            <PrimaryButton
              title={
                isSaving
                  ? 'Guardando...'
                  : 'Guardar cambios'
              }
              action={handleSave}
              disabled={isSaving || isDeletingAccount}
            />

            <View
              style={[
                styles.deleteCard,
                {
                  backgroundColor:
                    theme.emergencyBackground,
                  borderColor: theme.emergency,
                },
              ]}
            >
              <Text
                style={[
                  styles.deleteTitle,
                  { color: theme.emergency },
                ]}
              >
                Zona de peligro
              </Text>
              <Text
                style={[
                  styles.deleteDescription,
                  {
                    color: theme.textPrimary,
                  },
                ]}
              >
                Eliminar tu cuenta borra tu acceso y
                deja esta acción como irreversible.
              </Text>

              {!isDeleteConfirmationVisible ? (
                <Pressable
                  onPress={
                    openDeleteAccountConfirmation
                  }
                  disabled={isDeletingAccount}
                  style={[
                    styles.deletePrimaryButton,
                    {
                      borderColor:
                        theme.emergency,
                      backgroundColor:
                        theme.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.deletePrimaryLabel,
                      {
                        color: theme.emergency,
                      },
                    ]}
                  >
                    Eliminar cuenta
                  </Text>
                </Pressable>
              ) : (
                <View
                  style={[
                    styles.confirmationCard,
                    {
                      borderColor: theme.emergency,
                      backgroundColor:
                        theme.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.confirmationTitle,
                      {
                        color:
                          theme.textPrimary,
                      },
                    ]}
                  >
                    Confirma la eliminación
                  </Text>
                  <Text
                    style={[
                      styles.confirmationText,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Esta acción eliminará tu cuenta
                    completa y cerrará tu sesión en
                    este dispositivo.
                  </Text>

                  <View
                    style={
                      styles.confirmationActions
                    }
                  >
                    <Pressable
                      onPress={
                        closeDeleteAccountConfirmation
                      }
                      disabled={isDeletingAccount}
                      style={[
                        styles.cancelButton,
                        {
                          borderColor:
                            theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cancelLabel,
                          {
                            color:
                              theme.textPrimary,
                          },
                        ]}
                      >
                        Cancelar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={
                        handleDeleteAccount
                      }
                      disabled={isDeletingAccount}
                      style={[
                        styles.confirmDeleteButton,
                        {
                          backgroundColor:
                            theme.emergency,
                        },
                      ]}
                    >
                      <Text
                        style={
                          styles.confirmDeleteLabel
                        }
                      >
                        {isDeletingAccount
                          ? 'Eliminando...'
                          : 'Confirmar eliminación'}
                      </Text>
                    </Pressable>
                  </View>

                  {deleteAccountError ? (
                    <Text
                      style={[
                        styles.deleteErrorText,
                        {
                          color:
                            theme.emergency,
                        },
                      ]}
                    >
                      {deleteAccountError}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}

const ProfileField = ({
  label,
  value,
  themeColor,
}: {
  label: string;
  value: string;
  themeColor: string;
}) => (
  <View style={styles.fieldBlock}>
    <Text
      style={[
        styles.fieldLabel,
        { color: themeColor },
      ]}
    >
      {label}
    </Text>
    <Text style={styles.fieldValue}>{value}</Text>
  </View>
);

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = 'sentences',
  themeColor,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  themeColor: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.fieldBlock}>
    <Text
      style={[
        styles.fieldLabel,
        { color: themeColor.textSecondary },
      ]}
    >
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={themeColor.textSecondary}
      autoCapitalize={autoCapitalize}
      style={[
        styles.input,
        {
          borderColor: themeColor.border,
          color: themeColor.textPrimary,
          backgroundColor: themeColor.surface,
        },
      ]}
    />
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
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 18,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  fieldValue: {
    color: '#111827',
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
  successText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
  deleteTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  deleteDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  deletePrimaryButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deletePrimaryLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  confirmationCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  confirmationTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  confirmationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  confirmationActions: {
    gap: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmDeleteButton: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmDeleteLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  deleteErrorText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
