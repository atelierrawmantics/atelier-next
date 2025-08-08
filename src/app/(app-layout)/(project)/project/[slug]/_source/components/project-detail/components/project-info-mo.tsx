import { ClassNameValue } from 'tailwind-merge'

import { Button } from '@/components/ui/button'
import { FolderIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

interface ProjectInfoMoProps {
  className?: ClassNameValue
}

export const ProjectInfoMo = ({ className }: ProjectInfoMoProps) => {
  return (
    <div
      className={cn(
        'bg-grey-0 w-full h-full rounded-[8px] flex flex-col justify-center items-center gap-[12px]',
        className,
      )}
    >
      <div className="flex justify-center items-center bg-primary-2 size-[56px] rounded-full">
        <FolderIcon className="text-secondary-3" />
      </div>
      <div className="text-center">
        <p className="text-grey-9 typo-pre-body-5">
          모바일에서는 작업지시서 보기 기능을 지원하지 않습니다.
        </p>
        <p className="text-grey-8 typo-pre-body-6">
          PDF 파일을 다운로드한 후, 기기 내 ‘파일’ 앱에서 확인해 주세요.
        </p>
      </div>
      <Button size="sm" className="w-[106px]">
        PDF 다운로드
      </Button>
    </div>
  )
}
