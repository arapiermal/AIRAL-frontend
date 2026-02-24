import { describe, expect, it } from 'vitest';
import { celsiusToFahrenheit } from '@/shared/utils/unit';

describe('unit conversion', () => {
  it('converts celsius to fahrenheit', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });
});
