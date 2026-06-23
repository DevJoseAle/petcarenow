import { useTheme } from '@/features/core/theme/useTheme';
import { FlexAlignType, StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native';

interface TouchableTextProps {
    title: String;
    action: VoidFunction;
    style?: StyleProp<TextStyle>
    fontSize?: number;
    alignment?: "auto" | FlexAlignType | undefined
}

const TouchableText = ({title, action, style, fontSize, alignment}: TouchableTextProps) => {
    const theme = useTheme();
    return (
        <TouchableOpacity activeOpacity={0.75} onPress={action}>
            <Text
                style={{alignSelf: alignment, fontSize: fontSize || 20, marginTop: 30, fontWeight: 'bold', color: theme.primary, ...style }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default TouchableText