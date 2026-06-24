import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Screen } from '@/components/Screen';
import LabeledTextField from '@/components/LabeledTextField';
import PrimaryButton from '@/components/PrimaryButton';
import TouchableText from '@/components/TouchableText';
import { useTheme } from '@/core/theme/useTheme';
import { useForgotPasswordScreen } from '../hooks/useForgotPasswordScreen';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const {
    email,
    emailError,
    generalError,
    successMessage,
    isSubmitting,
    setEmail,
    handleEmailBlur,
    handleSubmit,
    goToLogin,
  } = useForgotPasswordScreen();

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View>
          <Text
            style={{
              marginTop: 12,
              fontSize: 16,
              color: theme.textSecondary,
            }}
          >
            Ingresa tu correo y te enviaremos
            instrucciones para recuperar el
            acceso.
          </Text>

          <View style={{ marginTop: 24 }}>
            <LabeledTextField
              label="Correo Electrónico"
              placeholder="Tumail@email.com"
              leftIconName="mail"
              value={email}
              onChangeText={setEmail}
              onBlur={handleEmailBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              secureTextEntry={false}
              rightIconAction={() => {}}
              editable={!isSubmitting}
              error={emailError}
            />
          </View>

          {generalError ? (
            <Text
              style={{
                marginTop: 16,
                fontSize: 14,
                color: '#DC2626',
              }}
            >
              {generalError}
            </Text>
          ) : null}

          {successMessage ? (
            <Text
              style={{
                marginTop: 16,
                fontSize: 14,
                color: '#15803D',
              }}
            >
              {successMessage}
            </Text>
          ) : null}

          <PrimaryButton
            title={
              isSubmitting
                ? 'Enviando...'
                : 'Enviar correo'
            }
            action={handleSubmit}
            disabled={isSubmitting}
          />
          <TouchableText
            title="Volver a Iniciar Sesión"
            action={goToLogin}
            alignment="center"
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
