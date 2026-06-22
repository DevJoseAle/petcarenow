import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Screen } from '@/components/Screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const safeArea = useSafeAreaInsets();
  return (
    <Screen>
      <View style={style.container}>
        <View>
          
        </View>
      </View>
    </Screen>
  )
}

const style = StyleSheet.create({
  container: {
    flex :1 ,
    paddingTop: 20,
  }
})