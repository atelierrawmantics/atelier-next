import { useRef } from 'react'

import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import Badge from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useClientGSAP } from '@/hooks/useClientGSAP'
import {
  COMMON_FADE_STYLE,
  useCommonAnimation,
} from '@/hooks/useCommonAnimation'
import { cn } from '@/lib/utils'

const GettingStart = () => {
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
    <section
      ref={containerRef}
      className={cn(
        'w-full max-w-[1280px]',
        'mx-[auto]',
        'px-[20px] sm:px-[40px] pb-[40px]',
        'overflow-hidden',
      )}
    >
      <div
        ref={contentRef}
        className={cn(
          'w-full',
          'px-[20px] sm:px-[40px] py-[80px] md:py-[120px]',
          'bg-[linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)]',
          'rounded-[40px]',
          'overflow-hidden',
          COMMON_FADE_STYLE,
        )}
      >
        <div className="relative w-full h-full">
          <div
            className={cn(
              'w-full',
              'flex flex-col items-center justify-center gap-[32px]',
            )}
          >
            {/* text section */}
            <div
              className={cn(
                'w-full',
                'flex flex-col items-center justify-center gap-[8px]',
              )}
            >
              <div>
                <Badge
                  text={'복잡한 협업, 이제 간단하게'}
                  textClassName={'type-pre-body-5 text-primary-3'}
                />
              </div>
              <div>
                <p
                  className={cn(
                    'block sm:hidden',
                    'typo-pre-display-3 text-grey-10',
                    'text-center',
                    'whitespace-pre-line',
                    '[word-break:keep-all]',
                  )}
                >
                  {`지시부터 공유,\n도식화까지.\n복잡했던 협업을 한 번에\n끝내보세요.`}
                </p>
                <p
                  className={cn(
                    'hidden sm:block',
                    'typo-pre-display-3 text-grey-10',
                    'text-center',
                    'whitespace-pre-line',
                    '[word-break:keep-all]',
                  )}
                >
                  {`지시부터 공유, 도식화까지.\n복잡했던 협업을 한 번에 끝내보세요.`}
                </p>
              </div>
            </div>

            {/* button section */}
            <div className={cn('w-full', 'flex items-center justify-center')}>
              <Button
                variant="solid-primary"
                className={cn('w-fit', 'px-[24px]')}
                asChild
              >
                <div className={cn('w-fit', 'flex gap-[8px]')}>
                  <Link href="/login">지금 아뜰리에 시작하기</Link>
                  <ArrowRight className="size-[24px]" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GettingStart
