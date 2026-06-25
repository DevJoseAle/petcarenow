import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/core/theme/useTheme';

interface PetPhotoPickerCardProps {
  photoURL: string;
  onPress: () => void;
}

export default function PetPhotoPickerCard({
  photoURL,
  onPress,
}: PetPhotoPickerCardProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={[
          styles.photoButton,
          { borderColor: theme.border },
        ]}
      >
        {photoURL ? (
          <Image
            source={{ uri: photoURL }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <Ionicons
            name="camera-outline"
            size={30}
            color={theme.textSecondary}
          />
        )}
      </Pressable>
      <Text
        style={[
          styles.helperText,
          { color: theme.textSecondary },
        ]}
      >
        Toca para agregar foto
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 28,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#F8FAF8',
  },
  cameraEmoji: {
    fontSize: 28,
  },
  helperText: {
    marginTop: 14,
    fontSize: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
