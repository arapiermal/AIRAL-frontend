import { z } from 'zod';

export const stationSchema = z.object({
  id: z.string(),
  cityId: z.string(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  isDefault: z.boolean().optional()
});

export const citySchema = z.object({
  id: z.string(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  bounds: z
    .object({ north: z.number(), south: z.number(), east: z.number(), west: z.number() })
    .optional(),
  stations: stationSchema.array().optional()
});

export const metricDefinitionSchema = z.object({
  key: z.string(),
  label: z.string(),
  unit: z.string(),
  category: z.enum(['pollutant', 'meteo', 'sensor']),
  defaultColor: z.string().optional()
});

export const observationSchema = z.object({
  timestamp: z.string().datetime(),
  metric: z.string(),
  value: z.number(),
  quality: z.enum(['good', 'suspect', 'bad']).optional(),
  source: z.string().optional(),
  stationId: z.string().optional()
});

export const predictionSchema = z.object({
  timestamp: z.string().datetime(),
  generatedAt: z.string().datetime(),
  horizonMinutes: z.number(),
  metric: z.string(),
  value: z.number(),
  lower: z.number().optional(),
  upper: z.number().optional(),
  modelVersion: z.string().optional(),
  stationId: z.string().optional()
});

export const healthSchema = z.object({
  uptimePct: z.number(),
  missingPct: z.number(),
  outlierCount: z.number(),
  lastSeenAt: z.string().datetime(),
  modelVersion: z.string()
});

export const metaSchema = z.object({
  appVersion: z.string(),
  schemaVersion: z.string(),
  modelVersion: z.string(),
  dataCadenceSeconds: z.number(),
  environment: z.string()
});
