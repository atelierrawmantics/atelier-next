import { Button, buttonVariants } from '@/components/ui/button'
import { CursorIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

interface CursorBoxProps {
  theme: 'hero' | 'work-order' | 'project-progress' | 'ar-diagram'
}

const GradientCursorIcon = ({ color }: { color: string }) => {
  return (
    <>
      <div
        className={cn('absolute inset-0', `bg-[${color}]`)}
        style={{
          WebkitMaskImage: 'url(/icons/Cursor.svg)',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
          maskImage: 'url(/icons/Cursor.svg)',
          maskRepeat: 'no-repeat',
          maskSize: '100% 100%',
        }}
      />
      <CursorIcon
        className={cn(
          'absolute inset-0',
          'w-[25px] sm:w-[32px] h-[30px] sm:h-[38px]',
          'text-transparent',
        )}
      />
    </>
  )
}

const HeroCursorBox = () => {
  return (
    <div
      className={cn(
        'absolute left-[80px] sm:left-[-63px] md:left-[-53px] top-[-63px] sm:top-[-76px] md:top-[-83px]',
        'h-[88px]',
        'flex',
      )}
    >
      {/* button */}
      <div className={cn('h-full', 'flex items-start')}>
        <div
          className={cn(
            'w-[98px] sm:w-[132px] md:w-[122px] h-[33px] sm:h-[41px] md:h-[38px]',
            'px-[12px] py-[8px]',
            'rounded-[6px]',
            buttonVariants({ variant: 'solid-primary' }),
            'cursor-text hover:cursor-text hover:bg-primary-4',
          )}
        >
          <p
            className={cn(
              'text-grey-0',
              'text-[12px] sm:text-[18px] md:text-[16px]',
            )}
            style={{
              fontFamily: 'DM Sans',
              fontWeight: '600',
              lineHeight: '140%',
              letterSpacing: '-0.12px',
            }}
          >
            {`Get Site Free`}
          </p>
        </div>
      </div>

      {/* cursor */}
      <div className={cn('h-full', 'flex items-end')}>
        <CursorIcon
          className={cn(
            'w-[25px] sm:w-[32px] h-[30px] sm:h-[38px]',
            'text-primary-3',
          )}
        />
      </div>
    </div>
  )
}

const WorkOrderCursorBox = () => {
  return (
    <div
      className={cn(
        'absolute right-0 sm:right-[70px] md:left-[-100px] bottom-[-48px] sm:bottom-[70px] md:bottom-[50px]',
        'w-fit h-[80px] md:h-[88px]',
        'flex flex-row-reverse md:flex-row',
      )}
    >
      {/* button */}
      <div className={cn('h-full', 'flex items-end')}>
        <div
          className={cn(
            'w-[128px] sm:w-[145px] h-[29px] sm:h-[32px]',
            'px-[12px] py-[8px]',
            'rounded-[6px]',
            'bg-[linear-gradient(220deg,#F1DDE0_-3.82%,#F9E4A6_102.79%)]',
            'shadow-[1px_1px_8px_0_rgba(27,28,29,0.80),1px_1px_8px_0_rgba(27,28,29,0.20)]',
            'inline-flex justify-center items-center',
          )}
        >
          <p
            className={cn('text-grey-10', 'text-[12px] sm:text-[14px]')}
            style={{
              fontFamily: 'DM Sans',
              fontWeight: '600',
              lineHeight: '140%',
              letterSpacing: '-0.12px',
            }}
          >
            {`Create Work Order`}
          </p>
        </div>
      </div>

      {/* cursor */}
      <div className={cn('h-full', 'flex items-start')}>
        <div
          className={cn(
            'relative',
            'w-[25px] sm:w-[32px] h-[30px] sm:h-[38px]',
            'rotate-[180deg] md:rotate-[-110deg]',
          )}
        >
          <GradientCursorIcon
            color={'linear-gradient(220deg,#F1DDE0_-3.82%,#F9E4A6_102.79%)'}
          />
        </div>
      </div>
    </div>
  )
}

const ProjectProgressCursorBox = () => {
  return (
    <div
      className={cn(
        'absolute right-0 sm:right-[70px] md:right-[34px] bottom-[-48px] sm:bottom-[70px] md:bottom-[30px]',
        'w-fit h-[80px]',
        'flex flex-row-reverse',
      )}
    >
      {/* button */}
      <div className={cn('h-full', 'flex items-end')}>
        <div
          className={cn(
            'w-[113px] sm:w-[129px] h-[29px] sm:h-[32px]',
            'px-[12px] py-[8px]',
            'rounded-[6px]',
            'bg-[linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)]',
            'shadow-[1px_1px_8px_0_rgba(27,28,29,0.80),1px_1px_8px_0_rgba(27,28,29,0.20)]',
            'inline-flex justify-center items-center',
          )}
        >
          <p
            className={cn('text-grey-10', 'text-[12px] sm:text-[14px]')}
            style={{
              fontFamily: 'DM Sans',
              fontWeight: '600',
              lineHeight: '140%',
              letterSpacing: '-0.12px',
            }}
          >
            {`Project Progress`}
          </p>
        </div>
      </div>

      {/* cursor */}
      <div className={cn('h-full', 'flex items-start')}>
        <div
          className={cn(
            'relative',
            'w-[25px] sm:w-[32px] h-[30px] sm:h-[38px]',
            'rotate-[180deg]',
          )}
        >
          <GradientCursorIcon
            color={'linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)'}
          />
        </div>
      </div>
    </div>
  )
}

const ArDiagramCursorBox = () => {
  return (
    <div
      className={cn(
        'absolute left-0 sm:left-[40px] md:left-[-50px] bottom-[-48px] sm:bottom-[245px] md:bottom-[130px]',
        'w-fit h-[80px]',
        'flex',
      )}
    >
      {/* button */}
      <div className={cn('h-full', 'flex items-end sm:items-start')}>
        <div
          className={cn(
            'w-[146px] sm:w-[167px] h-[29px] sm:h-[32px]',
            'px-[12px] py-[8px]',
            'rounded-[6px]',
            'bg-[linear-gradient(208deg,#DDEFE0_6.35%,#FFFAF9_103.74%)]',
            'shadow-[1px_1px_8px_0_rgba(27,28,29,0.80),1px_1px_8px_0_rgba(27,28,29,0.20)]',
            'inline-flex justify-center items-center',
          )}
        >
          <p
            className={cn('text-grey-10', 'text-[12px] sm:text-[14px]')}
            style={{
              fontFamily: 'DM Sans',
              fontWeight: '600',
              lineHeight: '140%',
              letterSpacing: '-0.12px',
            }}
          >
            {`AI Diagram Generator`}
          </p>
        </div>
      </div>

      {/* cursor */}
      <div className={cn('h-full', 'flex items-start sm:items-end')}>
        <div
          className={cn(
            'relative',
            'w-[25px] sm:w-[32px] h-[30px] sm:h-[38px]',
            'rotate-[-110deg] sm:rotate-0',
          )}
        >
          <GradientCursorIcon
            color={'linear-gradient(208deg,#DDEFE0_6.35%,#FFFAF9_103.74%)'}
          />
        </div>
      </div>
    </div>
  )
}

const CursorBox = ({ theme }: CursorBoxProps) => {
  if (theme === 'hero') {
    return <HeroCursorBox />
  }
  if (theme === 'work-order') {
    return <WorkOrderCursorBox />
  }
  if (theme === 'project-progress') {
    return <ProjectProgressCursorBox />
  }
  if (theme === 'ar-diagram') {
    return <ArDiagramCursorBox />
  }
  return null
}

export default CursorBox
