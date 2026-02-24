import ReactECharts from 'echarts-for-react';
import type { ChartSeries } from '@/shared/chart/types';

export const EChartsAdapter = ({ series }: { series: ChartSeries[] }) => {
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    xAxis: { type: 'time' },
    yAxis: { type: 'value' },
    series: series.flatMap((s) => {
      const base = [{ name: s.name, type: 'line', showSymbol: false, connectNulls: false, data: s.data, color: s.color }];
      if (!s.areaBand) return base;
      return [
        ...base,
        { name: `${s.name} lower`, type: 'line', data: s.areaBand.lower, lineStyle: { opacity: 0 }, stack: s.name },
        { name: `${s.name} upper`, type: 'line', data: s.areaBand.upper, lineStyle: { opacity: 0 }, areaStyle: { opacity: 0.15 }, stack: s.name }
      ];
    })
  };

  return <ReactECharts option={option} style={{ height: 320 }} />;
};
