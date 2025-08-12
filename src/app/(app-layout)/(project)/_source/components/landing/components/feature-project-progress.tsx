import { useRef } from 'react'

import { useClientGSAP } from '@/hooks/useClientGSAP'
import {
  COMMON_FADE_STYLE,
  useCommonAnimation,
} from '@/hooks/useCommonAnimation'
import { cn } from '@/lib/utils'

import FeatureLayout from './components/feature-layout'

const FeatureProjectProgress = () => {
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
          type={'project-progress'}
          badgeText={'두 번째'}
          title={`실시간으로 확인하는\n작업 진행 현황`}
          description={`실시간으로 프로젝트 진행 상황을 확인할 수 있어요.\n누구나 최신 상태를 바로 파악하고 협업할 수 있습니다.`}
          bgUrl={"bg-[url('/images/landing/section3_2_content.png')]"}
          bgColor={'bg-[linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)]'}
        />
      </div>
    </section>
  )
}

export default FeatureProjectProgress
