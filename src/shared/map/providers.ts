import type { City, Station } from '@/shared/domain/types';
import type { MapLayer, MapRenderContext } from '@/shared/map/layers';

export type MapPanelProps = {
  cities: City[];
  stations: Station[];
  selectedCityId: string;
  selectedStationId?: string;
  layers: MapLayer[];
  layerState: Record<string, boolean>;
};

export interface MapProvider {
  render: (container: HTMLElement, props: MapPanelProps) => void;
  destroy: () => void;
}

export class SvgMapProvider implements MapProvider {
  render(container: HTMLElement, props: MapPanelProps) {
    const context: MapRenderContext = {
      cities: props.cities,
      stations: props.stations,
      selectedCityId: props.selectedCityId,
      selectedStationId: props.selectedStationId
    };
    const layerSvg = props.layers
      .filter((layer) => props.layerState[layer.id])
      .map((layer) => layer.render(context))
      .join('');

    container.innerHTML = `<svg viewBox='0 0 320 180' width='100%' height='220' xmlns='http://www.w3.org/2000/svg'>
      <rect width='320' height='180' fill='transparent' stroke='currentColor' opacity='0.2'/>
      ${layerSvg}
    </svg>`;
  }

  destroy() {}
}

export class PlaceholderMapProvider implements MapProvider {
  render(container: HTMLElement, _props: MapPanelProps) {
    container.innerHTML = `<div style='height:220px;display:flex;align-items:center;justify-content:center;border:1px dashed'>Map provider placeholder</div>`;
  }

  destroy() {}
}
