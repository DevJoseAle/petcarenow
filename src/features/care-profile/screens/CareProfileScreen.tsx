import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import { useCareProfileScreen } from '../hooks/useCareProfileScreen';

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default function CareProfileScreen() {
  const theme = useTheme();
  const { activePet, goToEditPet, goToCalendar } =
    useCareProfileScreen();

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
          Perfil de cuidado
        </Text>

        {!activePet ? (
          <Text
            style={[
              styles.emptyText,
              { color: theme.textSecondary },
            ]}
          >
            No encontramos una mascota activa para
            editar.
          </Text>
        ) : (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <DetailRow
              label="Fecha de nacimiento"
              value={
                activePet.birth_date ??
                'No definida'
              }
            />
            <DetailRow
              label="Peso"
              value={
                activePet.weight_kg !== null
                  ? `${activePet.weight_kg} kg`
                  : 'No definido'
              }
            />
            <DetailRow
              label="Raza"
              value={
                activePet.breed ?? 'No definida'
              }
            />
            <DetailRow
              label="Alergias"
              value={
                activePet.allergies.join(', ') ||
                'Ninguna'
              }
            />
            <DetailRow
              label="Condiciones médicas"
              value={
                activePet.medical_conditions.join(', ') ||
                'Ninguna'
              }
            />
            <DetailRow
              label="Vacunas"
              value="Se gestionan desde el calendario y próximos cuidados."
            />
          </View>
        )}

        <PrimaryButton
          title="Editar perfil de cuidado"
          action={() => goToEditPet()}
          disabled={!activePet}
        />
        <PrimaryButton
          title="Ver vacunación en calendario"
          action={goToCalendar}
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
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  detailRow: {
    gap: 6,
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },
  detailValue: {
    color: '#111827',
    fontSize: 16,
    lineHeight: 22,
  },
});
