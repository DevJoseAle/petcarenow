import {  Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/core/theme/useTheme';import { LinearGradient } from 'expo-linear-gradient';

interface PrimaryButtonProps{ 
    title: String;
    action: VoidFunction;
    disabled?: boolean;
}

const PrimaryButton = ({title, action, disabled = false}: PrimaryButtonProps) => {
    const theme = useTheme();
    return (
        <TouchableOpacity activeOpacity={0.75} onPress={action} disabled={disabled}>
            <LinearGradient
                // Aquí defines tus colores
                colors={disabled ? [theme.border, theme.border] : [theme.primarySoft, theme.primary]}
                style={{ padding: 15, borderRadius: 10, marginTop: 20, opacity: disabled ? 0.7 : 1 }}
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
