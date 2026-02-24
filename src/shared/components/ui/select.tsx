import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = ({ children }: { children: ReactNode }) => (
  <SelectPrimitive.Trigger className='flex h-9 w-full items-center justify-between rounded-md border border-input px-3 text-sm'>
    {children}
    <ChevronDown className='h-4 w-4 opacity-50' />
  </SelectPrimitive.Trigger>
);

export const SelectContent = ({ children }: { children: ReactNode }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content className='overflow-hidden rounded-md border bg-card'>
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

export const SelectItem = ({ value, children }: { value: string; children: ReactNode }) => (
  <SelectPrimitive.Item className='cursor-pointer px-3 py-2 text-sm' value={value}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);
