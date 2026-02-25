# AIRAL Frontend

React + Vite + TypeScript dashboard for air quality monitoring and prediction.

## Run

```bash
npm install
npm run dev
npm test
```

## Extending

- Add a city: update backend `/api/cities` or `citiesSeed` in mock mode.
- Add a metric: update backend `/api/metrics` or `metricsSeed`, then include in chart/table filters.
- Add map provider/layer: implement `MapProvider` in `src/shared/map/providers.ts` and pass it to `MapPanel`.
- Add chart panel: create a feature component and feed normalized `ChartSeries` into `TimeSeriesChart`.

## Deploy (Netlify)

- Commit `package-lock.json` so Netlify can run deterministic installs with npm.
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Configure environment variables in Netlify as needed: `VITE_MOCK`, `VITE_API_BASE_URL`, `VITE_WS_URL`
