import { Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import { useHomeScreen } from '../hooks/useHomeScreen';

export default function HomeScreen() {
  const theme = useTheme();
  const {
    userEmail,
    isLoggingOut,
    logoutError,
    handleLogout,
  } = useHomeScreen();

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: theme.textPrimary,
          }}
        >
          HomeScreen
        </Text>
        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            color: theme.textSecondary,
          }}
        >
          {userEmail
            ? `Sesión iniciada como ${userEmail}`
            : 'Sesión iniciada'}
        </Text>
        {logoutError ? (
          <Text
            style={{
              marginTop: 16,
              fontSize: 14,
              color: '#DC2626',
            }}
          >
            {logoutError}
          </Text>
        ) : null}
        <PrimaryButton
          title={
            isLoggingOut
              ? 'Cerrando sesión...'
              : 'Cerrar Sesión'
          }
          action={handleLogout}
          disabled={isLoggingOut}
        />
      </View>
    </Screen>
  );
}
