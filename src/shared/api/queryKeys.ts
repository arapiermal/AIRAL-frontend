export const queryKeys = {
  cities: ['cities'] as const,
  metrics: ['metrics'] as const,
  observations: (cityId: string, from: string, to: string, metrics: string[]) =>
    ['observations', cityId, from, to, [...metrics].sort().join(',')] as const,
  predictions: (
    cityId: string,
    from: string,
    to: string,
    metrics: string[],
    horizonMinutes: number
  ) => ['predictions', cityId, from, to, [...metrics].sort().join(','), horizonMinutes] as const,
  health: (cityId: string, from: string, to: string) => ['health', cityId, from, to] as const
};
