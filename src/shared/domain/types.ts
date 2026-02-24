export type City = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  timezone: string;
  bounds?: { north: number; south: number; east: number; west: number };
};

export type MetricCategory = 'pollutant' | 'meteo' | 'sensor';

export type MetricDefinition = {
  key: string;
  label: string;
  unit: string;
  category: MetricCategory;
  defaultColor?: string;
};

export type ObservationPoint = {
  timestamp: string;
  metric: string;
  value: number;
  quality?: 'good' | 'suspect' | 'bad';
  source?: string;
};

export type PredictionPoint = {
  timestamp: string;
  generatedAt: string;
  horizonMinutes: number;
  metric: string;
  value: number;
  lower?: number;
  upper?: number;
  modelVersion?: string;
};

export type Alert = {
  id: string;
  cityId: string;
  metric: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  type: 'threshold' | 'anomaly' | 'missing' | 'drift' | string;
};

export type HealthSnapshot = {
  uptimePct: number;
  missingPct: number;
  outlierCount: number;
  lastSeenAt: string;
  modelVersion: string;
};
