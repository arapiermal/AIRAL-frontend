import { addHours } from 'date-fns';
import type { City, MetricDefinition, ObservationPoint, PredictionPoint, HealthSnapshot } from '@/shared/domain/types';

const seedRandom = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const rng = seedRandom(42);

export const citiesSeed: City[] = [
  { id: 'tirana', name: 'Tirana', lat: 41.3275, lon: 19.8187, timezone: 'Europe/Tirane' },
  { id: 'elbasan', name: 'Elbasan', lat: 41.1125, lon: 20.0822, timezone: 'Europe/Tirane' }
];

export const metricsSeed: MetricDefinition[] = [
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', category: 'pollutant' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³', category: 'pollutant' },
  { key: 'temp', label: 'Temperature', unit: '°C', category: 'meteo' },
  { key: 'rh', label: 'Humidity', unit: '%', category: 'meteo' },
  { key: 'wind', label: 'Wind', unit: 'm/s', category: 'meteo' }
];

const makeSeries = (from: string, to: string, metric: string, base: number): ObservationPoint[] => {
  const start = new Date(from);
  const end = new Date(to);
  const points: ObservationPoint[] = [];
  for (let t = start; t <= end; t = addHours(t, 1)) {
    const wave = Math.sin(t.getHours() / 24 * Math.PI * 2) * 6;
    points.push({ timestamp: t.toISOString(), metric, value: Number((base + wave + rng() * 4).toFixed(2)), quality: 'good' });
  }
  return points;
};

export const getMockObservations = (from: string, to: string, metrics: string[]) =>
  metrics.flatMap((metric) => makeSeries(from, to, metric, metric === 'pm25' ? 16 : metric === 'pm10' ? 28 : 20));

export const getMockPredictions = (from: string, to: string, metrics: string[], horizonMinutes: number): PredictionPoint[] =>
  getMockObservations(from, to, metrics).map((point) => ({
    timestamp: point.timestamp,
    generatedAt: new Date(new Date(point.timestamp).getTime() - horizonMinutes * 60_000).toISOString(),
    horizonMinutes,
    metric: point.metric,
    value: Number((point.value * 1.08).toFixed(2)),
    lower: Number((point.value * 0.92).toFixed(2)),
    upper: Number((point.value * 1.18).toFixed(2)),
    modelVersion: 'v0.1.0'
  }));

export const getMockHealth = (): HealthSnapshot => ({
  uptimePct: 98.2,
  missingPct: 1.8,
  outlierCount: 3,
  lastSeenAt: new Date().toISOString(),
  modelVersion: 'v0.1.0'
});
