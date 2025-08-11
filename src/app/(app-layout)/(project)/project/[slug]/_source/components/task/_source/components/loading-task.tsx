import { Skeleton } from '@/components/ui/skeleton'

export const LoadingTask = () => {
  return (
    <div className="w-full container mx-auto pt-[36px] pb-[80px] h-[100%] flex flex-col gap-5">
      <Skeleton className="w-full h-[65px] sm:h-[42px] md:hidden rounded-none" />
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <Skeleton className="w-full h-[62px] md:h-full rounded-[12px]" />
        <Skeleton className="w-full h-[62px] md:h-full rounded-[12px]" />
        <Skeleton className="w-full h-[62px] md:h-full rounded-[12px]" />
        <Skeleton className="w-full h-[62px] md:h-full rounded-[12px]" />
      </div>
    </div>
  )
}
