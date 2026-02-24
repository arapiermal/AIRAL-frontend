import { useMemo, useState } from 'react';
import { useAppState } from '@/app/providers';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useObservationsQuery, usePredictionsQuery } from '@/shared/hooks/useAirQueries';

export const ExplorerPage = () => {
  const { cityId, range } = useAppState();
  const [metric, setMetric] = useState('pm25');
  const obs = useObservationsQuery(cityId, range.from, range.to, [metric]);
  const pred = usePredictionsQuery(cityId, range.from, range.to, [metric], 60);

  const rows = useMemo(() => [...(obs.data ?? []), ...(pred.data ?? [])], [obs.data, pred.data]);

  const exportCsv = () => {
    const csv = [
      'timestamp,metric,value,type',
      ...rows.map(
        (r) =>
          `${r.timestamp},${r.metric},${r.value},${'horizonMinutes' in r ? 'prediction' : 'observation'}`
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airal-${cityId}-${metric}.csv`;
    a.click();
  };

  return (
    <Card>
      <h2 className='mb-2 text-lg font-medium'>Data Explorer</h2>
      <div className='mb-3 flex gap-2'>
        <select
          className='rounded border px-3 py-2'
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option value='pm25'>PM2.5</option>
          <option value='pm10'>PM10</option>
          <option value='temp'>Temperature</option>
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
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.timestamp}</td>
                <td>{r.metric}</td>
                <td>{r.value}</td>
                <td>{'horizonMinutes' in r ? `Prediction ${r.horizonMinutes}m` : 'Observation'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
