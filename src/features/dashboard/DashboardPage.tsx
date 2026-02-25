import { useEffect, useMemo, useState } from 'react';
import { useAppState } from '@/app/providers';
import {
  useCitiesQuery,
  useMetricsQuery,
  useObservationsQuery,
  usePredictionsQuery,
  useStationsQuery
} from '@/shared/hooks/useAirQueries';
import { Card } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { TimeSeriesChart } from '@/shared/components/TimeSeriesChart';
import { MapPanel } from '@/shared/components/MapPanel';
import { computeAQI } from '@/shared/utils/aqi';
import { alignResiduals, computeMae, computeMape } from '@/shared/compute/evaluation';
import { buildMetricCatalog, hasMetricsForSet, metricsBySet, recommendedGroups } from '@/shared/domain/metricCatalog';
import { createRealtimeClient, type RealtimeEvent } from '@/shared/realtime/client';
import { env } from '@/shared/config/env';
import type { City, ObservationPoint, PredictionPoint } from '@/shared/domain/types';

const presets = ['24h', '72h', '7d'] as const;

export const DashboardPage = () => {
  const { cityId, setCityId, stationId, setStationId, range, setRangePreset } = useAppState();
  const [horizon, setHorizon] = useState(60);
  const [selectedMetric, setSelectedMetric] = useState('pm25');
  const [realtimeStatus, setRealtimeStatus] = useState('disabled');
  const [lastRealtimeEvent, setLastRealtimeEvent] = useState<RealtimeEvent | null>(null);

  const cities = useCitiesQuery();
  const stationsQuery = useStationsQuery(cityId);
  const metricDefs = useMetricsQuery();

  const catalog = useMemo(() => buildMetricCatalog(metricDefs.data ?? []), [metricDefs.data]);
  const allMetrics = useMemo(() => catalog.map((metric) => metric.key), [catalog]);

  useEffect(() => {
    if (!catalog.length) return;
    if (!catalog.some((metric) => metric.key === selectedMetric)) {
      setSelectedMetric(catalog[0].key);
    }
  }, [catalog, selectedMetric]);

  useEffect(() => {
    const stations = stationsQuery.data ?? [];
    if (!stations.length) {
      if (stationId) setStationId(undefined);
      return;
    }
    if (!stationId || !stations.some((station) => station.id === stationId)) {
      setStationId(stations.find((station) => station.isDefault)?.id ?? stations[0].id);
    }
  }, [stationId, setStationId, stationsQuery.data]);

  const observations = useObservationsQuery({
    cityId,
    stationId,
    from: range.from,
    to: range.to,
    metrics: allMetrics
  });
  const predictions = usePredictionsQuery({
    cityId,
    stationId,
    from: range.from,
    to: range.to,
    metrics: [selectedMetric],
    horizon
  });

  useEffect(() => {
    const client = createRealtimeClient();
    client.connect();
    setRealtimeStatus(client.status);
    const unsubObs = client.subscribe('observation.new', (event) => {
      setLastRealtimeEvent(event);
      setRealtimeStatus(client.status);
    });
    const unsubPred = client.subscribe('prediction.new', (event) => {
      setLastRealtimeEvent(event);
      setRealtimeStatus(client.status);
    });

    return () => {
      unsubObs();
      unsubPred();
      client.disconnect();
      setRealtimeStatus(client.status);
    };
  }, []);

  const selectedMetricDef = catalog.find((metric) => metric.key === selectedMetric);
  const observationPoints = observations.data ?? [];
  const predictionPoints = predictions.data ?? [];
  const filteredObserved = observationPoints.filter((point: ObservationPoint) => point.metric === selectedMetric);
  const filteredPredicted = predictionPoints.filter((point: PredictionPoint) => point.metric === selectedMetric);
  const latestValue = filteredObserved.at(-1)?.value;

  const mainSeries = [
    {
      name: `Observed ${selectedMetricDef?.label ?? selectedMetric}`,
      data: filteredObserved.map((point) => [point.timestamp, point.value] as [string, number])
    },
    {
      name: `Predicted ${selectedMetricDef?.label ?? selectedMetric}`,
      data: filteredPredicted.map((point) => [point.timestamp, point.value] as [string, number]),
      areaBand: {
        lower: filteredPredicted
          .filter((point) => point.lower !== undefined)
          .map((point) => [point.timestamp, point.lower!] as [string, number]),
        upper: filteredPredicted
          .filter((point) => point.upper !== undefined)
          .map((point) => [point.timestamp, point.upper!] as [string, number])
      }
    }
  ];

  const residuals = alignResiduals(observationPoints, predictionPoints, selectedMetric);
  const residualSeries = [
    {
      name: `${selectedMetricDef?.label ?? selectedMetric} residual`,
      data: residuals.map((point) => [point.timestamp, point.residual] as [string, number])
    }
  ];

  const availableMetrics = [...new Set(observationPoints.map((point) => point.metric))];

  if (cities.isLoading || metricDefs.isLoading || stationsQuery.isLoading) return <p>Loading dashboard...</p>;
  if (cities.error || metricDefs.error || stationsQuery.error || !selectedMetricDef)
    return <p>Failed loading dashboard metadata.</p>;

  return (
    <div className='space-y-4'>
      <div className='grid gap-3 md:grid-cols-5'>
        <Card>
          <p className='text-xs text-muted-foreground'>City</p>
          <Select value={cityId} onValueChange={setCityId}>
            <SelectTrigger>
              <SelectValue placeholder='Select city' />
            </SelectTrigger>
            <SelectContent>
              {cities.data!.map((city: City) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
        {stationsQuery.data && stationsQuery.data.length > 0 && stationId ? (
          <Card>
            <p className='text-xs text-muted-foreground'>Station</p>
            <Select value={stationId} onValueChange={setStationId}>
              <SelectTrigger>
                <SelectValue placeholder='Select station' />
              </SelectTrigger>
              <SelectContent>
                {stationsQuery.data.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        ) : null}
        <Card>
          <p className='text-xs text-muted-foreground'>Metric</p>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger>
              <SelectValue placeholder='Select metric' />
            </SelectTrigger>
            <SelectContent>
              {catalog.map((metric) => (
                <SelectItem key={metric.key} value={metric.key}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
        <Card>
          <p className='text-xs text-muted-foreground'>Date Range</p>
          <div className='mt-2 flex gap-2'>
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setRangePreset(preset)}
                className='rounded border px-2 py-1 text-xs'
              >
                {preset}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <p className='text-xs text-muted-foreground'>Forecast Horizon</p>
          <Select value={String(horizon)} onValueChange={(value: string) => setHorizon(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder='Select horizon' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='60'>1h</SelectItem>
              <SelectItem value='180'>3h</SelectItem>
              <SelectItem value='1440'>24h</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      <div className='grid gap-3 md:grid-cols-3'>
        <Card>
          <p className='text-xs text-muted-foreground'>{selectedMetricDef.label}</p>
          <p className='text-2xl font-semibold'>
            {latestValue ?? '—'} {selectedMetricDef.unit}
          </p>
        </Card>
        {selectedMetric === 'pm25' || selectedMetric === 'pm10' ? (
          <Card>
            <p className='text-xs text-muted-foreground'>AQI (estimated)</p>
            <p className='text-2xl font-semibold'>{computeAQI(latestValue) ?? '—'}</p>
          </Card>
        ) : null}
        <Card>
          <p className='text-xs text-muted-foreground'>Live Status</p>
          <p className='text-sm'>{env.realtime ? realtimeStatus : 'Polling every 30s'}</p>
          <p className='text-xs text-muted-foreground'>
            Last realtime event:{' '}
            {lastRealtimeEvent
              ? `${lastRealtimeEvent.eventName} @ ${new Date(lastRealtimeEvent.timestamp).toLocaleTimeString()}`
              : '—'}
          </p>
        </Card>
      </div>

      <TimeSeriesChart title={`Observed vs Predicted - ${selectedMetricDef.label}`} series={mainSeries} />

      {recommendedGroups.map((group) =>
        hasMetricsForSet(catalog, group.set, availableMetrics) ? (
          <Card key={group.set}>
            <h3 className='mb-3 font-medium'>{group.title} Panel</h3>
            <p className='text-sm text-muted-foreground'>
              Available metrics: {metricsBySet(catalog, group.set).filter((entry) => availableMetrics.includes(entry.key)).map((entry) => entry.label).join(', ')}
            </p>
          </Card>
        ) : null
      )}

      <Card>
        <h3 className='mb-3 font-medium'>Model Evaluation</h3>
        {filteredPredicted.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            No predictions available for the selected metric and horizon. Try another metric or shorter horizon.
          </p>
        ) : (
          <>
            <div className='mb-3 grid gap-3 md:grid-cols-2'>
              <Card>
                <p className='text-xs text-muted-foreground'>MAE</p>
                <p className='text-xl font-semibold'>{computeMae(residuals) ?? '—'}</p>
              </Card>
              <Card>
                <p className='text-xs text-muted-foreground'>MAPE</p>
                <p className='text-xl font-semibold'>{computeMape(residuals) ?? '—'}%</p>
              </Card>
            </div>
            <TimeSeriesChart title={`Residuals - ${selectedMetricDef.label}`} series={residualSeries} />
          </>
        )}
      </Card>

      <MapPanel
        cities={cities.data!}
        stations={stationsQuery.data ?? []}
        selectedCityId={cityId}
        selectedStationId={stationId}
      />
    </div>
  );
};
