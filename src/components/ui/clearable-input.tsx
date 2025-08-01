import { useState } from 'react'

import { type VariantProps } from 'class-variance-authority'

import { XIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

import { Input, InputRightElement, InputRoot, inputVariants } from './input'

type InputProps = React.ComponentProps<'input'> &
  VariantProps<typeof inputVariants>

type ClearableInputProps = InputProps & {
  onClear?: () => void
}

export const ClearableInput = ({
  onClear,
  value,
  onChange,
  ...props
}: ClearableInputProps) => {
  const [internalValue, setInternalValue] = useState(value || '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    onClear?.()

    const syntheticEvent = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>
    onChange?.(syntheticEvent)
  }

  const showClearButton = currentValue && !props.disabled && !props.readOnly

  return (
    <InputRoot className={cn(props.className)}>
      <Input
        {...props}
        value={currentValue}
        onChange={handleChange}
        className={cn(props.className)}
        hasRightElement
      />
      {showClearButton && (
        <InputRightElement className="top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'cursor-pointer',
              'size-[20px] rounded-full',
              'flex items-center justify-center',
              'bg-grey-2 hover:bg-grey-2 transition-colors',
              'text-grey-6 hover:text-grey-7',
              'focus:outline-none focus:ring-2 focus:ring-primary-4 focus:ring-offset-1',
            )}
            aria-label="입력값 지우기"
          >
            <XIcon className="size-[12px] text-grey-7" />
          </button>
        </InputRightElement>
      )}
    </InputRoot>
  )
}
