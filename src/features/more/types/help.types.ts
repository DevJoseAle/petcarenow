export interface HelpFaqItem {
  id: string;
  question: string;
  answer: string;
}

export type HelpContactOptionType =
  | 'email'
  | 'web';

export interface HelpContactOption {
  id: string;
  type: HelpContactOptionType;
  label: string;
  description: string;
  url: string;
}

export type HelpLegalLinkType =
  | 'terms'
  | 'privacy';

export interface HelpLegalLink {
  id: string;
  type: HelpLegalLinkType;
  label: string;
  description: string;
  url: string;
}
