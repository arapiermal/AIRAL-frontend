import type { MetricDefinition, MetricSetKey } from '@/shared/domain/types';

export type MetricCatalogEntry = {
  key: string;
  label: string;
  unit: string;
  set: MetricSetKey;
  category: MetricDefinition['category'];
};

const metricSetMap: Record<MetricSetKey, string[]> = {
  CoreAQ: ['pm25', 'pm10'],
  Meteo: ['temp', 'rh', 'wind'],
  Aethalometer: ['abs_470', 'abs_520', 'abs_660']
};

export const metricSetLabels: Record<MetricSetKey, string> = {
  CoreAQ: 'Core AQ',
  Meteo: 'Meteo',
  Aethalometer: 'Aethalometer'
};

export const buildMetricCatalog = (definitions: MetricDefinition[]): MetricCatalogEntry[] =>
  definitions.map((definition) => ({
    key: definition.key,
    label: definition.label,
    unit: definition.unit,
    category: definition.category,
    set:
      (Object.entries(metricSetMap).find(([, members]) => members.includes(definition.key))?.[0] as
        | MetricSetKey
        | undefined) ?? 'CoreAQ'
  }));

export const metricsBySet = (catalog: MetricCatalogEntry[], set: MetricSetKey) =>
  catalog.filter((metric) => metric.set === set);

export const availableSets = (catalog: MetricCatalogEntry[], availableMetrics: string[]) => {
  const available = new Set(availableMetrics);
  return (Object.keys(metricSetMap) as MetricSetKey[]).filter((set) =>
    metricSetMap[set].some((metric) => available.has(metric) && catalog.some((item) => item.key === metric))
  );
};

export const hasMetricsForSet = (catalog: MetricCatalogEntry[], set: MetricSetKey, availableMetrics: string[]) => {
  const available = new Set(availableMetrics);
  return metricsBySet(catalog, set).some((entry) => available.has(entry.key));
};

export const recommendedGroups: Array<{ title: string; set: MetricSetKey }> = [
  { title: 'Core AQ', set: 'CoreAQ' },
  { title: 'Meteo', set: 'Meteo' },
  { title: 'Aethalometer', set: 'Aethalometer' }
];
