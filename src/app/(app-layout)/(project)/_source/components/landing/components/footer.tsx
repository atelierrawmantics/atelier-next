import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { LOGOIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

const Footer = () => {
  return (
    <div
      className={cn(
        'w-full',
        'pt-[20px] sm:pt-[36px] pb-[36px] sm:pb-[28px]',
        'px-[20px] sm:px-[40px]',
        'border-t-1 border-grey-transparent-2',
      )}
    >
      <div
        className={cn(
          'w-full h-full max-w-[1280px] mx-auto',
          'flex flex-col items-center justify-between gap-[32px] sm:gap-[56px]',
        )}
      >
        <div
          className={cn(
            'w-full h-full',
            'flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between gap-[32px] sm:gap-0',
          )}
        >
          {/* logo & description */}
          <div
            className={cn(
              'w-full h-full max-w-[1280px] mx-auto',
              'flex flex-col gap-[6px]',
            )}
          >
            <LOGOIcon className="w-[80px] sm:w-[100px] h-[20px] sm:h-[24px] my-[4px]" />
            <p className={cn('typo-pre-body-6 text-grey-9')}>
              {`패션 협업, 아뜰리에 하나로 통합합니다.`}
            </p>
          </div>

          {/* button */}
          <div>
            <Button
              variant="solid-grey"
              size="lg"
              className="w-fit hidden sm:block"
            >
              <Link href="/login">
                <p className={cn('typo-pre-body-3 text-grey-8')}>
                  {'Sign up for free'}
                </p>
              </Link>
            </Button>
            <Button
              variant="solid-grey"
              size="md"
              className="w-fit block sm:hidden"
            >
              <Link href="/login">
                <p className={cn('typo-pre-body-3 text-grey-8')}>
                  {'Sign up for free'}
                </p>
              </Link>
            </Button>
          </div>
        </div>

        {/* copyright */}
        <div className={cn('w-full')}>
          <p className={cn('typo-pre-caption-2 text-grey-7')}>
            {'COPYRIGHT 2025 Atelier. ALL RIGHTS RESERVED'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
