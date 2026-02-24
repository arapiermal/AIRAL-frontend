import { useAppState } from '@/app/providers';
import { Card } from '@/shared/components/ui/card';
import { useHealthQuery } from '@/shared/hooks/useAirQueries';
import { summarizeHealth } from '@/features/health/healthDomain';

export const HealthPage = () => {
  const { cityId, range } = useAppState();
  const health = useHealthQuery(cityId, range.from, range.to);

  if (health.isLoading) return <p>Loading health...</p>;
  if (health.error || !health.data) return <p>Unable to load health status.</p>;

  return <div className='grid gap-3 md:grid-cols-2'>
    {summarizeHealth(health.data).map((item) => <Card key={item.label}><p className='text-sm text-muted-foreground'>{item.label}</p><p className='text-2xl font-semibold'>{item.value}</p></Card>)}
    <Card className='md:col-span-2'><p className='text-sm'>Data freshness: {new Date(health.data.lastSeenAt).toLocaleString()}</p></Card>
  </div>;
};
