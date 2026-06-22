// theme/appTheme.ts

export const lightTheme = {
  primary: '#4DB082',
  primarySoft: '#87D1AB',
  primaryPressed: '#2F7356',

  emergency: '#FF4D4F',
  emergencyBackground: '#FFF1F0',

  warning: '#FAAD14',
  warningBackground: '#FFF7E6',

  info: '#2F80ED',
  infoBackground: '#EAF3FF',

  gradient: [
    '#FFFFFF',
    '#F6FBF8',
    '#f0fdf5',
  ],


  background: '#FFFFFF',
  surface: '#F7F9F8',
  border: '#E5E7EB',

  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
};

export const darkTheme = {
  primary: '#5FC79A',
  primarySoft: '#9BE3C2',
  primaryPressed: '#7AD8AF',

  emergency: '#FF6B6B',
  emergencyBackground: '#3B1113',

  warning: '#FFC857',
  warningBackground: '#3A2A0A',

  info: '#6BA8FF',
  infoBackground: '#102A4C',
  
  gradient: [
    '#0F172A',
    '#16213E',
    '#1B2B4B',
  ],

  background: '#0F172A',
  surface: '#1E293B',
  border: '#334155',

  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
};

export type AppTheme = typeof lightTheme;