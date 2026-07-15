import type { CareEventUsageSummary } from '@/features/calendar/types/care-event.types';
import type { PetUsageSummary } from '@/features/pets/types/pet.types';
import type {
  SubscriptionAccess,
  SubscriptionAccessDecision,
  SubscriptionPlanLimits,
} from '../types/subscription.types';

const FREE_PLAN_LIMITS: SubscriptionPlanLimits = {
  maxPets: 1,
  maxEvents: 4,
};

const PREMIUM_PLAN_LIMITS: SubscriptionPlanLimits = {
  maxPets: null,
  maxEvents: null,
};

export const getPlanLimits = (
  accessTier: SubscriptionAccess
): SubscriptionPlanLimits =>
  accessTier === 'premium'
    ? PREMIUM_PLAN_LIMITS
    : FREE_PLAN_LIMITS;

export const evaluatePetCreationAccess = ({
  accessTier,
  usage,
}: {
  accessTier: SubscriptionAccess;
  usage: PetUsageSummary;
}): SubscriptionAccessDecision => {
  const limits = getPlanLimits(accessTier);

  if (limits.maxPets === null) {
    return {
      status: 'allowed',
      message: '',
    };
  }

  if (usage.totalPets < limits.maxPets) {
    return {
      status: 'allowed',
      message: '',
    };
  }

  if (usage.inactivePets > 0) {
    return {
      status: 'blocked_by_plan',
      message:
        'Tu plan gratuito permite registrar solo 1 mascota. Incluso las mascotas inactivas cuentan para este límite. Activa Premium para agregar otra.',
    };
  }

  return {
    status: 'blocked_by_plan',
    message:
      'Tu plan gratuito permite registrar solo 1 mascota. Activa Premium para agregar otra.',
  };
};

export const evaluateEventCreationAccess = ({
  accessTier,
  usage,
}: {
  accessTier: SubscriptionAccess;
  usage: CareEventUsageSummary;
}): SubscriptionAccessDecision => {
  const limits = getPlanLimits(accessTier);

  if (limits.maxEvents === null) {
    return {
      status: 'allowed',
      message: '',
    };
  }

  if (usage.totalEvents < limits.maxEvents) {
    return {
      status: 'allowed',
      message: '',
    };
  }

  return {
    status: 'blocked_by_plan',
    message:
      'Tu plan gratuito permite hasta 4 eventos por usuario. Activa Premium para seguir agregando cuidados.',
  };
};
