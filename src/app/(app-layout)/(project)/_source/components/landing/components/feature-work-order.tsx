import { useRef } from 'react'

import { useClientGSAP } from '@/hooks/useClientGSAP'
import {
  COMMON_FADE_STYLE,
  useCommonAnimation,
} from '@/hooks/useCommonAnimation'
import { cn } from '@/lib/utils'

import FeatureLayout from './components/feature-layout'

const FeatureWorkOrder = () => {
  const { contentTl } = useCommonAnimation()

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useClientGSAP(function fadeTextAnimation({
    gsap,
    ScrollTrigger,
    validateTargets,
  }) {
    if (!validateTargets(containerRef.current, contentRef.current)) return
    if (!(ScrollTrigger && gsap)) return

    const tl = gsap.timeline({ autoRemoveChildren: true, paused: true })
    tl.add(contentTl(gsap, [contentRef.current]), '<+0.2')

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: `top 85%`,
      end: 'bottom top',
      onEnter() {
        tl.play()
      },
    })
  }, [])

  return (
    <section ref={containerRef}>
      <div ref={contentRef} className={cn(COMMON_FADE_STYLE)}>
        <FeatureLayout
          badgeText={'첫 번째'}
          title={`쉽고 정확한 작업지시서\n작성과 공유`}
          description={`누구나 이해할 수 있게 작업지시서를 구조화해보세요.\n오류와 누락 없이 정확하게 전달됩니다.`}
          bgUrl={"bg-[url('/images/landing/section3_1_content.png')]"}
          bgColor={
            'bg-[linear-gradient(220deg,#F1DDE0_-3.82%,rgba(249,228,166,0.15)_102.79%)]'
          }
        />
      </div>
    </section>
  )
}

export default FeatureWorkOrder
