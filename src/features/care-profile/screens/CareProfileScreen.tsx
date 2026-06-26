import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import { useCareProfileScreen } from '../hooks/useCareProfileScreen';
import CareProfileHeaderCard from '../components/CareProfileHeaderCard';
import CareProfileSectionCard from '../components/CareProfileSectionCard';
import CareProfileEmptyBlock from '../components/CareProfileEmptyBlock';

export default function CareProfileScreen() {
  const theme = useTheme();
  const {
    activePet,
    profile,
    isLoading,
    isSharing,
    generalError,
    retry,
    goToEditPet,
    goToPets,
    handleShare,
  } = useCareProfileScreen();

  const subtitle = activePet?.breed
    ? `${activePet.breed} · ${
        activePet.birth_date ?? 'Fecha pendiente'
      }`
    : activePet?.birth_date ?? 'Perfil base pendiente';
  const weightLabel =
    activePet?.weight_kg !== null &&
    activePet?.weight_kg !== undefined
      ? `${activePet.weight_kg} kg`
      : 'Peso pendiente';

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

        {isLoading ? (
          <CareProfileSectionCard title="Cargando">
            <Text
              style={[
                styles.stateMessage,
                { color: theme.textSecondary },
              ]}
            >
              Cargando perfil de cuidado...
            </Text>
          </CareProfileSectionCard>
        ) : generalError ? (
          <CareProfileSectionCard title="Perfil de cuidado">
            <Text
              style={[
                styles.stateMessage,
                { color: '#DC2626' },
              ]}
            >
              {generalError}
            </Text>
            <PrimaryButton
              title="Reintentar"
              action={retry}
            />
          </CareProfileSectionCard>
        ) : !activePet ? (
          <CareProfileSectionCard title="Sin mascota activa">
            <CareProfileEmptyBlock message="No encontramos una mascota activa para mostrar su perfil de cuidado." />
            <PrimaryButton
              title="Ir a Mascotas"
              action={goToPets}
            />
          </CareProfileSectionCard>
        ) : (
          <>
            <CareProfileHeaderCard
              pet={activePet}
              subtitle={subtitle}
              weightLabel={weightLabel}
            />

            <CareProfileSectionCard title="Perfil base">
              <DetailRow
                label="Raza"
                value={activePet.breed ?? 'Sin registro'}
              />
              <DetailRow
                label="Fecha de nacimiento"
                value={
                  activePet.birth_date ??
                  'Sin registro'
                }
              />
              <DetailRow
                label="Peso"
                value={weightLabel}
              />
            </CareProfileSectionCard>

            <CareProfileSectionCard title="Datos clínicos">
              <DetailRow
                label="Alergias"
                value={
                  activePet.allergies.join(', ') ||
                  'Sin registros'
                }
              />
              <DetailRow
                label="Condiciones médicas"
                value={
                  activePet.medical_conditions.join(', ') ||
                  'Sin registros'
                }
              />
            </CareProfileSectionCard>

            <CareProfileSectionCard title="Vacunas">
              {profile?.vaccinations.length ? (
                profile.vaccinations.map((item) => (
                  <View
                    key={item.id}
                    style={styles.sectionItem}
                  >
                    <Text
                      style={[
                        styles.itemTitle,
                        {
                          color: theme.textPrimary,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.itemSubtitle,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      {item.subtitle}
                    </Text>
                    <Text
                      style={[
                        styles.itemMeta,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      Aplicada: {item.appliedAtLabel}
                    </Text>
                    {item.nextDueLabel ? (
                      <Text
                        style={[
                          styles.itemMeta,
                          {
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        Próxima dosis: {item.nextDueLabel}
                      </Text>
                    ) : null}
                  </View>
                ))
              ) : (
                <CareProfileEmptyBlock message="Esta mascota aún no tiene vacunas registradas." />
              )}
            </CareProfileSectionCard>

            <CareProfileSectionCard title="Última visita médica">
              {profile?.latestMedicalVisit ? (
                <View style={styles.sectionItem}>
                  <Text
                    style={[
                      styles.itemTitle,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {profile.latestMedicalVisit.title}
                  </Text>
                  <Text
                    style={[
                      styles.itemMeta,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    {profile.latestMedicalVisit.dateLabel}
                  </Text>
                  {profile.latestMedicalVisit.clinicName ? (
                    <Text
                      style={[
                        styles.itemSubtitle,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      {profile.latestMedicalVisit.clinicName}
                    </Text>
                  ) : null}
                  {profile.latestMedicalVisit.reason ? (
                    <Text
                      style={[
                        styles.itemSubtitle,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      {profile.latestMedicalVisit.reason}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <CareProfileEmptyBlock message="Todavía no hay una visita médica registrada para esta mascota." />
              )}
            </CareProfileSectionCard>
          </>
        )}

        <PrimaryButton
          title="Editar perfil base"
          action={goToEditPet}
          disabled={!activePet}
        />
        <PrimaryButton
          title={
            isSharing
              ? 'Preparando perfil...'
              : 'Compartir perfil'
          }
          action={handleShare}
          disabled={!activePet || isSharing}
        />
      </ScrollView>
    </Screen>
  );
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const theme = useTheme();

  return (
    <View style={styles.detailRow}>
      <Text
        style={[
          styles.detailLabel,
          { color: theme.textSecondary },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.detailValue,
          { color: theme.textPrimary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  detailRow: {
    gap: 6,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  detailValue: {
    fontSize: 16,
    lineHeight: 22,
  },
  sectionItem: {
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  itemMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  stateMessage: {
    fontSize: 15,
    lineHeight: 22,
  },
});
