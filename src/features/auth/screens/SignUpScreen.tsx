import { View, Text } from 'react-native'
import { Screen } from '@/components/Screen'
import LabeledTextField from '@/components/LabeledTextField'
import { Image } from 'expo-image'
import { useTheme } from '@/core/theme/useTheme'
import PrimaryButton from '@/components/PrimaryButton'
import TouchableText from '@/components/TouchableText'
import { useSignUpScreen } from '../hooks/useSignUpScreen'

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

      <View>
        <View style={{ marginTop: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Image
          style={{ width: 100, height: 100 }}
          source={require('@/assets/images/PCNLogo.png')}
        />
        <Text style={{fontWeight: '600', fontSize: 30}}> Pet Care Now </Text>
        <Text style={{fontWeight: 'thin', color: theme.textSecondary, fontStyle: 'italic' }} >La App para el cuidado de tu mascota</Text>
        </View>
      <View style={{marginTop: 20}}>
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
