import { useEffect, useState } from 'react'

import { debounce } from 'lodash'

const useResize = () => {
  const [screenSize, setScreenSize] = useState({ screenW: 0, screenH: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    function updateViewportSize() {
      const vw = innerWidth * 0.01
      const vh = innerHeight * 0.01
      document.documentElement.style.setProperty('--vw', `${vw}px`)
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      const result = { screenW: vw * 100, screenH: vh * 100 }
      setScreenSize(result)
      return result
    }

    updateViewportSize()
    const debouncedUpdateViewportSize = debounce(updateViewportSize, 100)
    window.addEventListener('resize', debouncedUpdateViewportSize)
    return () =>
      window.removeEventListener('resize', debouncedUpdateViewportSize)
  }, [])

  return screenSize
}

export default useResize
