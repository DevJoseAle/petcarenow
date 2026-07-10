export const formatHourInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  let result = '';

  for (const digit of digits) {
    const candidate = `${result}${digit}`;
    const normalized = candidate.replace(':', '');

    if (normalized.length === 1) {
      if (Number(normalized[0]) <= 2) {
        result = normalized;
      }
      continue;
    }

    if (normalized.length === 2) {
      const hours = Number(normalized);

      if (hours <= 23) {
        result = normalized;
      }
      continue;
    }

    if (normalized.length === 3) {
      const minuteTens = Number(normalized[2]);

      if (minuteTens <= 5) {
        result = `${normalized.slice(0, 2)}:${normalized[2]}`;
      }
      continue;
    }

    if (normalized.length === 4) {
      const hours = Number(normalized.slice(0, 2));
      const minutes = Number(normalized.slice(2, 4));

      if (hours <= 23 && minutes <= 59) {
        result = `${normalized.slice(0, 2)}:${normalized.slice(2, 4)}`;
      }
    }
  }

  return result;
};

export const isValidHourInput = (value: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

const padDatePart = (value: number) =>
  String(value).padStart(2, '0');

export const formatLocalDateInput = (date: Date) => {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
};

export const formatLocalTimeInput = (date: Date) => {
  return `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
};

export const parseDateInput = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return new Date();
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return new Date(year, month - 1, day);
};

export const buildIsoDateTime = (
  date: string,
  time: string
) => {
  const [year, month, day] = date
    .split('-')
    .map(Number);
  const [hours, minutes] = time
    .split(':')
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
    0
  ).toISOString();
};
