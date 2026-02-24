import { PropsWithChildren } from 'react';
import { cn } from '@/shared/utils/cn';

export const Card = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <div className={cn('rounded-xl border border-border bg-card p-4', className)}>{children}</div>
);
