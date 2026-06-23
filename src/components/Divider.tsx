import { View, Text } from 'react-native'
import { useTheme } from '@/features/core/theme/useTheme';

interface DividerProps {
    title?: String
}

const Divider = ({ title }: DividerProps) => {
    const theme = useTheme();
  return (
    
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, alignContent: 'center', alignItems: 'center', gap: 10 }}>
                <View style={{ width: '100%', height: 1.5, backgroundColor: theme.border, borderRadius: 10 }} />
               {
                title && (
                     <Text style={{ color: theme.textPrimary, fontWeight: 'semibold', textAlign: 'center', fontSize: 14 }} > { title }</Text>
                )
               }
              {
                title && (
                     <View style={{ width: '100%', height: 1.5, backgroundColor: theme.border, borderRadius: 10 }} />
                )
              }
              </View>
  )
}

export default Divider