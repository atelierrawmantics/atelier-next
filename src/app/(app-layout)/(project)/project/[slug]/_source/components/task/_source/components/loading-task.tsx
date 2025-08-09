import { Skeleton } from '@/components/ui/skeleton'

export const LoadingTask = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto pt-[36px] pb-[80px] px-[20px] h-[100%] flex flex-col gap-5">
      <Skeleton className="w-full h-[65px] sm:h-[42px] md:hidden rounded-0" />
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <Skeleton className="w-full h-[62px] md:min-h-[400px] rounded-[12px]" />
        <Skeleton className="w-full h-[62px] md:min-h-[400px] rounded-[12px]" />
        <Skeleton className="w-full h-[62px] md:min-h-[400px] rounded-[12px]" />
        <Skeleton className="w-full h-[62px] md:min-h-[400px] rounded-[12px]" />
      </div>
    </div>
  )
}
