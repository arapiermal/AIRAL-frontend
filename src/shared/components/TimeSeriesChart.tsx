import { Card } from '@/shared/components/ui/card';
import { EChartsAdapter } from '@/shared/chart/EChartsAdapter';
import type { ChartSeries } from '@/shared/chart/types';

export const TimeSeriesChart = ({ title, series }: { title: string; series: ChartSeries[] }) => (
  <Card>
    <h3 className='mb-3 font-medium'>{title}</h3>
    {series.length ? <EChartsAdapter series={series} /> : <p className='text-sm text-muted-foreground'>No data for selected filters.</p>}
  </Card>
);
