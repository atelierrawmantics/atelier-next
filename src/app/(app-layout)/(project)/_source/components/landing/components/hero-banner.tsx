import Image from 'next/image'

import Badge from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import CursorBox from './components/cursor-box'

const BannerPC = () => {
  return (
    <div
      className={cn(
        'relative',
        'hidden md:block',
        'w-full max-w-[1280px]',
        'aspect-[1280/625]',
      )}
    >
      <CursorBox theme={'hero'} />
      <div
        className={cn(
          'w-full h-full',
          'flex gap-[16px] justify-center items-end',
        )}
      >
        {/* left */}
        <div
          className={cn(
            'relative',
            'flex-7 h-full',
            'aspect-[859/625]',
            'rounded-t-[20px]',
            'overflow-hidden',
            'shadow-[0_20px_80px_0_rgba(27,28,29,0.04),0_4px_10px_0_rgba(27,28,29,0.04)]',
          )}
        >
          <Image
            fill
            className={cn('object-cover')}
            src={'/images/landing/section1_content_pc_1.png'}
            alt={'hero banner'}
            priority
            loading="eager"
          />
        </div>

        {/* right */}
        <div
          className={cn(
            'flex-3 h-full',
            'pb-[30px]',
            'flex flex-col gap-[12px] items-end',
          )}
        >
          {/* right-top */}
          <div
            className={cn(
              'relative',
              'w-full',
              'aspect-[405/552]',
              'rounded-[20px]',
              'overflow-hidden',
              'shadow-[0_20px_80px_0_rgba(27,28,29,0.04),0_4px_10px_0_rgba(27,28,29,0.04)]',
            )}
          >
            <Image
              fill
              className={cn('object-cover')}
              src={'/images/landing/section1_content_pc_2.png'}
              alt={'hero banner'}
              priority
              loading="eager"
            />
          </div>

          {/* right-bottom */}
          <div
            className={cn(
              'relative',
              'h-full max-h-[30px]',
              'aspect-[106/30]',
              'rounded-[6px]',
              'overflow-hidden',
              'shadow-[0_20px_80px_0_rgba(27,28,29,0.04),0_4px_10px_0_rgba(27,28,29,0.04)]',
            )}
          >
            <Image
              fill
              className={cn('object-cover')}
              src={'/images/landing/section1_content_pc_3.png'}
              alt={'hero banner'}
              priority
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const BannerTab = () => {
  return (
    <div
      className={cn(
        'relative',
        'hidden sm:block md:hidden',
        'w-full',
        'aspect-[569/619]',
      )}
    >
      <CursorBox theme={'hero'} />
      <div
        className={cn(
          'w-full h-full',
          'flex gap-[16px] justify-center items-end',
        )}
      >
        <div
          className={cn(
            'relative',
            'flex-1 h-full',
            'aspect-[569/619]',
            'rounded-tl-[20px]',
            'overflow-hidden',
            'shadow-[0_20px_80px_0_rgba(27,28,29,0.04),0_4px_10px_0_rgba(27,28,29,0.04)]',
          )}
        >
          <Image
            fill
            className={cn('object-cover')}
            src={'/images/landing/section1_content_tab.png'}
            alt={'hero banner'}
            priority
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}

const BannerMobile = () => {
  return (
    <div
      className={cn(
        'relative',
        'block sm:hidden',
        'w-full',
        'aspect-[298/325]',
      )}
    >
      <CursorBox theme={'hero'} />
      <div
        className={cn(
          'w-full h-full',
          'flex gap-[16px] justify-center items-end',
        )}
      >
        <div
          className={cn(
            'relative',
            'flex-1 h-full',
            'aspect-[298/325]',
            'rounded-tl-[20px]',
            'overflow-hidden',
            'shadow-[0_20px_80px_0_rgba(27,28,29,0.04),0_4px_10px_0_rgba(27,28,29,0.04)]',
          )}
        >
          <Image
            fill
            className={cn('object-cover')}
            src={'/images/landing/section1_content_mo.png'}
            alt={'hero banner'}
            priority
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}

const HeroBanner = () => {
  return (
    <section
      className={cn('w-full', 'px-[20px] sm:px-[40px] pt-[16px] pb-[40px]')}
    >
      <div
        className={cn(
          'w-full h-fit',
          'bg-[linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)]',
          'rounded-[24px] sm:rounded-[56px]',
          'overflow-hidden',
        )}
      >
        <div
          className={cn(
            'hero-content-wrapper',
            'relative',
            'w-full',
            'flex flex-col justify-between align-center gap-[82px] sm:gap-[108px] md:gap-[60px]',
          )}
        >
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
              'w-full',
              'pl-[11%] sm:pl-[17.2%] md:px-[14.5%]',
              'flex flex-col justify-end',
            )}
          >
            <BannerPC />
            <BannerTab />
            <BannerMobile />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
