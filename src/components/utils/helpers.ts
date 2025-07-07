// src/utils/helpers.ts
type DateFormatOptions = {
  locale?: string;
  includeTime?: boolean;
  timeFormat?: '12h' | '24h';
  showWeekday?: boolean;
};

export const formatDate = (
  date: string | Date | number,
  options: DateFormatOptions = {}
): string => {
  const d = new Date(date);
  const {
    locale = 'en-US',
    includeTime = false,
    timeFormat = '12h',
    showWeekday = false,
  } = options;

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(showWeekday && { weekday: 'short' }),
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      ...(timeFormat === '24h' && { hour12: false }),
    }),
  };

  return d.toLocaleDateString(locale, formatOptions);
};

type CurrencyFormatOptions = {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
};

export const formatCurrency = (
  value: number,
  options: CurrencyFormatOptions = {}
): string => {
  const {
    locale = 'en-IN',
    currency = 'INR',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    ...(compact && { notation: 'compact' }),
  };

  return new Intl.NumberFormat(locale, formatOptions).format(value);
};

export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
};

export const truncateText = (
  text: string,
  maxLength: number,
  ellipsis = '...'
): string => {
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}${ellipsis}`
    : text;
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '') 
    .replace(/--+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, ''); 
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};