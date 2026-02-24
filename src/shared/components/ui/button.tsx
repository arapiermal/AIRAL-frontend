import { ButtonHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const variants = cva('inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:opacity-90',
      outline: 'border border-border bg-background hover:bg-muted'
    }
  },
  defaultVariants: { variant: 'default' }
});

export const Button = ({ className, variant, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }) => (
  <button className={cn(variants({ variant }), className)} {...props} />
);
