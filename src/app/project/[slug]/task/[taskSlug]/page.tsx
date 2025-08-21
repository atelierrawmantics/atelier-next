import { BgDot } from '@/components/bg-dot'

import { TaskDetail } from './_source/components/task-detail'

export default function TaskPage() {
  return (
    <div className="w-full h-full sm:h-screen sm:pt-[20px] md:pt-[56px] md:pb-[80px]">
      <BgDot className="hidden sm:block" />
      <div className="px-0 sm:px-[20px] h-full">
        <div className="container h-full bg-background-basic-1 sm:rounded-[12px] py-[20px] px-[16px] w-full max-w-[1280px]">
          <TaskDetail />
        </div>
      </div>
    </div>
  )
}
