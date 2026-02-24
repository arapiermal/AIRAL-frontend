import { useEffect, useRef } from 'react';
import { Card } from '@/shared/components/ui/card';
import { SvgMapProvider, type MapProvider } from '@/shared/map/providers';
import type { City } from '@/shared/domain/types';

export const MapPanel = ({ cities, selectedCityId, provider = new SvgMapProvider() }: { cities: City[]; selectedCityId: string; provider?: MapProvider }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) provider.render(ref.current, { cities, selectedCityId });
    return () => provider.destroy();
  }, [provider, cities, selectedCityId]);

  return <Card><h3 className='mb-3 font-medium'>Map / Overview</h3><div ref={ref} /></Card>;
};
