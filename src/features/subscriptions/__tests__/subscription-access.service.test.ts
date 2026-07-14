import {
  evaluateEventCreationAccess,
  evaluatePetCreationAccess,
  getPlanLimits,
} from '../services/subscription-access.service';

describe('subscription-access.service', () => {
  test('returns free plan limits', () => {
    expect(getPlanLimits('free')).toEqual({
      maxPets: 1,
      maxEvents: 4,
    });
  });

  test('allows unlimited usage for premium users', () => {
    expect(
      evaluatePetCreationAccess({
        accessTier: 'premium',
        usage: {
          totalPets: 12,
          activePets: 9,
          inactivePets: 3,
        },
      })
    ).toEqual({
      status: 'allowed',
      message: '',
    });

    expect(
      evaluateEventCreationAccess({
        accessTier: 'premium',
        usage: {
          totalEvents: 42,
        },
      })
    ).toEqual({
      status: 'allowed',
      message: '',
    });
  });

  test('blocks pet creation for free users after the first pet', () => {
    expect(
      evaluatePetCreationAccess({
        accessTier: 'free',
        usage: {
          totalPets: 1,
          activePets: 1,
          inactivePets: 0,
        },
      })
    ).toEqual({
      status: 'blocked_by_plan',
      message:
        'Tu plan gratuito permite registrar solo 1 mascota. Activa Premium para agregar otra.',
    });
  });

  test('explains that inactive pets still count toward the free limit', () => {
    expect(
      evaluatePetCreationAccess({
        accessTier: 'free',
        usage: {
          totalPets: 1,
          activePets: 0,
          inactivePets: 1,
        },
      })
    ).toEqual({
      status: 'blocked_by_plan',
      message:
        'Tu plan gratuito permite registrar solo 1 mascota. Incluso las mascotas inactivas cuentan para este límite. Activa Premium para agregar otra.',
    });
  });

  test('blocks event creation for free users after the fourth event', () => {
    expect(
      evaluateEventCreationAccess({
        accessTier: 'free',
        usage: {
          totalEvents: 4,
        },
      })
    ).toEqual({
      status: 'blocked_by_plan',
      message:
        'Tu plan gratuito permite hasta 4 eventos por usuario. Activa Premium para seguir agregando cuidados.',
    });
  });
});
