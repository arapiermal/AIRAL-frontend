import { useEffect, useMemo, useState } from 'react';
import { useAppState } from '@/app/providers';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import {
  useMetricsQuery,
  useObservationsQuery,
  usePredictionsQuery,
  useStationsQuery
} from '@/shared/hooks/useAirQueries';
import { buildMetricCatalog, metricSetLabels, metricsBySet } from '@/shared/domain/metricCatalog';
import type { MetricSetKey } from '@/shared/domain/types';

export const ExplorerPage = () => {
  const { cityId, stationId, setStationId, range } = useAppState();
  const [metricSet, setMetricSet] = useState<MetricSetKey>('CoreAQ');
  const [metric, setMetric] = useState('pm25');
  const stationsQuery = useStationsQuery(cityId);
  const metricsQuery = useMetricsQuery();
  const catalog = useMemo(() => buildMetricCatalog(metricsQuery.data ?? []), [metricsQuery.data]);

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

  const metricOptions = metricsBySet(catalog, metricSet);
  useEffect(() => {
    if (metricOptions.length && !metricOptions.some((item) => item.key === metric)) {
      setMetric(metricOptions[0].key);
    }
  }, [metric, metricOptions]);

  const obs = useObservationsQuery({ cityId, stationId, from: range.from, to: range.to, metrics: [metric] });
  const pred = usePredictionsQuery({
    cityId,
    stationId,
    from: range.from,
    to: range.to,
    metrics: [metric],
    horizon: 60
  });

  const rows = useMemo(() => [...(obs.data ?? []), ...(pred.data ?? [])], [obs.data, pred.data]);

  const exportCsv = () => {
    const csv = [
      'timestamp,metric,value,type',
      ...rows.map(
        (row) =>
          `${row.timestamp},${row.metric},${row.value},${'horizonMinutes' in row ? 'prediction' : 'observation'}`
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `airal-${cityId}-${metric}.csv`;
    link.click();
  };

  return (
    <Card>
      <h2 className='mb-2 text-lg font-medium'>Data Explorer</h2>
      <div className='mb-3 flex flex-wrap gap-2'>
        {stationsQuery.data && stationsQuery.data.length > 0 && stationId ? (
          <select
            className='rounded border px-3 py-2'
            value={stationId}
            onChange={(event) => setStationId(event.target.value)}
          >
            {stationsQuery.data.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        ) : null}
        <select
          className='rounded border px-3 py-2'
          value={metricSet}
          onChange={(event) => setMetricSet(event.target.value as MetricSetKey)}
        >
          {(['CoreAQ', 'Meteo', 'Aethalometer'] as MetricSetKey[]).map((set) => (
            <option key={set} value={set}>
              {metricSetLabels[set]}
            </option>
          ))}
        </select>
        <select className='rounded border px-3 py-2' value={metric} onChange={(event) => setMetric(event.target.value)}>
          {metricOptions.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
        <Button variant='outline' onClick={exportCsv}>
          Export CSV
        </Button>
      </div>
      <div className='max-h-[420px] overflow-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Metric</th>
              <th>Value</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.timestamp}</td>
                <td>{row.metric}</td>
                <td>{row.value}</td>
                <td>{'horizonMinutes' in row ? `Prediction ${row.horizonMinutes}m` : 'Observation'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
