import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { DatePreset, resolvePresetRange } from '@/shared/utils/date';

const queryClient = new QueryClient();

type AppState = {
  cityId: string;
  setCityId: (cityId: string) => void;
  stationId?: string;
  setStationId: (stationId: string | undefined) => void;
  range: { from: string; to: string; preset: DatePreset };
  setRangePreset: (preset: DatePreset) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [cityId, setCityIdState] = useState('tirana');
  const [stationId, setStationId] = useState<string | undefined>(undefined);
  const [preset, setPreset] = useState<DatePreset>('24h');
  const range = useMemo(() => ({ ...resolvePresetRange(preset), preset }), [preset]);

  const setCityId = (nextCityId: string) => {
    setCityIdState(nextCityId);
    setStationId(undefined);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateContext.Provider
        value={{ cityId, setCityId, stationId, setStationId, range, setRangePreset: setPreset }}
      >
        {children}
      </AppStateContext.Provider>
    </QueryClientProvider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppProviders');
  return context;
};
