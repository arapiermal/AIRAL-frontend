import { Link, NavLink, Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';
import { useMetaQuery } from '@/shared/hooks/useAirQueries';

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/explorer', label: 'Explorer' },
  { to: '/health', label: 'Health' },
  { to: '/about', label: 'About' }
];

export const AppLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const meta = useMetaQuery();

  return (
    <div className='min-h-screen md:grid md:grid-cols-[220px_1fr]'>
      <aside className='hidden border-r p-4 md:block'>
        <Link to='/' className='mb-6 block text-xl font-semibold'>
          AIRAL
        </Link>
        <nav className='space-y-2'>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className='block rounded px-3 py-2 hover:bg-muted'>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className='pb-16 md:pb-0'>
        <header className='flex items-center justify-between border-b p-4'>
          <h1 className='font-semibold'>Air Quality Monitoring & Prediction</h1>
          <button onClick={toggleTheme}>{theme === 'light' ? <Moon /> : <Sun />}</button>
        </header>
        <div className='p-4'>
          <Outlet />
        </div>
        <footer className='border-t p-4 text-xs text-muted-foreground'>
          {meta.data ? `${meta.data.appVersion} · ${meta.data.environment}` : 'Version metadata unavailable'}
        </footer>
      </main>
      <nav className='fixed bottom-0 left-0 right-0 flex border-t bg-background md:hidden'>
        {nav.map((item) => (
          <NavLink key={item.to} to={item.to} className='flex-1 p-3 text-center text-sm'>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
