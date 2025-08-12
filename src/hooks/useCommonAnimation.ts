import { useCallback } from 'react'

import _gsap from 'gsap/gsap-core'

type TweenVars = gsap.TweenVars
type Position = gsap.Position

export const COMMON_FADE_STYLE =
  'opacity-0 translate-y-full [will-change:transform,opacity]'

export const useCommonAnimation = () => {
  const fadeContent = useCallback(
    (
      gsap: typeof _gsap,
      refs: (HTMLElement | null)[],
      vars?: TweenVars,
      position?: Position,
    ) => {
      // reset fade animation
      gsap.set([...refs], {
        opacity: 0,
        y: 100,
        clearProps: 'transform, opacity',
      })
      const tl = gsap.timeline()
      refs.forEach((ref) => {
        if (!ref) return
        tl.add(
          gsap.to(ref, {
            opacity: 1,
            yPercent: -100,
            ease: 'power2.out',
            duration: 0.6,
            overwrite: true,
            ...vars,
          }),
          position || '<+0.2',
        )
      })
      return tl
    },
    [],
  )

  const tlDelay = useCallback((length: number) => (length + 1) * 0.2, [])

  const titleTl = useCallback(
    (gsap: typeof _gsap, refs: (HTMLElement | null)[]) =>
      fadeContent(gsap, refs),
    [fadeContent],
  )
  const descriptionTl = useCallback(
    (gsap: typeof _gsap, ref: HTMLElement | null) =>
      fadeContent(gsap, [ref], {
        duration: 0.7,
      }),
    [fadeContent],
  )
  const contentTl = useCallback(
    (gsap: typeof _gsap, refs: (HTMLElement | null)[]) =>
      fadeContent(gsap, refs),
    [fadeContent],
  )

  return { fadeContent, tlDelay, titleTl, descriptionTl, contentTl }
}
