import type { City, Station } from '@/shared/domain/types';

export type MapRenderContext = {
  cities: City[];
  stations: Station[];
  selectedCityId: string;
  selectedStationId?: string;
};

export interface MapLayer {
  id: string;
  label: string;
  isEnabledByDefault: boolean;
  render: (ctx: MapRenderContext) => string;
}

export type LayerState = Record<string, boolean>;

export const createLayerState = (layers: MapLayer[]): LayerState =>
  Object.fromEntries(layers.map((layer) => [layer.id, layer.isEnabledByDefault]));

export const toggleLayer = (state: LayerState, layerId: string): LayerState => ({
  ...state,
  [layerId]: !state[layerId]
});

export const markersLayer: MapLayer = {
  id: 'markers',
  label: 'Markers',
  isEnabledByDefault: true,
  render: (ctx) => {
    const cityMarks = ctx.cities
      .map(
        (city, index) =>
          `<circle cx='${90 + index * 90}' cy='80' r='${ctx.selectedCityId === city.id ? 8 : 5}' fill='${
            ctx.selectedCityId === city.id ? '#2563eb' : '#64748b'
          }'/><text x='${98 + index * 90}' y='80' font-size='12'>${city.name}</text>`
      )
      .join('');
    const stationMarks = ctx.stations
      .map(
        (station, index) =>
          `<rect x='${90 + index * 90}' y='98' width='8' height='8' fill='${
            ctx.selectedStationId === station.id ? '#16a34a' : '#334155'
          }'/><text x='${100 + index * 90}' y='106' font-size='10'>${station.name}</text>`
      )
      .join('');
    return `${cityMarks}${stationMarks}`;
  }
};

export const weatherOverlayLayer: MapLayer = {
  id: 'weather',
  label: 'Weather Overlay',
  isEnabledByDefault: false,
  render: () =>
    "<rect x='20' y='20' width='280' height='130' fill='#38bdf8' opacity='0.08'/><text x='24' y='34' font-size='10' fill='#0369a1'>Weather overlay (placeholder)</text><text x='24' y='48' font-size='10' fill='#0369a1'>Legend: cooler → warmer</text>"
};

export const defaultLayers: MapLayer[] = [markersLayer, weatherOverlayLayer];
