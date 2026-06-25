import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import { useMoreScreen } from '../hooks/useMoreScreen';

export default function MoreScreen() {
  const theme = useTheme();
  const {
    items,
    handleLogout,
    isLoggingOut,
    logoutError,
  } = useMoreScreen();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            { color: theme.textPrimary },
          ]}
        >
          Más opciones
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={item.onPress}
              style={styles.row}
            >
              <Text
                style={[
                  styles.label,
                  { color: theme.textPrimary },
                ]}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        {logoutError ? (
          <Text style={styles.errorText}>
            {logoutError}
          </Text>
        ) : null}

        <PrimaryButton
          title={
            isLoggingOut
              ? 'Cerrando sesión...'
              : 'Cerrar sesión'
          }
          action={handleLogout}
          disabled={isLoggingOut}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});
