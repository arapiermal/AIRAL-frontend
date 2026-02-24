# AIRAL Frontend

React + Vite + TypeScript dashboard for air quality monitoring and prediction.

## Run

```bash
pnpm install
pnpm dev
pnpm test
```

## Extending

- Add a city: update backend `/api/cities` or `citiesSeed` in mock mode.
- Add a metric: update backend `/api/metrics` or `metricsSeed`, then include in chart/table filters.
- Add map provider/layer: implement `MapProvider` in `src/shared/map/providers.ts` and pass it to `MapPanel`.
- Add chart panel: create a feature component and feed normalized `ChartSeries` into `TimeSeriesChart`.
