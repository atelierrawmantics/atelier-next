import { ClassNameValue } from 'tailwind-merge'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// 스켈레톤 컴포넌트들
interface AccordionItemSkeletonProps {
  className?: ClassNameValue
}

const AccordionItemSkeleton = ({ className }: AccordionItemSkeletonProps) => (
  <div className={cn('border-b border-t border-border-basic-1', className)}>
    <div className="h-[62px] flex items-center justify-between px-[20px]">
      <Skeleton className="w-32 h-5" />
      <div className="flex gap-2">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-16 h-8" />
      </div>
    </div>
  </div>
)

const InputFieldSkeleton = () => (
  <div className="flex gap-[55px]">
    <Skeleton className="w-[60px] h-4" />
    <Skeleton className="w-full h-10" />
  </div>
)

const ImageUploadAreaSkeleton = () => (
  <div className="w-full flex flex-col items-center justify-center gap-[12px] py-[40px]">
    <Skeleton className="size-[56px] rounded-full" />
    <div className="flex flex-col items-center justify-center">
      <Skeleton className="w-64 h-5 mb-2" />
      <Skeleton className="w-80 h-4 mb-2" />
      <Skeleton className="w-32 h-3" />
    </div>
  </div>
)

export const ProjectInfoFormSkeleton = () => (
  <div className="max-w-full md:max-w-[859px] w-full hidden sm:block">
    <div className="w-full rounded-[6px] border-l border-r border-border-basic-1 border-b bg-background-basic-1">
      {/* 시즌 및 스타일 정보 섹션 */}
      <AccordionItemSkeleton className="rounded-t-[6px]" />
      <div className="p-[20px]">
        <div className="flex flex-col gap-[8px]">
          {Array.from({ length: 6 }, (_, index) => (
            <InputFieldSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* 도식화 이미지 섹션 */}
      <AccordionItemSkeleton />
      <div className="p-[20px]">
        <ImageUploadAreaSkeleton />
      </div>
    </div>
  </div>
)
