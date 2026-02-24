import { describe, expect, it } from 'vitest';
import { parseISODate } from '@/shared/utils/date';

describe('parseISODate', () => {
  it('parses valid ISO date', () => {
    expect(parseISODate('2024-01-01T00:00:00.000Z').toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('throws on invalid date', () => {
    expect(() => parseISODate('not-iso')).toThrow();
  });
});
