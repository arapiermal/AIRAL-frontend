import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/queryKeys';
import { env } from '@/shared/config/env';

type DataQueryParams = {
  cityId: string;
  stationId?: string;
  from: string;
  to: string;
  metrics: string[];
};

export const useCitiesQuery = () => useQuery({ queryKey: queryKeys.cities, queryFn: apiClient.getCities });
export const useStationsQuery = (cityId: string) =>
  useQuery({
    queryKey: queryKeys.stations(cityId),
    queryFn: () => apiClient.getStations(cityId)
  });
export const useMetricsQuery = () => useQuery({ queryKey: queryKeys.metrics, queryFn: apiClient.getMetrics });

export const useObservationsQuery = ({ cityId, stationId, from, to, metrics }: DataQueryParams) =>
  useQuery({
    queryKey: queryKeys.observations(cityId, stationId, from, to, metrics),
    queryFn: () => {
      const params = new URLSearchParams({ cityId, from, to, metrics: metrics.join(',') });
      if (stationId) params.set('stationId', stationId);
      return apiClient.getObservations(params);
    },
    refetchInterval: env.realtime ? false : 30_000
  });

export const usePredictionsQuery = ({ cityId, stationId, from, to, metrics, horizon }: DataQueryParams & { horizon: number }) =>
  useQuery({
    queryKey: queryKeys.predictions(cityId, stationId, from, to, metrics, horizon),
    queryFn: () => {
      const params = new URLSearchParams({ cityId, from, to, metrics: metrics.join(','), horizon: String(horizon) });
      if (stationId) params.set('stationId', stationId);
      return apiClient.getPredictions(params);
    },
    refetchInterval: env.realtime ? false : 30_000
  });

export const useHealthQuery = (cityId: string, stationId: string | undefined, from: string, to: string) =>
  useQuery({
    queryKey: queryKeys.health(cityId, stationId, from, to),
    queryFn: () => {
      const params = new URLSearchParams({ cityId, from, to });
      if (stationId) params.set('stationId', stationId);
      return apiClient.getHealth(params);
    },
    refetchInterval: 30_000
  });

export const useMetaQuery = () => useQuery({ queryKey: queryKeys.meta, queryFn: apiClient.getMeta });
