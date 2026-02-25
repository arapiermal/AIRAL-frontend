import { addHours } from 'date-fns';
import type {
  City,
  HealthSnapshot,
  MetaSnapshot,
  MetricDefinition,
  ObservationPoint,
  PredictionPoint,
  Station
} from '@/shared/domain/types';

const createSeededRandom = (seed: number) => {
  let localSeed = seed;
  return () => {
    localSeed = (localSeed * 1664525 + 1013904223) % 4294967296;
    return localSeed / 4294967296;
  };
};

const hashString = (input: string) =>
  input.split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0) >>> 0;

const getDeterministicRng = (seedKey: string) => createSeededRandom(hashString(seedKey) + 42);

const stationsSeed: Station[] = [
  { id: 'tirana-central', cityId: 'tirana', name: 'Central', lat: 41.3275, lon: 19.8187, isDefault: true },
  { id: 'elbasan-central', cityId: 'elbasan', name: 'Central', lat: 41.1125, lon: 20.0822, isDefault: true }
];

export const citiesSeed: City[] = [
  {
    id: 'tirana',
    name: 'Tirana',
    lat: 41.3275,
    lon: 19.8187,
    timezone: 'Europe/Tirane',
    stations: stationsSeed.filter((station) => station.cityId === 'tirana')
  },
  {
    id: 'elbasan',
    name: 'Elbasan',
    lat: 41.1125,
    lon: 20.0822,
    timezone: 'Europe/Tirane',
    stations: stationsSeed.filter((station) => station.cityId === 'elbasan')
  }
];

export const metricsSeed: MetricDefinition[] = [
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', category: 'pollutant' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³', category: 'pollutant' },
  { key: 'temp', label: 'Temperature', unit: '°C', category: 'meteo' },
  { key: 'rh', label: 'Humidity', unit: '%', category: 'meteo' },
  { key: 'wind', label: 'Wind', unit: 'm/s', category: 'meteo' }
];

const baseByMetric: Record<string, number> = {
  pm25: 16,
  pm10: 28,
  temp: 21,
  rh: 52,
  wind: 3.5,
  abs_470: 10,
  abs_520: 9,
  abs_660: 8
};

const makeSeries = (
  from: string,
  to: string,
  cityId: string,
  stationId: string | undefined,
  metric: string,
  base: number
): ObservationPoint[] => {
  const start = new Date(from);
  const end = new Date(to);
  const points: ObservationPoint[] = [];
  const rng = getDeterministicRng(`${cityId}:${stationId ?? 'none'}:${metric}:${from}:${to}`);
  for (let t = start; t <= end; t = addHours(t, 1)) {
    const wave = Math.sin((t.getHours() / 24) * Math.PI * 2) * (metric.startsWith('pm') ? 6 : 3);
    points.push({
      timestamp: t.toISOString(),
      metric,
      value: Number((base + wave + rng() * 2).toFixed(2)),
      quality: 'good',
      stationId
    });
  }
  return points;
};

export const getMockStations = (cityId: string) => stationsSeed.filter((station) => station.cityId === cityId);

export const getMockObservations = (
  from: string,
  to: string,
  metrics: string[],
  cityId: string,
  stationId?: string
) =>
  metrics.flatMap((metric) =>
    makeSeries(from, to, cityId, stationId, metric, baseByMetric[metric] ?? 20)
  );

export const getMockPredictions = (
  from: string,
  to: string,
  metrics: string[],
  horizonMinutes: number,
  cityId: string,
  stationId?: string
): PredictionPoint[] =>
  getMockObservations(from, to, metrics, cityId, stationId).map((point) => ({
    timestamp: point.timestamp,
    generatedAt: new Date(new Date(point.timestamp).getTime() - horizonMinutes * 60_000).toISOString(),
    horizonMinutes,
    metric: point.metric,
    value: Number((point.value * 1.08).toFixed(2)),
    lower: Number((point.value * 0.92).toFixed(2)),
    upper: Number((point.value * 1.18).toFixed(2)),
    modelVersion: 'v0.2.0',
    stationId
  }));

export const getMockHealth = (): HealthSnapshot => ({
  uptimePct: 98.2,
  missingPct: 1.8,
  outlierCount: 3,
  lastSeenAt: '2025-01-01T12:00:00.000Z',
  modelVersion: 'v0.2.0'
});

export const getMockMeta = (): MetaSnapshot => ({
  appVersion: '2.0.0-mock',
  schemaVersion: '2026.02',
  modelVersion: 'v0.2.0',
  dataCadenceSeconds: 30,
  environment: 'mock'
});
