import { RefObject, useCallback } from 'react'

import { useGSAP } from '@gsap/react'

import _ScrollTrigger from 'gsap/ScrollTrigger'
import _gsap from 'gsap/gsap-core'

import { useClient } from './useClient'
import useResize from './useResize'

export const validateTargets = (
  ...targets: (RefObject<any> | Element | null | undefined)[]
): boolean => {
  return targets.every((target) => {
    if (!target) return false
    if ('current' in target) return target.current !== null
    return target !== null
  })
}

interface UseClientGSAPProps {
  gsap: typeof _gsap
  ScrollTrigger?: typeof _ScrollTrigger
  validateTargets: typeof validateTargets
}

export const useClientGSAP = (
  callback: ({
    gsap,
    ScrollTrigger,
    validateTargets,
  }: UseClientGSAPProps) => void | Promise<void>,
  deps: any[],
) => {
  const isClient = useClient()
  const { screenW } = useResize()

  const importGSAP = useCallback(async () => {
    const gsap = (await import('gsap')).default
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    const { ScrollToPlugin } = await import('gsap/ScrollToPlugin')

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
    gsap.config({ nullTargetWarn: false })

    return { gsap, ScrollTrigger, ScrollToPlugin }
  }, [])

  return useGSAP(async () => {
    if (!isClient) return
    const { gsap, ScrollTrigger } = await importGSAP()

    ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
      type: 'wheel',
      momentum: 0,
    })
    ScrollTrigger.config({ ignoreMobileResize: true })

    await callback({ gsap, ScrollTrigger, validateTargets })
  }, [isClient, screenW, ...deps])
}
