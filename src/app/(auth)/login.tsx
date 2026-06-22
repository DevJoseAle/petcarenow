import { View, Text, StyleSheet, TextInput } from 'react-native'
import { Image } from 'expo-image'
import { Screen } from '@/components/Screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { use } from 'react';
import { useTheme } from '@/features/core/theme/useTheme';

export default function LoginScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <View style={style.container}>
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
            <Text style={{ fontSize: 16, marginTop: 20, color: theme.textPrimary }}>Correo electrónico</Text>
            <View style={{borderWidth: 1.4, borderColor: theme.border, borderRadius: 10, padding: 15, marginTop: 10, flexDirection: 'row'}}>
              
            <TextInput
              placeholder="Ingresa tu correo electrónico"
            />

            </View>
          </View>
        </View>
      </View>
    </Screen>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  }
})