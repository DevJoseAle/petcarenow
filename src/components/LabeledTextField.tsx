import { View, TextInput, TouchableOpacity, Text } from "react-native";
import AdaptativeIcon from "./icons/AdaptativeIcon";
import { useTheme } from '@/core/theme/useTheme';

interface LabeledTextFieldProps {
  label: string;
  placeholder: string;
  leftIconName: string;
  rightIconName?: string;
  secureTextEntry?: boolean;
  rightIconAction: () => void;
  value?: string;
  onChangeText?: (value: string) => void;
  onBlur?: VoidFunction;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  autoCorrect?: boolean;
  editable?: boolean;
  error?: string;
}

const LabeledTextField = ({
  label,
  placeholder,
  leftIconName,
  rightIconAction,
  rightIconName,
  secureTextEntry,
  value,
  onChangeText,
  onBlur,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  autoCorrect = false,
  editable = true,
  error,
}: LabeledTextFieldProps) => {
  const theme = useTheme();
  return (
    <View>
      <Text style={{
                  fontSize: 12,
                  marginTop: 20,
                  color: theme.textPrimary,
                  fontWeight: 'bold',
                  paddingLeft: 10
                }}>
                 {label}
                </Text>
      <View style={{ borderWidth: 1.4, borderColor: error ? '#DC2626' : theme.border, borderRadius: 10, paddingVertical: 15, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }}>
      
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AdaptativeIcon name={leftIconName} color={theme.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={autoCorrect}
          editable={editable}
          style={{ flex: 1, color: theme.textPrimary }}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
        />
        {
          rightIconName && (
            <TouchableOpacity onPress={rightIconAction}>
              <AdaptativeIcon name={rightIconName} color={theme.textSecondary} containerStyle={{ paddingRight: 5 }} />
            </TouchableOpacity>
          )
        }

      </View>
    </View>
    {error ? (
      <Text
        style={{
          color: '#DC2626',
          fontSize: 12,
          marginTop: 8,
          paddingLeft: 10,
        }}
      >
        {error}
      </Text>
    ) : null}
    </View>
  )
}

export default LabeledTextField
