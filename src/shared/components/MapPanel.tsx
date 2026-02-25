import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { defaultLayers, createLayerState, toggleLayer } from '@/shared/map/layers';
import { SvgMapProvider, type MapProvider } from '@/shared/map/providers';
import type { City, Station } from '@/shared/domain/types';

export const MapPanel = ({
  cities,
  stations,
  selectedCityId,
  selectedStationId,
  provider = new SvgMapProvider()
}: {
  cities: City[];
  stations: Station[];
  selectedCityId: string;
  selectedStationId?: string;
  provider?: MapProvider;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const layers = useMemo(() => defaultLayers, []);
  const [layerState, setLayerState] = useState(() => createLayerState(layers));

  useEffect(() => {
    if (ref.current) {
      provider.render(ref.current, {
        cities,
        stations,
        selectedCityId,
        selectedStationId,
        layers,
        layerState
      });
    }
    return () => provider.destroy();
  }, [provider, cities, stations, selectedCityId, selectedStationId, layers, layerState]);

  return (
    <Card>
      <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
        <h3 className='font-medium'>Map / Overview</h3>
        <div className='flex gap-3'>
          {layers.map((layer) => (
            <label key={layer.id} className='flex items-center gap-1 text-xs'>
              <input
                type='checkbox'
                checked={Boolean(layerState[layer.id])}
                onChange={() => setLayerState((current) => toggleLayer(current, layer.id))}
                aria-label={`Toggle ${layer.label}`}
              />
              {layer.label}
            </label>
          ))}
        </div>
      </div>
      <div ref={ref} />
    </Card>
  );
};
