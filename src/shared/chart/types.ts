export type ChartSeries = {
  name: string;
  data: Array<[string, number | null]>;
  type?: 'line';
  color?: string;
  areaBand?: { lower: Array<[string, number]>; upper: Array<[string, number]> };
};
