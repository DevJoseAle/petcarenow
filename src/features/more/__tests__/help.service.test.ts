import {
  getHelpContactOptions,
  getHelpFaqItems,
  getHelpLegalLinks,
} from '../services/help.service';

describe('help.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns local faq items', () => {
    expect(getHelpFaqItems()).toHaveLength(3);
    expect(
      getHelpFaqItems()[0].question
    ).toContain('suscripción premium');
  });

  test('returns contact and legal options', () => {
    expect(getHelpContactOptions()).toHaveLength(2);
    expect(getHelpLegalLinks()).toHaveLength(2);
    expect(
      getHelpContactOptions()[0].url
    ).toContain('mailto:');
    expect(getHelpLegalLinks()[0].url).toContain(
      'https://'
    );
  });
});
