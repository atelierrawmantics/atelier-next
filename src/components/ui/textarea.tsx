import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const textareaVariants = cva('w-full', {
  variants: {
    variant: {
      'outline-grey': cn(
        'rounded-[10px] border-1 border-grey-2 bg-grey-0 placeholder:text-grey-5 text-grey-8',
        'focus-visible:border-[1.5px] focus-visible:ring-0 focus-visible:border-primary-4',
        'aria-invalid:border-[1.5px] aria-invalid:ring-0 aria-invalid:border-accent-red2',
        'readonly:border-1 readonly:ring-0 readonly:border-grey-1',
        'disabled:border-1 disabled:ring-0 disabled:border-grey-2 disabled:opacity-[0.4] disabled:cursor-not-allowed',
      ),
    },
    size: {
      sm: 'min-h-[32px] px-[8px] py-[6px] typo-pre-caption-2 placeholder:typo-pre-caption-2',
      md: 'min-h-[40px] px-[10px] py-[8px] typo-pre-body-6 placeholder:typo-pre-body-6',
      lg: 'min-h-[48px] px-[12px] py-[10px] typo-pre-body-4 placeholder:typo-pre-body-4',
    },
  },
  defaultVariants: {
    variant: 'outline-grey',
    size: 'lg',
  },
})

interface TextareaProps extends Omit<React.ComponentProps<'textarea'>, 'size'> {
  variant?: VariantProps<typeof textareaVariants>['variant']
  size?: VariantProps<typeof textareaVariants>['size']
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(textareaVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
