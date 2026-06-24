import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { Image } from 'expo-image'
import { Screen } from '@/components/Screen'
import LabeledTextField from '@/components/LabeledTextField';
import PrimaryButton from '@/components/PrimaryButton';
import TouchableText from '@/components/TouchableText';
import Divider from '@/components/Divider';
import { useTheme } from '@/core/theme/useTheme';
import { useLoginScreen } from '../hooks/useLoginScreen'
export default function LoginScreen() {
    const {
        email,
        password,
        emailError,
        passwordError,
        generalError,
        isSubmitting,
        isPasswordVisible,
        setEmail,
        setPassword,
        handleEmailBlur,
        handlePasswordBlur,
        handleSubmit,
        goToRegister,
        goToForgotPassword,
        togglePasswordVisibility,
    } = useLoginScreen();
    const theme = useTheme();
    return (
        <Screen>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={20}>
                <ScrollView
                    style={style.container}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View>
                        <Image
                            style={{ width: 100, height: 100 }}
                            source={require('@/assets/images/PCNLogo.png')}
                        />
                        <Text
                            style={{ fontSize: 30, fontWeight: "bold", marginTop: 20, color: theme.textPrimary }}
                        >Bienvenido a{"\n"}PetCareNow </Text>
                        <Text style={{ fontSize: 20, marginTop: 10, fontWeight: 'thin', color: theme.textSecondary }}>Tu Guía de mascotas</Text>


                        {/* Text Fields */}

                        <View>
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
                            <Text
                                style={{
                                    color: '#DC2626',
                                    marginTop: 16,
                                    fontSize: 14,
                                }}
                            >
                                {generalError}
                            </Text>
                        ) : null}

                        <View style={{
                            width: '100%',
                            marginTop: 20,


                        }}>
                            <PrimaryButton title={isSubmitting ? "Ingresando..." : "Iniciar Sesión"} action={handleSubmit} disabled={isSubmitting} />
                            <TouchableText title={"¿Olvidaste tu Contraseña?"} action={goToForgotPassword} alignment='flex-end' fontSize={15} style={{ marginBottom: 10 }} />
                            <Divider title={"¿No tienes una cuenta?"} />
                            <TouchableText title={"Crea tu cuenta aquí"} action={goToRegister} alignment='center' />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    )
}




const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    }
})
