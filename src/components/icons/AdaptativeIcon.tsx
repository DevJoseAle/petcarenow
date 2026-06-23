import Ionicons from '@react-native-vector-icons/ionicons';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';

interface IconProps {
    name: string;
    containerStyle?: StyleProp<ViewStyle>;
    size?: number;
    color?: string;
}
const platform = Platform.OS
export default function AdaptativeIcon({ name, size = 28, color = 'black', containerStyle }: IconProps) {
    const iconName = platform === 'ios' ? `${name}-outline` : `${name}-filled`;
    return (
        <View style={containerStyle}>
            <Ionicons name={iconName as any} size={size} color={color} />
        </View>
    );
}