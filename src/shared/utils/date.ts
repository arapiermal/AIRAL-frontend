import { formatISO, subHours, subDays } from 'date-fns';

export type DatePreset = '24h' | '72h' | '7d' | 'custom';

export const isoNow = () => formatISO(new Date());

export const toISO = (date: Date) => formatISO(date);

export const parseISODate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid ISO date: ${value}`);
  return date;
};

export const resolvePresetRange = (preset: DatePreset) => {
  const now = new Date();
  const from = preset === '24h' ? subHours(now, 24) : preset === '72h' ? subHours(now, 72) : subDays(now, 7);
  return { from: toISO(from), to: toISO(now) };
};
