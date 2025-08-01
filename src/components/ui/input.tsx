import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva('w-full', {
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
      sm: 'h-[32px] px-[8px] typo-pre-caption-2 placeholder:typo-pre-caption-2',
      md: 'h-[40px] px-[10px] typo-pre-body-6 placeholder:typo-pre-body-6',
      lg: 'h-[48px] px-[12px] typo-pre-body-4 placeholder:typo-pre-body-4',
    },
  },
  defaultVariants: {
    variant: 'outline-grey',
    size: 'lg',
  },
})

// Root 컴포넌트 - 전체 Input 컨테이너
interface InputRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const InputRoot = React.forwardRef<HTMLDivElement, InputRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative flex items-center', className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
InputRoot.displayName = 'InputRoot'

// Field 컴포넌트 - 실제 input 요소
interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  variant?: VariantProps<typeof inputVariants>['variant']
  size?: VariantProps<typeof inputVariants>['size']
  hasRightElement?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, hasRightElement, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          inputVariants({ variant, size, className }),
          hasRightElement && 'pr-[40px]',
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

// RightElement 컴포넌트 - 오른쪽 요소
interface InputRightElementProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const InputRightElement = React.forwardRef<
  HTMLDivElement,
  InputRightElementProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'absolute right-[12px] flex items-center justify-center',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
InputRightElement.displayName = 'InputRightElement'

// 기존 Input 컴포넌트 (하위 호환성을 위해 유지)
interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  variant?: VariantProps<typeof inputVariants>['variant']
  size?: VariantProps<typeof inputVariants>['size']
  rightElement?: React.ReactNode
  wrapperClassName?: string
}

// function Input({
//   className,
//   type,
//   variant,
//   size,
//   rightElement,
//   wrapperClassName,
//   ...props
// }: InputProps) {
//   return (
//     <InputRoot className={wrapperClassName}>
//       <InputField
//         type={type}
//         variant={variant}
//         size={size}
//         hasRightElement={!!rightElement}
//         className={className}
//         {...props}
//       />
//       {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
//     </InputRoot>
//   )
// }

// 합성 컴포넌트로 export
export { Input, InputRoot, InputRightElement, inputVariants }
