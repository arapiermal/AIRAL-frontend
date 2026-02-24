import type { City } from '@/shared/domain/types';

export type MapPanelProps = { cities: City[]; selectedCityId: string };

export interface MapProvider {
  render: (container: HTMLElement, props: MapPanelProps) => void;
  destroy: () => void;
}

export class SvgMapProvider implements MapProvider {
  render(container: HTMLElement, props: MapPanelProps) {
    container.innerHTML = `<svg viewBox='0 0 320 180' width='100%' height='220' xmlns='http://www.w3.org/2000/svg'>
      <rect width='320' height='180' fill='transparent' stroke='currentColor' opacity='0.2'/>
      ${props.cities.map((c, idx) => `<circle cx='${100+idx*80}' cy='${90+idx*20}' r='${props.selectedCityId===c.id?8:5}' fill='${props.selectedCityId===c.id?'#2563eb':'#64748b'}'/><text x='${110+idx*80}' y='${90+idx*20}' font-size='12'>${c.name}</text>`).join('')}
    </svg>`;
  }
  destroy() {}
}

export class PlaceholderMapProvider implements MapProvider {
  render(container: HTMLElement) {
    container.innerHTML = `<div style='height:220px;display:flex;align-items:center;justify-content:center;border:1px dashed'>Future Leaflet/MapLibre provider</div>`;
  }
  destroy() {}
}
