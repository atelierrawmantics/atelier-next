import { useCallback, useEffect, useState } from 'react'

import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import { Input, InputRightElement, InputRoot, inputVariants } from './input'

type InputProps = React.ComponentProps<'input'> &
  VariantProps<typeof inputVariants>

type VerificationInputProps = InputProps & {
  onTimerExpired?: () => void
  isTimerActive?: boolean
}

export const VerificationInput = ({
  onTimerExpired,
  isTimerActive = false,
  ...props
}: VerificationInputProps) => {
  const [timeLeft, setTimeLeft] = useState(180) // 3분 = 180초
  const [isActive, setIsActive] = useState(isTimerActive)

  // onTimerExpired 콜백을 메모이제이션
  const handleTimerExpired = useCallback(() => {
    onTimerExpired?.()
  }, [onTimerExpired])

  useEffect(() => {
    setIsActive(isTimerActive)
  }, [isTimerActive])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false)
            handleTimerExpired()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, timeLeft, handleTimerExpired])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <InputRoot className={cn(props.className)}>
      <Input
        {...props}
        className={cn(props.className)}
        hasRightElement
        maxLength={6}
        placeholder="인증번호 6자리"
      />
      <InputRightElement className="top-1/2 -translate-y-1/2">
        {isActive && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-grey-6">{formatTime(timeLeft)}</span>
          </div>
        )}
      </InputRightElement>
    </InputRoot>
  )
}
