import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@/core/theme/useTheme';

interface PetSummaryRow {
  label: string;
  value: string;
}

interface PetSummaryCardProps {
  rows: PetSummaryRow[];
}

export default function PetSummaryCard({
  rows,
}: PetSummaryCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { borderColor: '#D8EFE5' },
      ]}
    >
      <Text
        style={[
          styles.heading,
          { color: theme.textSecondary },
        ]}
      >
        RESUMEN DEL PERFIL
      </Text>
      {rows.map((row) => (
        <View
          key={row.label}
          style={styles.row}
        >
          <Text
            style={[
              styles.label,
              { color: theme.textSecondary },
            ]}
          >
            {row.label}
          </Text>
          <Text
            style={[
              styles.value,
              { color: theme.textPrimary },
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 24,
    backgroundColor: '#F8FCFA',
  },
  heading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D8EFE5',
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
});
