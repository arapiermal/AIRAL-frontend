import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/shared/api/queryKeys';

describe('queryKeys', () => {
  it('sorts metrics for stable keys', () => {
    expect(queryKeys.observations('tirana', 'a', 'b', ['pm10', 'pm25'])).toEqual(
      queryKeys.observations('tirana', 'a', 'b', ['pm25', 'pm10'])
    );
  });
});
