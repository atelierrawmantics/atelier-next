import { ClassNameValue } from 'tailwind-merge'

import { FolderIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

interface SchematicMoProps {
  className?: ClassNameValue
}

export const SchematicMo = ({ className }: SchematicMoProps) => {
  return (
    <div
      className={cn(
        'container',
        'pt-[16px] sm:pt-[20px] md:pt-[36px]',
        'h-full',
        className,
      )}
    >
      <div
        className={cn(
          'bg-grey-0 w-full h-full rounded-[8px] flex flex-col justify-center items-center gap-[12px]',
        )}
      >
        <div className="flex justify-center items-center bg-primary-2 size-[56px] rounded-full">
          <FolderIcon className="text-secondary-3" />
        </div>
        <div className="text-center">
          <p className="text-grey-9 typo-pre-body-5">
            AI 도식화 생성 기능은 모바일에서 지원되지 않습니다.
          </p>
          <p className="text-grey-8 typo-pre-body-6">PC에서 이용해 주세요.</p>
        </div>
      </div>
    </div>
  )
}
