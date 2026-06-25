const isDev = __DEV__;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function formatMessage(level: LogLevel, label: string): string {
  const prefix = `[${level.toUpperCase()}]`;
  return `${prefix} ${label}`;
}

const logger = {
  debug: (label: string, data?: unknown) => {
    if (isDev) {
      console.debug(formatMessage('debug', label), data ?? '');
    }
  },

  info: (label: string, data?: unknown) => {
    if (isDev) {
      console.info(formatMessage('info', label), data ?? '');
    }
  },

  warn: (label: string, data?: unknown) => {
    if (isDev) {
      console.warn(formatMessage('warn', label), data ?? '');
    }
  },

  error: (label: string, data?: unknown) => {
    if (isDev) {
      console.error(formatMessage('error', label), data ?? '');
    }
  },
};

export { logger };
export type { LogLevel };
