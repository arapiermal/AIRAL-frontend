import { useAppState } from '@/app/providers';
import { Card } from '@/shared/components/ui/card';
import { useHealthQuery, useMetaQuery } from '@/shared/hooks/useAirQueries';
import { summarizeHealth } from '@/features/health/healthDomain';

export const HealthPage = () => {
  const { cityId, stationId, range } = useAppState();
  const health = useHealthQuery(cityId, stationId, range.from, range.to);
  const meta = useMetaQuery();

  if (health.isLoading || meta.isLoading) return <p>Loading health...</p>;
  if (health.error || !health.data || meta.error || !meta.data) return <p>Unable to load health status.</p>;

  return (
    <div className='grid gap-3 md:grid-cols-2'>
      {summarizeHealth(health.data).map((item) => (
        <Card key={item.label}>
          <p className='text-sm text-muted-foreground'>{item.label}</p>
          <p className='text-2xl font-semibold'>{item.value}</p>
        </Card>
      ))}
      <Card className='md:col-span-2'>
        <p className='text-sm'>Data freshness: {new Date(health.data.lastSeenAt).toLocaleString()}</p>
      </Card>
      <Card className='md:col-span-2'>
        <h3 className='mb-2 font-medium'>Meta</h3>
        <p className='text-sm'>App version: {meta.data.appVersion}</p>
        <p className='text-sm'>Schema version: {meta.data.schemaVersion}</p>
        <p className='text-sm'>Model version: {meta.data.modelVersion}</p>
        <p className='text-sm'>Cadence: {meta.data.dataCadenceSeconds}s</p>
        <p className='text-sm'>Environment: {meta.data.environment}</p>
      </Card>
    </div>
  );
};
