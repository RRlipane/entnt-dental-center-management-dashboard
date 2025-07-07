import { parseISO, format } from 'date-fns';


export const safeFormatDate = (
  iso?: string,
  fmt: string = 'dd MMM yyyy',
  fallback = 'N/A'
): string => {
  try {
    if (!iso) return fallback;
    return format(parseISO(iso), fmt);
  } catch {
    return fallback;
  }
};
