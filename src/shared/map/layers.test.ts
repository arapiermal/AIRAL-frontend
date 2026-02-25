import { describe, expect, it } from 'vitest';
import { createLayerState, markersLayer, toggleLayer, weatherOverlayLayer } from '@/shared/map/layers';

describe('map layers registry', () => {
  it('creates default state from layer defaults', () => {
    const state = createLayerState([markersLayer, weatherOverlayLayer]);
    expect(state).toEqual({ markers: true, weather: false });
  });

  it('toggles layer state immutably', () => {
    const state = createLayerState([markersLayer, weatherOverlayLayer]);
    const next = toggleLayer(state, 'weather');
    expect(state.weather).toBe(false);
    expect(next.weather).toBe(true);
  });
});
