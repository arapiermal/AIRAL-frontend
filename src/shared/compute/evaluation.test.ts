import { describe, expect, it } from 'vitest';
import { alignResiduals, computeMae, computeMape } from '@/shared/compute/evaluation';

describe('evaluation compute', () => {
  it('aligns residuals only on matching timestamps', () => {
    const residuals = alignResiduals(
      [
        { timestamp: '2024-01-01T00:00:00.000Z', metric: 'pm25', value: 10 },
        { timestamp: '2024-01-01T01:00:00.000Z', metric: 'pm25', value: 12 }
      ],
      [
        {
          timestamp: '2024-01-01T01:00:00.000Z',
          generatedAt: '2024-01-01T00:00:00.000Z',
          horizonMinutes: 60,
          metric: 'pm25',
          value: 11
        }
      ],
      'pm25'
    );
    expect(residuals).toEqual([
      { timestamp: '2024-01-01T01:00:00.000Z', observed: 12, predicted: 11, residual: 1 }
    ]);
  });

  it('computes mae and mape with zero-observed guard', () => {
    const residuals = [
      { timestamp: 'a', observed: 10, predicted: 9, residual: 1 },
      { timestamp: 'b', observed: 0, predicted: 2, residual: -2 }
    ];
    expect(computeMae(residuals)).toBe(1.5);
    expect(computeMape(residuals)).toBe(10);
  });
});
