import { View, TextInput, TouchableOpacity, Text } from "react-native";
import AdaptativeIcon from "./icons/AdaptativeIcon";
import { useTheme } from "@/features/core/theme/useTheme";


interface LabeledTextFieldProps {
  label: string;
  placeholder: string;
  leftIconName: string;
  rightIconName?: string;
  secureTextEntry?: boolean;
  rightIconAction: () => void;
}

const LabeledTextField = ({ label, placeholder, leftIconName, rightIconAction, rightIconName, secureTextEntry }: LabeledTextFieldProps) => {
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
      <View style={{ borderWidth: 1.4, borderColor: theme.border, borderRadius: 10, paddingVertical: 15, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }}>
      
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AdaptativeIcon name={leftIconName} color={theme.textSecondary} />
        <TextInput
          secureTextEntry={secureTextEntry}
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
    </View>
  )
}

export default LabeledTextField