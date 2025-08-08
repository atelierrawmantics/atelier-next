'use client'

import { useEffect, useState } from 'react'

import { throttle } from 'lodash-es'

interface UseDrawerOptions {
  closeOnResize?: boolean
  resizeBreakpoint?: number
  resizeThrottleMs?: number
}

export const useDrawerAutoClose = (options: UseDrawerOptions = {}) => {
  const {
    closeOnResize = true,
    resizeBreakpoint = 1440,
    resizeThrottleMs = 200,
  } = options

  const [open, setOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleOpenChange = (v: boolean) => {
    if (isAnimating) return
    setOpen(v)
    setIsAnimating(true)
  }

  const handleAnimationEnd = () => {
    setIsAnimating(false)
  }

  // 화면 크기 변경 시 drawer 닫기 (옵션)
  useEffect(() => {
    if (!closeOnResize) return

    const handleResize = throttle(() => {
      if (window.innerWidth <= resizeBreakpoint && open) {
        setOpen(false)
      }
    }, resizeThrottleMs)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      handleResize.cancel()
    }
  }, [open, closeOnResize, resizeBreakpoint, resizeThrottleMs])

  return {
    open,
    setOpen,
    isAnimating,
    handleOpenChange,
    handleAnimationEnd,
  }
}
