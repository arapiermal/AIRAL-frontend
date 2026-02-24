import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { AppProviders } from '@/app/providers';
import { ThemeProvider } from '@/shared/hooks/useTheme';

export const App = () => (
  <ThemeProvider>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </ThemeProvider>
);
