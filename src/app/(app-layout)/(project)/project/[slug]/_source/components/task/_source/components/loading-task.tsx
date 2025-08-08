import { Skeleton } from '@/components/ui/skeleton'

export const LoadingTask = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto pt-[36px] pb-[80px] px-[20px] h-[100%] flex flex-col">
      <div className="flex gap-4 h-full">
        <Skeleton className="w-full min-h-[400px] rounded-[12px]" />
        <Skeleton className="w-full min-h-[400px] rounded-[12px]" />
        <Skeleton className="w-full min-h-[400px] rounded-[12px]" />
        <Skeleton className="w-full min-h-[400px] rounded-[12px]" />
      </div>
    </div>
  )
}
