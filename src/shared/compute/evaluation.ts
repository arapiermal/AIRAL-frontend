import type { ObservationPoint, PredictionPoint } from '@/shared/domain/types';

export type ResidualPoint = { timestamp: string; observed: number; predicted: number; residual: number };

export const alignResiduals = (
  observations: ObservationPoint[],
  predictions: PredictionPoint[],
  metric: string
): ResidualPoint[] => {
  const observedMap = new Map(
    observations.filter((point) => point.metric === metric).map((point) => [point.timestamp, point.value])
  );

  return predictions
    .filter((point) => point.metric === metric)
    .flatMap((prediction) => {
      const observed = observedMap.get(prediction.timestamp);
      if (observed === undefined) return [];
      return [
        {
          timestamp: prediction.timestamp,
          observed,
          predicted: prediction.value,
          residual: Number((observed - prediction.value).toFixed(4))
        }
      ];
    });
};

export const computeMae = (residuals: ResidualPoint[]) => {
  if (!residuals.length) return null;
  const value = residuals.reduce((acc, point) => acc + Math.abs(point.residual), 0) / residuals.length;
  return Number(value.toFixed(4));
};

export const computeMape = (residuals: ResidualPoint[]) => {
  const nonZeroObserved = residuals.filter((point) => point.observed !== 0);
  if (!nonZeroObserved.length) return null;
  const value =
    nonZeroObserved.reduce((acc, point) => acc + Math.abs(point.residual / point.observed), 0) /
    nonZeroObserved.length;
  return Number((value * 100).toFixed(2));
};
