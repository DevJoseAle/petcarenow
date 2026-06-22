import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "@/features/core/theme/colors";

export const useTheme = () => {
    const color = useColorScheme()
    return color === 'dark' ? darkTheme : lightTheme
}