import { useMemo, useState } from 'react';
import { useAppState } from '@/app/providers';
import { useCitiesQuery, useMetricsQuery, useObservationsQuery, usePredictionsQuery } from '@/shared/hooks/useAirQueries';
import { Card } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { TimeSeriesChart } from '@/shared/components/TimeSeriesChart';
import { MapPanel } from '@/shared/components/MapPanel';
import { computeAQI } from '@/shared/utils/aqi';

const presets = ['24h', '72h', '7d'] as const;

export const DashboardPage = () => {
  const { cityId, setCityId, range, setRangePreset } = useAppState();
  const [horizon, setHorizon] = useState(60);
  const metrics = ['pm25', 'pm10', 'temp', 'rh', 'wind'];

  const cities = useCitiesQuery();
  const observations = useObservationsQuery(cityId, range.from, range.to, metrics);
  const predictions = usePredictionsQuery(cityId, range.from, range.to, ['pm25', 'pm10'], horizon);
  const metricDefs = useMetricsQuery();

  const latestPm25 = observations.data?.filter((d) => d.metric === 'pm25').at(-1)?.value;
  const latestPm10 = observations.data?.filter((d) => d.metric === 'pm10').at(-1)?.value;

  const mainSeries = useMemo(() => {
    const obs = observations.data ?? [];
    const pred = predictions.data ?? [];
    return [
      { name: 'Observed PM2.5', data: obs.filter((x) => x.metric === 'pm25').map((x) => [x.timestamp, x.value] as [string, number]) },
      {
        name: 'Predicted PM2.5',
        data: pred.filter((x) => x.metric === 'pm25').map((x) => [x.timestamp, x.value] as [string, number]),
        areaBand: {
          lower: pred.filter((x) => x.metric === 'pm25' && x.lower !== undefined).map((x) => [x.timestamp, x.lower!] as [string, number]),
          upper: pred.filter((x) => x.metric === 'pm25' && x.upper !== undefined).map((x) => [x.timestamp, x.upper!] as [string, number])
        }
      }
    ];
  }, [observations.data, predictions.data]);

  if (cities.isLoading || metricDefs.isLoading) return <p>Loading dashboard...</p>;
  if (cities.error || metricDefs.error) return <p>Failed loading dashboard metadata.</p>;

  return <div className='space-y-4'>
    <div className='grid gap-3 md:grid-cols-4'>
      <Card><p className='text-xs text-muted-foreground'>City</p><Select value={cityId} onValueChange={setCityId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{cities.data!.map((city) => <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>)}</SelectContent></Select></Card>
      <Card><p className='text-xs text-muted-foreground'>Date Range</p><div className='mt-2 flex gap-2'>{presets.map((preset) => <button key={preset} onClick={() => setRangePreset(preset)} className='rounded border px-2 py-1 text-xs'>{preset}</button>)}</div></Card>
      <Card><p className='text-xs text-muted-foreground'>Forecast Horizon</p><Select value={String(horizon)} onValueChange={(v) => setHorizon(Number(v))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='60'>1h</SelectItem><SelectItem value='180'>3h</SelectItem><SelectItem value='1440'>24h</SelectItem></SelectContent></Select></Card>
      <Card><p className='text-xs text-muted-foreground'>Live Status</p><p className='text-sm'>Polling every 30s</p><p className='text-xs text-muted-foreground'>Last update: {new Date().toLocaleTimeString()}</p></Card>
    </div>

    <div className='grid gap-3 md:grid-cols-3'>
      <Card><p className='text-xs text-muted-foreground'>PM2.5</p><p className='text-2xl font-semibold'>{latestPm25 ?? '—'}</p></Card>
      <Card><p className='text-xs text-muted-foreground'>PM10</p><p className='text-2xl font-semibold'>{latestPm10 ?? '—'}</p></Card>
      <Card><p className='text-xs text-muted-foreground'>AQI (estimated)</p><p className='text-2xl font-semibold'>{computeAQI(latestPm25) ?? '—'}</p></Card>
    </div>

    <TimeSeriesChart title='Observed vs Predicted' series={mainSeries} />
    <MapPanel cities={cities.data!} selectedCityId={cityId} />
  </div>;
};
