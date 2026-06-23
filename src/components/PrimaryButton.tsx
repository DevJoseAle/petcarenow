import {  Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/core/theme/useTheme';import { LinearGradient } from 'expo-linear-gradient';

interface PrimaryButtonProps{ 
    title: String;
    action: VoidFunction
}

const PrimaryButton = ({title, action}: PrimaryButtonProps) => {
    const theme = useTheme();
    return (
        <TouchableOpacity activeOpacity={0.75} onPress={action}>
            <LinearGradient
                // Aquí defines tus colores
                colors={[theme.primarySoft, theme.primary]}
                style={{ padding: 15, borderRadius: 10, marginTop: 20 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>
                {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default PrimaryButton