import { env } from '@/shared/config/env';
import {
  citySchema,
  healthSchema,
  metricDefinitionSchema,
  observationSchema,
  predictionSchema
} from '@/shared/api/schemas';
import { citiesSeed, getMockHealth, getMockObservations, getMockPredictions, metricsSeed } from '@/shared/api/mockData';

const fetchJson = async <T>(url: string, schema: { parse: (data: unknown) => T }) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return schema.parse(await response.json());
};

export const apiClient = {
  getCities: async () =>
    env.mock
      ? citySchema.array().parse(citiesSeed)
      : fetchJson(`${env.apiBaseUrl}/cities`, citySchema.array()),
  getMetrics: async () =>
    env.mock
      ? metricDefinitionSchema.array().parse(metricsSeed)
      : fetchJson(`${env.apiBaseUrl}/metrics`, metricDefinitionSchema.array()),
  getObservations: async (params: URLSearchParams) => {
    if (env.mock) {
      const metrics = params.get('metrics')?.split(',') ?? ['pm25'];
      return observationSchema
        .array()
        .parse(getMockObservations(params.get('from')!, params.get('to')!, metrics));
    }
    return fetchJson(`${env.apiBaseUrl}/observations?${params.toString()}`, observationSchema.array());
  },
  getPredictions: async (params: URLSearchParams) => {
    if (env.mock) {
      const metrics = params.get('metrics')?.split(',') ?? ['pm25'];
      return predictionSchema.array().parse(
        getMockPredictions(
          params.get('from')!,
          params.get('to')!,
          metrics,
          Number(params.get('horizon') ?? 60)
        )
      );
    }
    return fetchJson(`${env.apiBaseUrl}/predictions?${params.toString()}`, predictionSchema.array());
  },
  getHealth: async (params: URLSearchParams) =>
    env.mock ? healthSchema.parse(getMockHealth()) : fetchJson(`${env.apiBaseUrl}/health?${params.toString()}`, healthSchema)
};
