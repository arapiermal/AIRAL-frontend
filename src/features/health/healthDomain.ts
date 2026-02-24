import type { HealthSnapshot, ObservationPoint } from '@/shared/domain/types';

export const calculateMissingPct = (points: ObservationPoint[], expectedCount: number) =>
  expectedCount === 0 ? 0 : Number((((expectedCount - points.length) / expectedCount) * 100).toFixed(2));

export const summarizeHealth = (snapshot: HealthSnapshot) => [
  { label: 'Uptime', value: `${snapshot.uptimePct}%` },
  { label: 'Missing', value: `${snapshot.missingPct}%` },
  { label: 'Outliers', value: snapshot.outlierCount },
  { label: 'Model', value: snapshot.modelVersion }
];
