import * as ImagePicker from 'expo-image-picker';

interface MediaResult {
  success: boolean;
  uri: string | null;
  base64: string | null;
  mimeType: string | null;
  error?: string;
}

const noPermissionResult: MediaResult = {
  success: false,
  uri: null,
  base64: null,
  mimeType: null,
  error:
    'Necesitamos permisos para acceder a la cámara o a tus fotos.',
};

export const pickPetPhotoFromLibrary =
  async (): Promise<MediaResult> => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return noPermissionResult;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

    if (result.canceled) {
      return {
        success: false,
        uri: null,
        base64: null,
        mimeType: null,
      };
    }

    return {
      success: true,
      uri: result.assets[0]?.uri ?? null,
      base64: result.assets[0]?.base64 ?? null,
      mimeType:
        result.assets[0]?.mimeType ??
        'image/jpeg',
    };
  };

export const takePetPhoto = async (): Promise<MediaResult> => {
  const permission =
    await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    return noPermissionResult;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: true,
  });

  if (result.canceled) {
    return {
      success: false,
      uri: null,
      base64: null,
      mimeType: null,
    };
  }

  return {
    success: true,
    uri: result.assets[0]?.uri ?? null,
    base64: result.assets[0]?.base64 ?? null,
    mimeType:
      result.assets[0]?.mimeType ??
      'image/jpeg',
  };
};
