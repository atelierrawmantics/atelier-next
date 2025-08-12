import Badge from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import CursorBox from './components/cursor-box'

const HeroBanner = () => {
  return (
    <section
      className={cn('w-full', 'px-[20px] sm:px-[40px] pt-[16px] pb-[40px]')}
    >
      <div
        className={cn(
          'w-full h-[676px] sm:h-[968px] md:h-[1000px]',
          'bg-[linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)]',
          'rounded-[24px] sm:rounded-[56px]',
          'overflow-hidden',
        )}
      >
        <div className="relative w-full h-full">
          {/* text */}
          <div
            className={cn(
              'w-full',
              'pt-[80px] px-[20px]',
              'flex flex-col items-center justify-center gap-[12px]',
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
                  'typo-pre-display-2 text-grey-10',
                  'text-center',
                  'whitespace-pre-line',
                  '[word-break:keep-all]',
                )}
              >
                {'패션 협업,\n아뜰리에 하나로\n통합합니다.'}
              </p>
              <p
                className={cn(
                  'hidden sm:block',
                  'typo-pre-display-2 text-grey-10',
                  'text-center',
                  'whitespace-pre-line',
                  '[word-break:keep-all]',
                )}
              >
                {'패션 협업,\n아뜰리에 하나로 통합합니다.'}
              </p>
            </div>
          </div>

          {/* image */}
          <div
            className={cn(
              'absolute',
              'bottom-[-20%] sm:bottom-[-2%] md:bottom-0 left-[40px] sm:left-[120px] md:left-[50%] md:translate-x-[-50%]',
              'h-[450px] sm:h-[618px] md:h-[40vw]',
              'max-h-[625px]',
              'aspect-[1280/625]',
              // repeat
              'bg-no-repeat',
              // size
              '[background-size:cover]',
              'md:[background-size:contain]',
              // position
              '[background-position:bottom_center]',
              "bg-[url('/images/landing/section1_content.png')]",
            )}
          >
            <CursorBox theme={'hero'} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
