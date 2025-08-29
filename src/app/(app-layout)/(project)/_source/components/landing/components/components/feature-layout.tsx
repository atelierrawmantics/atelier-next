import Badge from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import CursorBox from './cursor-box'

interface FeatureLayoutProps {
  type: 'work-order' | 'project-progress' | 'ar-diagram'
  badgeText: string
  title: string
  description: string
  bgUrl: string
  bgColor: string
}

const FeatureLayout = ({
  type,
  badgeText,
  title,
  description,
  bgUrl,
  bgColor,
}: FeatureLayoutProps) => {
  return (
    <div
      className={cn(
        'w-full',
        'max-w-[1280px]',
        'px-[20px] sm:px-[40px] pb-[80px] sm:pb-[120px]',
        'mx-auto',
        'bg-grey-0',
      )}
    >
      <div
        className={cn(
          'flex flex-col md:flex-row',
          'items-center md:items-start justify-center',
          'gap-[36px] sm:gap-[56px] md:gap-[36px]',
        )}
      >
        {/* text section */}
        <section className="w-full flex flex-col items-center justify-center gap-[16px] sm:gap-[24px]">
          {/* slogan */}
          <div className="w-full flex flex-col items-center sm:items-start justify-center gap-[8px]">
            <Badge
              text={badgeText}
              textClassName={'type-pre-caption-1 text-grey-10'}
              badgeClassName={
                'py-0 border-none rounded-[4px] bg-background-basic-4'
              }
            />
            <p
              className={cn(
                'typo-pre-display-3 text-grey-10',
                'text-center sm:text-left',
                'whitespace-pre-line',
                '[word-break:keep-all]',
              )}
            >
              {title}
            </p>
          </div>

          {/* description */}
          <div className="w-full flex items-center justify-center sm:justify-start">
            <p
              className={cn(
                'typo-pre-body-2 text-grey-9',
                'text-center sm:text-left',
                'whitespace-pre-line',
                '[word-break:keep-all]',
              )}
            >
              {description}
            </p>
          </div>
        </section>

        {/* image section */}
        <section className="w-full pb-[48px] sm:pb-0">
          <div className={cn('relative')}>
            <div
              className={cn(
                'relative',
                'w-full',
                'aspect-[335/260]',
                'pl-[30px] sm:pl-[80px] pt-[43px] sm:pt-[80px]',
                'flex flex-col items-end justify-end',
                'rounded-[24px] sm:rounded-[40px]',
                'overflow-hidden',
                bgColor,
              )}
              style={{
                boxShadow: '-4px -10px 8px 0 rgba(23, 23, 23, 0.02) inset',
              }}
            >
              <div
                className={cn(
                  'relative right-[-5px]',
                  'w-full',
                  'aspect-[620/440]',
                  // repeat
                  'bg-no-repeat',
                  // size
                  '[background-size:contain]',
                  // position
                  '[background-position:bottom_center]',
                  bgUrl,
                )}
              />
            </div>
            <CursorBox theme={type} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default FeatureLayout
