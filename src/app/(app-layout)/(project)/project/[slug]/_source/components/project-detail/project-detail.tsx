import { cn } from '@/lib/utils'

import { ProjectInfo } from './components/project-info'
import { ProjectInfoForm } from './components/project-info-form'

export const ProjectDetail = () => {
  return (
    <div
      className={cn(
        'flex justify-end md:justify-center items-start gap-[16px] flex-col-reverse md:flex-row',
        'container',
        'w-full h-full pt-[16px] sm:pt-[20px] md:pt-[36px]',
      )}
    >
      <ProjectInfoForm />
      <ProjectInfo />
    </div>
  )
}
