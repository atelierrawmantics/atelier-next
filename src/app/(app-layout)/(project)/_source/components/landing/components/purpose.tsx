import Badge from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const Purpose = () => {
  return (
    <section
      className={cn(
        'w-full',
        'max-w-[1280px]',
        'px-[20px] sm:px-[40px] pt-[80px] sm:pt-[120px] pb-[120px]',
        'mx-auto',
        'bg-grey-0',
      )}
    >
      <div className="flex flex-col items-center justify-center gap-[28px] sm:gap-[16px]">
        {/* slogan */}
        <div className="flex flex-col items-center justify-center gap-[8px]">
          <Badge
            text={'디자이너가 CS까지?'}
            textClassName={'type-pre-body-5 text-grey-10'}
            badgeClassName={
              'border-none rounded-[4px] bg-[linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)]'
            }
          />
          <p
            className={cn(
              'block sm:hidden',
              'typo-pre-display-3 text-grey-10',
              'text-center',
              'whitespace-pre-line',
              '[word-break:keep-all]',
            )}
          >
            {`이제는 효율적으로\n바꿔보세요.`}
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
            {`이제는 효율적으로 바꿔보세요.`}
          </p>
        </div>

        {/* description */}
        <div className="w-full flex items-center justify-center">
          <p
            className={cn(
              'typo-pre-body-2 text-grey-9',
              'text-center',
              'whitespace-pre-line',
              '[word-break:keep-all]',
            )}
          >
            {`지시부터 공유까지, 반복 커뮤니케이션은 줄이고\n디자이너는 본업에 집중하세요.`}
          </p>
        </div>
      </div>
    </section>
  )
}

export default Purpose
