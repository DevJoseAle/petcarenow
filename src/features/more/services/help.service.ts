import { Linking } from 'react-native';
import type {
  HelpContactOption,
  HelpFaqItem,
  HelpLegalLink,
  HelpLegalLinkType,
} from '../types/help.types';

const helpFaqItems: HelpFaqItem[] = [
  {
    id: 'premium-sync',
    question:
      '¿Cómo verifico si mi suscripción premium está activa?',
    answer:
      'En la pantalla Suscripción / Premium puedes revisar tu estado actual y el modo de RevenueCat que está usando la app.',
  },
  {
    id: 'notifications',
    question:
      '¿Qué hago si no recibo recordatorios?',
    answer:
      'Revisa la pantalla de Notificaciones, confirma permisos activos y vuelve a sincronizar tus recordatorios desde la app.',
  },
  {
    id: 'pets-limit',
    question:
      '¿Por qué no puedo agregar más mascotas o eventos?',
    answer:
      'El plan gratuito tiene límites de uso. Si alcanzaste el máximo disponible, puedes revisar Premium para ampliar el acceso.',
  },
];

const helpContactOptions: HelpContactOption[] = [
  {
    id: 'support-email',
    type: 'email',
    label: 'Escríbenos por email',
    description:
      'Abre tu app de correo y cuéntanos qué necesitas resolver.',
    url: 'mailto:soporte@petcarenow.app',
  },
  {
    id: 'support-web',
    type: 'web',
    label: 'Centro de soporte web',
    description:
      'Abre nuestro sitio para futuras guías y soporte ampliado.',
    url: 'https://petcarenow.app/support',
  },
];

const helpLegalLinks: HelpLegalLink[] = [
  {
    id: 'terms',
    type: 'terms',
    label: 'Términos de uso',
    description:
      'Consulta las reglas básicas de uso de PetCareNow.',
    url: 'https://petcarenow.app/terms',
  },
  {
    id: 'privacy',
    type: 'privacy',
    label: 'Política de privacidad',
    description:
      'Revisa cómo protegemos y utilizamos tus datos.',
    url: 'https://petcarenow.app/privacy',
  },
];

const getOpenErrorMessage = (
  label: string
) =>
  `No pudimos abrir ${label.toLowerCase()} en este dispositivo.`;

const openExternalResource = async (
  url: string,
  label: string
) => {
  const supported =
    await Linking.canOpenURL(url);

  if (!supported) {
    throw new Error(
      getOpenErrorMessage(label)
    );
  }

  await Linking.openURL(url);
};

export const getHelpFaqItems = () =>
  helpFaqItems;

export const getHelpContactOptions = () =>
  helpContactOptions;

export const getHelpLegalLinks = () =>
  helpLegalLinks;

export const openHelpContactOption = async (
  option: HelpContactOption
) => {
  await openExternalResource(
    option.url,
    option.label
  );
};

export const openHelpLegalLink = async (
  type: HelpLegalLinkType
) => {
  const link = helpLegalLinks.find(
    (item) => item.type === type
  );

  if (!link) {
    throw new Error(
      'No encontramos el recurso legal solicitado.'
    );
  }

  await openExternalResource(link.url, link.label);
};
