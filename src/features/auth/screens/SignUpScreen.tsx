import { StyleSheet, View, Text } from 'react-native'
import { Screen } from '@/components/Screen'
import LabeledTextField from '@/components/LabeledTextField'
import { Image } from 'expo-image'
import { useTheme } from '@/core/theme/useTheme'
import PrimaryButton from '@/components/PrimaryButton'
import TouchableText from '@/components/TouchableText'
import { useSignUpScreen } from '../hooks/useSignUpScreen'

const HEADER_CONTENT_OFFSET = 48

export default function SignUpScreen() {
  const {
    email,
    password,
    emailError,
    passwordError,
    generalError,
    successMessage,
    isSubmitting,
    isPasswordVisible,
    setEmail,
    setPassword,
    handleEmailBlur,
    handlePasswordBlur,
    handleSubmit,
    goToLogin,
    togglePasswordVisibility,
  } = useSignUpScreen()
  const theme = useTheme()
  return (
    <Screen scroll>

      <View style={styles.content}>
        <View style={styles.brand}>
          <Image
          style={styles.logo}
          source={require('@/assets/images/PCNLogo.png')}
        />
        <Text style={styles.title}> Pet Care Now </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.textSecondary },
          ]}
        >
          La App para el cuidado de tu mascota
        </Text>
        </View>
      <View style={styles.form}>
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
          rightIconAction={() => { }}
          editable={!isSubmitting}
          error={emailError}

        />
        <LabeledTextField
          label="Contraseña"
          placeholder="Contraseña"
          leftIconName="lock-closed"
          rightIconName='eye'
          value={password}
          onChangeText={setPassword}
          onBlur={handlePasswordBlur}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!isPasswordVisible}
          rightIconAction={togglePasswordVisibility}
          editable={!isSubmitting}
          error={passwordError}

        />
      </View>
      {generalError ? (
        <Text style={{ color: '#DC2626', marginTop: 16, fontSize: 14 }}>
          {generalError}
        </Text>
      ) : null}
      {successMessage ? (
        <Text style={{ color: '#15803D', marginTop: 16, fontSize: 14 }}>
          {successMessage}
        </Text>
      ) : null}
      <PrimaryButton title={isSubmitting ? "Creando..." : "Crear Cuenta"} action={handleSubmit} disabled={isSubmitting} />
      <TouchableText title="Volver a Iniciar Sesión" action={goToLogin} alignment='center' />
      </View>

    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: HEADER_CONTENT_OFFSET,
  },
  brand: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
  },
  subtitle: {
    fontWeight: '100',
    fontStyle: 'italic',
  },
  form: {
    marginTop: 20,
  },
})
