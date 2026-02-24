import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/queryKeys';

export const useCitiesQuery = () => useQuery({ queryKey: queryKeys.cities, queryFn: apiClient.getCities });
export const useMetricsQuery = () => useQuery({ queryKey: queryKeys.metrics, queryFn: apiClient.getMetrics });

export const useObservationsQuery = (cityId: string, from: string, to: string, metrics: string[]) =>
  useQuery({
    queryKey: queryKeys.observations(cityId, from, to, metrics),
    queryFn: () => apiClient.getObservations(new URLSearchParams({ cityId, from, to, metrics: metrics.join(',') })),
    refetchInterval: 30_000
  });

export const usePredictionsQuery = (cityId: string, from: string, to: string, metrics: string[], horizon: number) =>
  useQuery({
    queryKey: queryKeys.predictions(cityId, from, to, metrics, horizon),
    queryFn: () => apiClient.getPredictions(new URLSearchParams({ cityId, from, to, metrics: metrics.join(','), horizon: String(horizon) })),
    refetchInterval: 30_000
  });

export const useHealthQuery = (cityId: string, from: string, to: string) =>
  useQuery({
    queryKey: queryKeys.health(cityId, from, to),
    queryFn: () => apiClient.getHealth(new URLSearchParams({ cityId, from, to })),
    refetchInterval: 30_000
  });
