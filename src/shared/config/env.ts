const bool = (value: string | undefined, fallback = false) =>
  value ? value.toLowerCase() === 'true' : fallback;

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  wsUrl: import.meta.env.VITE_WS_URL ?? '/ws',
  mock: bool(import.meta.env.VITE_MOCK, true),
  realtime: bool(import.meta.env.VITE_REALTIME, false)
};
