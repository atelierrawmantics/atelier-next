import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'

import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap cursor-pointer pointer-events-auto transition-all disabled:cursor-not-allowed w-full hover:cursor-pointer',
  {
    variants: {
      variant: {
        'solid-primary':
          'bg-primary-4 text-grey-0 hover:bg-primary-5 focus-visible:bg-primary-5 disabled:bg-primary-4 disabled:opacity-[0.25]',
        'solid-grey':
          'bg-grey-2 text-grey-8 hover:bg-grey-3 focus-visible:bg-grey-3 disabled:bg-grey-2 disabled:opacity-[0.6]',
        'solid-red':
          'bg-accent-red2 text-grey-0 hover:bg-accent-red3 focus-visible:bg-accent-red3 disabled:bg-accent-red2 disabled:opacity-[0.25]',
        'outline-primary':
          'bg-grey-0 text-primary-4 border-1 border-primary-4 hover:bg-primary-1 focus-visible:bg-primary-1 disabled:bg-grey-0 disabled:opacity-[0.4]',
        'outline-grey':
          'bg-grey-0 text-grey-8 border-1 border-grey-2 hover:bg-grey-1 focus-visible:bg-grey-1 disabled:bg-grey-0 disabled:opacity-[0.4]',
        'outline-red':
          'bg-grey-0 text-accent-red2 border-1 border-accent-red2 hover:bg-accent-red1 focus-visible:bg-accent-red1 disabled:bg-grey-0 disabled:opacity-[0.4]',
        'ghost-primary':
          'bg-transparent text-primary-4 hover:bg-grey-transparent-1 focus-visible:bg-grey-transparent-1 disabled:bg-transparent disabled:opacity-[0.4]',
        'ghost-grey':
          'bg-transparent text-grey-8 hover:bg-grey-transparent-1 focus-visible:bg-grey-transparent-1 disabled:bg-transparent disabled:opacity-[0.4]',
        'ghost-red':
          'bg-transparent text-accent-red2 hover:bg-grey-transparent-1 focus-visible:bg-grey-transparent-1 disabled:bg-transparent disabled:opacity-[0.4]',
        ghost: 'size-fit p-0 rounded-none',
      },
      size: {
        sm: 'h-[30px] px-[10px] rounded-[6px] typo-pre-caption-1',
        md: 'h-[40px] px-[16px] rounded-[8px] typo-pre-body-3',
        lg: 'h-[48px] px-[24px] rounded-[10px] typo-pre-body-3',
        'icon-sm':
          'size-[32px] has-[>svg:not(.animate-spin)]:size-[16px] flex justify-center items-center rounded-full',
        'icon-md':
          'size-[40px] has-[>svg:not(.animate-spin)]:size-[24px] flex justify-center items-center rounded-full',
        'icon-lg':
          'size-[48px] has-[>svg:not(.animate-spin)]:size-[24px] flex justify-center items-center rounded-full',
        fit: 'size-fit p-0 rounded-none',
      },
    },
    defaultVariants: {
      variant: 'solid-primary',
      size: 'lg',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ?
        <Loader2Icon className="animate-spin" />
      : props.children}
    </Comp>
  )
}

export { Button, buttonVariants }
