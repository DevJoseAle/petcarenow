import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import type { NotificationSettingKey } from '../types/notification.types';
import { useNotificationsScreen } from '../hooks/useNotificationsScreen';

const settingRows: Array<{
  key: NotificationSettingKey;
  title: string;
  description: string;
}> = [
  {
    key: 'upcoming_care_enabled',
    title: 'Próximos cuidados',
    description:
      'Recordatorios para consultas, desparasitaciones y cuidados programados.',
  },
  {
    key: 'medications_enabled',
    title: 'Medicaciones y tratamientos',
    description:
      'Avisos para medicaciones y tratamientos pendientes.',
  },
  {
    key: 'vaccines_enabled',
    title: 'Vacunas y controles',
    description:
      'Recordatorios para vacunas y seguimientos clínicos.',
  },
  {
    key: 'important_alerts_enabled',
    title: 'Alertas importantes',
    description:
      'Avisos destacados para eventos relevantes del cuidado de tu mascota.',
  },
  {
    key: 'daily_summary_enabled',
    title: 'Resumen diario',
    description:
      'Un recordatorio diario para revisar el estado general de tu mascota en la app.',
  },
];

export default function NotificationsScreen() {
  const theme = useTheme();
  const {
    permission,
    settings,
    device,
    syncResult,
    isHydrating,
    isUpdating,
    hasLoadError,
    generalError,
    successMessage,
    retry,
    goBack,
    handleRequestPermission,
    handleToggleSetting,
    refreshRegistration,
    openDeviceSettings,
  } = useNotificationsScreen();

  const permissionLabel = permission.granted
    ? 'Permitidas'
    : permission.status === 'denied'
    ? 'Denegadas'
    : 'Sin configurar';
  const deviceStatus = device
    ? 'Registrado'
    : permission.granted
    ? 'Pendiente'
    : 'Inactivo';

  return (
    <Screen scroll>
      <View style={styles.content}>
        <Pressable
          onPress={goBack}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={theme.textPrimary}
          />
          <Text
            style={[
              styles.backLabel,
              { color: theme.textPrimary },
            ]}
          >
            Volver
          </Text>
        </Pressable>

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary },
            ]}
          >
            Notificaciones
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Controla permisos, dispositivo y recordatorios clave para el cuidado de tu mascota.
          </Text>
        </View>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando notificaciones..."
          />
        ) : hasLoadError || !settings ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : (
          <>
            <SectionCard title="Estado de permisos">
              <StatusRow
                label="Permiso actual"
                value={permissionLabel}
                tone={
                  permission.granted
                    ? 'positive'
                    : permission.status === 'denied'
                    ? 'negative'
                    : 'neutral'
                }
              />
              <Text
                style={[
                  styles.helperText,
                  { color: theme.textSecondary },
                ]}
              >
                {permission.granted
                  ? 'La app puede programar recordatorios y registrar este dispositivo.'
                  : permission.status === 'denied'
                  ? 'Debes habilitarlas nuevamente desde los ajustes del dispositivo o volver a solicitarlas si aún se permite.'
                  : 'Actívalas para recibir recordatorios y avisos importantes del cuidado de tu mascota.'}
              </Text>

              <View style={styles.actionRow}>
                <InlineAction
                  title="Solicitar permiso"
                  onPress={handleRequestPermission}
                  disabled={
                    isUpdating ||
                    permission.granted
                  }
                />
                <InlineAction
                  title="Abrir ajustes"
                  onPress={openDeviceSettings}
                  disabled={isUpdating}
                  secondary
                />
              </View>
            </SectionCard>

            <SectionCard title="Estado del dispositivo">
              <StatusRow
                label="Registro actual"
                value={deviceStatus}
                tone={
                  device
                    ? 'positive'
                    : permission.granted
                    ? 'warning'
                    : 'neutral'
                }
              />
              <Text
                style={[
                  styles.helperText,
                  { color: theme.textSecondary },
                ]}
              >
                {device
                  ? `Token activo: ${device.expo_push_token.slice(0, 18)}...`
                  : 'Aún no hay un token push registrado para este dispositivo.'}
              </Text>
              <Text
                style={[
                  styles.helperText,
                  { color: theme.textSecondary },
                ]}
              >
                {device?.device_name
                  ? `Dispositivo: ${device.device_name}`
                  : 'Nombre del dispositivo no disponible.'}
              </Text>

              <InlineAction
                title="Registrar dispositivo"
                onPress={refreshRegistration}
                disabled={
                  isUpdating ||
                  !permission.granted
                }
              />
            </SectionCard>

            <SectionCard title="Recordatorios y avisos">
              {settingRows.map((item) => (
                <View
                  key={item.key}
                  style={[
                    styles.settingRow,
                    {
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.settingText}>
                    <Text
                      style={[
                        styles.settingTitle,
                        {
                          color:
                            theme.textPrimary,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.settingDescription,
                        {
                          color:
                            theme.textSecondary,
                        },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                  <Switch
                    value={settings[item.key]}
                    onValueChange={() =>
                      handleToggleSetting(
                        item.key
                      )
                    }
                    disabled={
                      isUpdating ||
                      !permission.granted
                    }
                    trackColor={{
                      false: '#D1D5DB',
                      true: theme.primarySoft,
                    }}
                    thumbColor={
                      settings[item.key]
                        ? theme.primary
                        : '#F9FAFB'
                    }
                  />
                </View>
              ))}
            </SectionCard>

            <SectionCard title="Sincronización actual">
              <Text
                style={[
                  styles.helperText,
                  { color: theme.textSecondary },
                ]}
              >
                {syncResult
                  ? `Recordatorios programados: ${syncResult.scheduledCount}. Omitidos: ${syncResult.skippedCount}.`
                  : 'Cuando actives permisos y preferencias, la app sincronizará los próximos recordatorios locales.'}
              </Text>
            </SectionCard>

            {successMessage ? (
              <Text
                style={[
                  styles.successText,
                  {
                    color:
                      theme.primaryPressed,
                  },
                ]}
              >
                {successMessage}
              </Text>
            ) : null}

            {generalError ? (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: theme.emergency,
                  },
                ]}
              >
                {generalError}
              </Text>
            ) : null}
          </>
        )}
      </View>
    </Screen>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.textPrimary },
        ]}
      >
        {title}
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
        {children}
      </View>
    </View>
  );
}

function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'positive' | 'negative' | 'warning' | 'neutral';
}) {
  const theme = useTheme();
  const toneColor =
    tone === 'positive'
      ? theme.primaryPressed
      : tone === 'negative'
      ? theme.emergency
      : tone === 'warning'
      ? theme.warning
      : theme.textSecondary;

  return (
    <View style={styles.statusRow}>
      <Text
        style={[
          styles.statusLabel,
          { color: theme.textPrimary },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.statusValue,
          { color: toneColor },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function InlineAction({
  title,
  onPress,
  disabled,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  disabled: boolean;
  secondary?: boolean;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.inlineAction,
        {
          borderColor: secondary
            ? theme.border
            : theme.primary,
          backgroundColor: secondary
            ? theme.background
            : theme.infoBackground,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.inlineActionText,
          {
            color: secondary
              ? theme.textPrimary
              : theme.primaryPressed,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  inlineAction: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inlineActionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingRow: {
    borderBottomWidth: 1,
    paddingBottom: 14,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    flex: 1,
    gap: 6,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
