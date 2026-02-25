import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something unexpected happened while rendering this page.';

  return (
    <div className='p-4'>
      <Card>
        <h2 className='mb-2 text-lg font-medium'>Something went wrong</h2>
        <p className='text-sm text-muted-foreground'>{message}</p>
      </Card>
    </div>
  );
};
