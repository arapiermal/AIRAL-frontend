import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ExplorerPage } from '@/features/explorer/ExplorerPage';
import { HealthPage } from '@/features/health/HealthPage';
import { AboutPage } from '@/features/about/AboutPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'explorer', element: <ExplorerPage /> },
      { path: 'health', element: <HealthPage /> },
      { path: 'about', element: <AboutPage /> }
    ]
  }
]);
