export const queryKeys = {
  cities: ['cities'] as const,
  stations: (cityId: string) => ['stations', cityId] as const,
  metrics: ['metrics'] as const,
  observations: (cityId: string, stationId: string | undefined, from: string, to: string, metrics: string[]) =>
    ['observations', cityId, stationId ?? 'none', from, to, [...metrics].sort().join(',')] as const,
  predictions: (
    cityId: string,
    stationId: string | undefined,
    from: string,
    to: string,
    metrics: string[],
    horizonMinutes: number
  ) =>
    ['predictions', cityId, stationId ?? 'none', from, to, [...metrics].sort().join(','), horizonMinutes] as const,
  health: (cityId: string, stationId: string | undefined, from: string, to: string) =>
    ['health', cityId, stationId ?? 'none', from, to] as const,
  meta: ['meta'] as const
};
