import type {
  ComponentProps,
  ReactNode,
} from 'react';
import { useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import { useVeterinaryProfileScreen } from '../hooks/useVeterinaryProfileScreen';
import type {
  VeterinaryHourBlock,
  VeterinaryRichProfile,
  VeterinaryServiceItem,
  VeterinaryStaffMember,
} from '../types/veterinary.types';

type SectionTabId =
  | 'summary'
  | 'services'
  | 'team'
  | 'hours'
  | 'contact';

type IoniconName =
  ComponentProps<typeof Ionicons>['name'];

interface SectionTab {
  id: SectionTabId;
  label: string;
}

const SECTION_TABS: SectionTab[] = [
  { id: 'summary', label: 'Resumen' },
  { id: 'services', label: 'Servicios' },
  { id: 'team', label: 'Equipo' },
  { id: 'hours', label: 'Horarios' },
  { id: 'contact', label: 'Contacto' },
];

const dayLabels = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const formatHourType = (
  value:
    | 'general'
    | 'emergency'
    | 'holiday'
    | 'closed_day'
    | 'home_visit'
) => {
  const mapping = {
    general: 'Horario general',
    emergency: 'Urgencias',
    holiday: 'Feriados',
    closed_day: 'Días cerrados',
    home_visit: 'Atención a domicilio',
  };

  return mapping[value];
};

const formatHourBlock = ({
  day_of_week,
  opens_at,
  closes_at,
  notes,
  is_24_hours,
  is_closed,
}: Pick<
  VeterinaryHourBlock,
  | 'day_of_week'
  | 'opens_at'
  | 'closes_at'
  | 'notes'
  | 'is_24_hours'
  | 'is_closed'
>) => {
  if (is_24_hours) {
    return 'Disponible 24 horas';
  }

  if (is_closed) {
    return notes ?? 'Cerrado';
  }

  const day =
    day_of_week !== null
      ? dayLabels[day_of_week]
      : null;

  const range =
    opens_at && closes_at
      ? `${opens_at.slice(0, 5)} - ${closes_at.slice(0, 5)}`
      : notes ?? 'Horario por confirmar';

  return day ? `${day} • ${range}` : range;
};

const formatPrice = (
  service: VeterinaryServiceItem
) => {
  if (!service.price_amount) {
    return 'Precio a consultar';
  }

  return `Desde ${service.price_amount} ${service.currency ?? 'CLP'}`;
};

const buildInfoTags = (
  profile: VeterinaryRichProfile
) => {
  const veterinary = profile.veterinary;

  return [
    veterinary.years_experience
      ? `${veterinary.years_experience} años de experiencia`
      : null,
    veterinary.languages?.length
      ? veterinary.languages.join(', ')
      : null,
    veterinary.parking_available
      ? 'Estacionamiento'
      : null,
    veterinary.accessibility_features
      ? 'Accesible'
      : null,
    veterinary.offers_home_visit
      ? 'Atención a domicilio'
      : null,
  ].filter(Boolean) as string[];
};

export default function VeterinaryProfileScreen() {
  const theme = useTheme();
  const {
    profile,
    veterinary,
    isHydrating,
    generalError,
    saveError,
    isSaving,
    isSaved,
    servicesByCategory,
    socialLinks,
    goBack,
    retry,
    toggleSaved,
    openMaps,
    callVeterinary,
    openWhatsApp,
    sendEmail,
    openExternalLink,
  } = useVeterinaryProfileScreen();
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionOffsetsRef = useRef<
    Record<SectionTabId, number>
  >({
    summary: 0,
    services: 0,
    team: 0,
    hours: 0,
    contact: 0,
  });
  const [activeTab, setActiveTab] =
    useState<SectionTabId>('summary');

  const featuredServices = useMemo(
    () =>
      profile?.services
        .filter((service) => service.is_available)
        .slice(0, 8) ?? [],
    [profile]
  );

  const activeStaff = useMemo(
    () =>
      profile?.staff.filter(
        (member) => member.is_active
      ) ?? [],
    [profile]
  );

  const infoTags = useMemo(
    () =>
      profile ? buildInfoTags(profile) : [],
    [profile]
  );

  const scrollToSection = (
    sectionId: SectionTabId
  ) => {
    setActiveTab(sectionId);
    scrollRef.current?.scrollTo({
      y: Math.max(
        sectionOffsetsRef.current[sectionId] - 78,
        0
      ),
      animated: true,
    });
  };

  const handleScroll = (offsetY: number) => {
    const targetY = offsetY + 110;
    const current = [...SECTION_TABS]
      .reverse()
      .find(
        (item) =>
          targetY >=
          sectionOffsetsRef.current[item.id]
      );

    if (current && current.id !== activeTab) {
      setActiveTab(current.id);
    }
  };

  return (
    <Screen horizontalPadding={0}>
      {isHydrating ? (
        <SectionState
          type="loading"
          message="Cargando veterinaria..."
        />
      ) : generalError ? (
        <SectionState
          type="error"
          message={generalError}
          onRetry={retry}
        />
      ) : veterinary && profile ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[2]}
          scrollEventThrottle={16}
          onScroll={(event) =>
            handleScroll(
              event.nativeEvent.contentOffset.y
            )
          }
        >
          <View style={styles.heroCard}>
            {veterinary.cover_url ||
            veterinary.photo_url ? (
              <Image
                source={{
                  uri:
                    veterinary.cover_url ??
                    veterinary.photo_url ??
                    undefined,
                }}
                style={styles.coverImage}
                contentFit="cover"
              />
            ) : (
              <View
                style={[
                  styles.coverImage,
                  styles.coverFallback,
                  {
                    backgroundColor:
                      theme.infoBackground,
                  },
                ]}
              >
                <Ionicons
                  name="medkit-outline"
                  size={48}
                  color={theme.info}
                />
              </View>
            )}

            <View style={styles.heroTopBar}>
              <CircleIconButton
                icon="chevron-back"
                onPress={goBack}
              />

              <CircleIconButton
                icon={
                  isSaved ? 'heart' : 'heart-outline'
                }
                onPress={() => toggleSaved()}
                disabled={isSaving}
                color={
                  isSaved
                    ? theme.emergency
                    : theme.textPrimary
                }
              />
            </View>

            <View
              style={[
                styles.heroBody,
                {
                  backgroundColor:
                    theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.floatingLogoCard,
                  {
                    backgroundColor:
                      theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                {veterinary.logo_url ||
                veterinary.photo_url ? (
                  <Image
                    source={{
                      uri:
                        veterinary.logo_url ??
                        veterinary.photo_url ??
                        undefined,
                    }}
                    style={styles.floatingLogo}
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.floatingLogo,
                      styles.logoFallback,
                      {
                        backgroundColor:
                          theme.infoBackground,
                      },
                    ]}
                  >
                    <Ionicons
                      name="paw-outline"
                      size={28}
                      color={theme.info}
                    />
                  </View>
                )}
              </View>

              <View style={styles.brandRow}>
                <View style={styles.brandCopy}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: theme.textPrimary,
                      },
                    ]}
                  >
                    {veterinary.name}
                  </Text>
                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Clínica veterinaria
                  </Text>
                  <View
                    style={styles.metaRow}
                  >
                    {veterinary.is_emergency ? (
                      <Text
                        style={[
                          styles.metaAccent,
                          {
                            color:
                              theme.emergency,
                          },
                        ]}
                      >
                        Urgencias
                      </Text>
                    ) : null}
                    <Text
                      style={[
                        styles.metaDot,
                        {
                          color:
                            theme.textSecondary,
                        },
                      ]}
                    >
                      •
                    </Text>
                    <Text
                      style={[
                        styles.metaText,
                        {
                          color:
                            theme.primaryPressed,
                        },
                      ]}
                    >
                      {veterinary.is_24_7
                        ? 'Disponible 24/7'
                        : 'Horario normal'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <ActionPill
                  icon="call-outline"
                  label="Llamar"
                  onPress={() =>
                    callVeterinary()
                  }
                />
                <ActionPill
                  icon="logo-whatsapp"
                  label="WhatsApp"
                  onPress={() =>
                    openWhatsApp()
                  }
                  disabled={
                    !veterinary.whatsapp_phone
                  }
                />
                <ActionPill
                  icon="location-outline"
                  label="Cómo llegar"
                  onPress={() => openMaps()}
                />
                <ActionPill
                  icon="globe-outline"
                  label="Sitio web"
                  onPress={() =>
                    veterinary.website_url
                      ? openExternalLink(
                          veterinary.website_url
                        )
                      : undefined
                  }
                  disabled={
                    !veterinary.website_url
                  }
                />
              </View>
            </View>
          </View>

          <View style={styles.summaryBlock}>
            {saveError ? (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: theme.emergency,
                  },
                ]}
              >
                {saveError}
              </Text>
            ) : null}

            <Text
              style={[
                styles.aboutTitle,
                { color: theme.textPrimary },
              ]}
            >
              Sobre nosotros
            </Text>
            <Text
              style={[
                styles.aboutText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              {veterinary.description ??
                'Esta clínica aún no tiene descripción cargada.'}
            </Text>

            {infoTags.length ? (
              <View style={styles.infoTags}>
                {infoTags.map((tag) => (
                  <InfoTag
                    key={tag}
                    label={tag}
                  />
                ))}
              </View>
            ) : null}
          </View>

          <View
            style={[
              styles.stickyTabsShell,
              {
                backgroundColor: theme.surface,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.tabsRow
              }
            >
              {SECTION_TABS.map((tab) => (
                <Pressable
                  key={tab.id}
                  onPress={() =>
                    scrollToSection(tab.id)
                  }
                  style={[
                    styles.tabChip,
                    {
                      backgroundColor:
                        activeTab === tab.id
                          ? theme.primary
                          : theme.background,
                      borderColor:
                        activeTab === tab.id
                          ? theme.primary
                          : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabChipLabel,
                      {
                        color:
                          activeTab === tab.id
                            ? '#FFFFFF'
                            : theme.textPrimary,
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <SectionCard
            title="Resumen"
            onLayout={(event) => {
              sectionOffsetsRef.current.summary =
                event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.grid}>
              <InfoRow
                icon="medkit-outline"
                label="Urgencias"
                value={
                  veterinary.is_emergency
                    ? 'Disponibles'
                    : 'No informadas'
                }
              />
              <InfoRow
                icon="time-outline"
                label="Horario"
                value={
                  veterinary.is_24_7
                    ? '24 horas'
                    : 'Horario normal'
                }
              />
              <InfoRow
                icon="car-outline"
                label="Estacionamiento"
                value={
                  veterinary.parking_available
                    ? 'Disponible'
                    : 'No informado'
                }
              />
              <InfoRow
                icon="walk-outline"
                label="Accesibilidad"
                value={
                  veterinary.accessibility_features ??
                  'No informada'
                }
              />
              <InfoRow
                icon="home-outline"
                label="Domicilio"
                value={
                  veterinary.offers_home_visit
                    ? veterinary.home_visit_notes ??
                      'Disponible'
                    : 'No disponible'
                }
              />
              <InfoRow
                icon="card-outline"
                label="Pagos"
                value={
                  veterinary.payment_methods
                    ?.join(', ') ??
                  'No informados'
                }
              />
            </View>

            {veterinary.mission ? (
              <DetailBlock
                title="Misión"
                text={veterinary.mission}
              />
            ) : null}

            {veterinary.values ? (
              <DetailBlock
                title="Valores"
                text={veterinary.values}
              />
            ) : null}
          </SectionCard>

          <SectionCard
            title="Servicios"
            onLayout={(event) => {
              sectionOffsetsRef.current.services =
                event.nativeEvent.layout.y;
            }}
          >
            {featuredServices.length ? (
              <HorizontalCarousel>
                {featuredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                  />
                ))}
              </HorizontalCarousel>
            ) : (
              <EmptyLine text="Esta clínica aún no tiene servicios destacados cargados." />
            )}

            {servicesByCategory.length ? (
              <>
                <Text
                  style={[
                    styles.subsectionTitle,
                    {
                      color:
                        theme.textPrimary,
                    },
                  ]}
                >
                  Categorías de servicios
                </Text>
                <View
                  style={styles.categoryList}
                >
                  {servicesByCategory.map(
                    ({ category }) => (
                      <InfoTag
                        key={category.code}
                        label={category.label}
                      />
                    )
                  )}
                </View>
              </>
            ) : null}
          </SectionCard>

          <SectionCard
            title="Equipo"
            onLayout={(event) => {
              sectionOffsetsRef.current.team =
                event.nativeEvent.layout.y;
            }}
          >
            {activeStaff.length ? (
              <HorizontalCarousel>
                {activeStaff.map((member) => (
                  <TeamCard
                    key={member.id}
                    member={member}
                  />
                ))}
              </HorizontalCarousel>
            ) : (
              <EmptyLine text="Esta clínica aún no tiene equipo médico cargado." />
            )}
          </SectionCard>

          <SectionCard
            title="Horarios"
            onLayout={(event) => {
              sectionOffsetsRef.current.hours =
                event.nativeEvent.layout.y;
            }}
          >
            {profile.hours.length ? (
              profile.hours.map((hour) => (
                <View
                  key={hour.id}
                  style={[
                    styles.scheduleCard,
                    {
                      borderColor:
                        theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.scheduleTitle,
                      {
                        color:
                          theme.textPrimary,
                      },
                    ]}
                  >
                    {formatHourType(
                      hour.hour_type
                    )}
                  </Text>
                  <Text
                    style={[
                      styles.scheduleText,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    {formatHourBlock(hour)}
                  </Text>
                </View>
              ))
            ) : (
              <EmptyLine text="No hay horarios estructurados disponibles." />
            )}
          </SectionCard>

          <SectionCard
            title="Contacto"
            onLayout={(event) => {
              sectionOffsetsRef.current.contact =
                event.nativeEvent.layout.y;
            }}
          >
            <ContactLine
              icon="location-outline"
              label="Dirección"
              value={`${veterinary.address}, ${veterinary.city}`}
              onPress={() => openMaps()}
            />
            <ContactLine
              icon="call-outline"
              label="Teléfono"
              value={
                veterinary.phone ??
                'No disponible'
              }
              onPress={() =>
                callVeterinary()
              }
              disabled={!veterinary.phone}
            />
            <ContactLine
              icon="mail-outline"
              label="Correo"
              value={
                veterinary.email ??
                'No disponible'
              }
              onPress={() => sendEmail()}
              disabled={!veterinary.email}
            />

            {socialLinks.length ? (
              <>
                <Text
                  style={[
                    styles.subsectionTitle,
                    {
                      color:
                        theme.textPrimary,
                    },
                  ]}
                >
                  Redes y enlaces
                </Text>
                <View
                  style={styles.socialRow}
                >
                  {socialLinks.map((item) => (
                    <ActionPill
                      key={item.id}
                      icon={getSocialIcon(
                        item.id
                      )}
                      label={item.label}
                      onPress={() =>
                        item.url
                          ? openExternalLink(
                              item.url
                            )
                          : undefined
                      }
                    />
                  ))}
                </View>
              </>
            ) : null}
          </SectionCard>
        </ScrollView>
      ) : null}
    </Screen>
  );
}

const CircleIconButton = ({
  icon,
  onPress,
  disabled = false,
  color,
}: {
  icon: IoniconName;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.circleButton,
        {
          backgroundColor: theme.background,
          opacity: disabled ? 0.55 : 1,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={color ?? theme.textPrimary}
      />
    </Pressable>
  );
};

const ActionPill = ({
  icon,
  label,
  onPress,
  disabled = false,
}: {
  icon: IoniconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.actionPill,
        {
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.actionPillIcon,
          {
            backgroundColor:
              theme.infoBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={theme.primaryPressed}
        />
      </View>
      <Text
        style={[
          styles.actionPillLabel,
          {
            color: theme.textPrimary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const SectionCard = ({
  title,
  children,
  onLayout,
}: {
  title: string;
  children: ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
}) => {
  const theme = useTheme();

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.textPrimary },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
};

const HorizontalCarousel = ({
  children,
}: {
  children: ReactNode;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.carousel}
  >
    {children}
  </ScrollView>
);

const ServiceCard = ({
  service,
}: {
  service: VeterinaryServiceItem;
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.serviceCard,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.serviceIconWrap,
          {
            backgroundColor:
              theme.infoBackground,
          },
        ]}
      >
        <Ionicons
          name="medkit-outline"
          size={20}
          color={theme.info}
        />
      </View>
      <Text
        style={[
          styles.serviceTitle,
          {
            color: theme.textPrimary,
          },
        ]}
      >
        {service.name}
      </Text>
      <Text
        style={[
          styles.serviceDescription,
          {
            color: theme.textSecondary,
          },
        ]}
        numberOfLines={3}
      >
        {service.description ??
          'Servicio disponible en la clínica.'}
      </Text>
      <Text
        style={[
          styles.serviceMeta,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        {service.duration_minutes
          ? `${service.duration_minutes} min`
          : 'Duración no informada'}
      </Text>
      <Text
        style={[
          styles.servicePrice,
          {
            color: theme.primaryPressed,
          },
        ]}
      >
        {formatPrice(service)}
      </Text>
    </View>
  );
};

const TeamCard = ({
  member,
}: {
  member: VeterinaryStaffMember;
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.teamCard,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      {member.photo_url ? (
        <Image
          source={{ uri: member.photo_url }}
          style={styles.teamPhoto}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.teamPhoto,
            styles.teamPhotoFallback,
            {
              backgroundColor:
                theme.infoBackground,
            },
          ]}
        >
          <Ionicons
            name="person-outline"
            size={28}
            color={theme.info}
          />
        </View>
      )}
      <Text
        style={[
          styles.teamName,
          {
            color: theme.textPrimary,
          },
        ]}
      >
        {member.full_name}
      </Text>
      <Text
        style={[
          styles.teamRole,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        {member.specialty ??
          'Especialidad no informada'}
      </Text>
      <Text
        style={[
          styles.teamMeta,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        {member.years_experience
          ? `${member.years_experience} años exp.`
          : 'Experiencia no informada'}
      </Text>
    </View>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: IoniconName;
  label: string;
  value: string;
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.infoRow,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor:
              theme.infoBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={theme.primaryPressed}
        />
      </View>
      <View style={styles.infoCopy}>
        <Text
          style={[
            styles.infoLabel,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.infoValue,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const ContactLine = ({
  icon,
  label,
  value,
  onPress,
  disabled = false,
}: {
  icon: IoniconName;
  label: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.contactLine,
        {
          borderColor: theme.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.contactIcon,
          {
            backgroundColor:
              theme.infoBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={theme.primaryPressed}
        />
      </View>
      <View style={styles.contactCopy}>
        <Text
          style={[
            styles.contactLabel,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.contactValue,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          {value}
        </Text>
      </View>
      {!disabled ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.textSecondary}
        />
      ) : null}
    </Pressable>
  );
};

const DetailBlock = ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => {
  const theme = useTheme();

  return (
    <View style={styles.detailBlock}>
      <Text
        style={[
          styles.detailTitle,
          { color: theme.textPrimary },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.detailText,
          { color: theme.textSecondary },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const InfoTag = ({
  label,
}: {
  label: string;
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.infoTag,
        {
          backgroundColor:
            theme.infoBackground,
        },
      ]}
    >
      <Text
        style={[
          styles.infoTagText,
          {
            color: theme.primaryPressed,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const EmptyLine = ({
  text,
}: {
  text: string;
}) => {
  const theme = useTheme();

  return (
    <Text
      style={[
        styles.emptyText,
        { color: theme.textSecondary },
      ]}
    >
      {text}
    </Text>
  );
};

const getSocialIcon = (id: string) => {
  switch (id) {
    case 'instagram':
      return 'logo-instagram';
    case 'facebook':
      return 'logo-facebook';
    case 'tiktok':
      return 'logo-tiktok';
    default:
      return 'globe-outline';
  }
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 36,
  },
  heroCard: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  coverImage: {
    width: '100%',
    height: 250,
    borderRadius: 28,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTopBar: {
    position: 'absolute',
    top: 22,
    left: 28,
    right: 28,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },
  heroBody: {
    marginTop: -30,
    marginHorizontal: 8,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 88,
    paddingBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 3,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  floatingLogoCard: {
    position: 'absolute',
    top: -34,
    left: 18,
    width: 118,
    height: 118,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },
  floatingLogo: {
    width: 82,
    height: 82,
    borderRadius: 18,
  },
  logoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaAccent: {
    fontSize: 12,
    fontWeight: '800',
  },
  metaDot: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  actionPill: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  actionPillLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionPillIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBlock: {
    paddingHorizontal: 22,
    paddingTop: 18,
    gap: 10,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stickyTabsShell: {
    marginTop: 18,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  tabsRow: {
    paddingHorizontal: 14,
    gap: 8,
  },
  tabChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  tabChipLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    marginTop: 14,
    marginHorizontal: 14,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 14,
  },
  grid: {
    gap: 12,
  },
  infoRow: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCopy: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  detailBlock: {
    marginTop: 18,
    gap: 8,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  detailText: {
    fontSize: 15,
    lineHeight: 23,
  },
  carousel: {
    gap: 12,
    paddingRight: 4,
  },
  serviceCard: {
    width: 168,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 8,
  },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  serviceDescription: {
    fontSize: 13,
    lineHeight: 19,
    minHeight: 54,
  },
  serviceMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  subsectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '800',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  teamCard: {
    width: 156,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  teamPhoto: {
    width: '100%',
    height: 132,
  },
  teamPhotoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  teamRole: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  teamMeta: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  scheduleCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 6,
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  scheduleText: {
    fontSize: 14,
    lineHeight: 21,
  },
  contactLine: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCopy: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoTag: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  infoTagText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
