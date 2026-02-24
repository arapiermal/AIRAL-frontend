import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { DatePreset, resolvePresetRange } from '@/shared/utils/date';

const queryClient = new QueryClient();

type AppState = {
  cityId: string;
  setCityId: (cityId: string) => void;
  range: { from: string; to: string; preset: DatePreset };
  setRangePreset: (preset: DatePreset) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [cityId, setCityId] = useState('tirana');
  const [preset, setPreset] = useState<DatePreset>('24h');
  const range = useMemo(() => ({ ...resolvePresetRange(preset), preset }), [preset]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateContext.Provider value={{ cityId, setCityId, range, setRangePreset: setPreset }}>
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
