'use client'

import * as React from 'react'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { CircleIcon } from 'lucide-react'

import { RadioIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'border-input text-primary',
        'dark:bg-input/30 aspect-square size-[20px] shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'cursor-pointer',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <RadioIcon className="bg-primary-4 rounded-full absolute size-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
