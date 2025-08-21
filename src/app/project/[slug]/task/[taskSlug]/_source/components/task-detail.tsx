'use client'

import { useParams } from 'next/navigation'

import { TaskStatusBadge } from '@/app/(app-layout)/(project)/project/[slug]/_source/components/task/_source/components/task-status-badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useProjectTaskRetrieveQuery } from '@/generated/apis/Task/Task.query'

export const TaskDetail = () => {
  const { slug, taskSlug } = useParams<{ slug: string; taskSlug: string }>()

  const { data: task } = useProjectTaskRetrieveQuery({
    variables: {
      projectSlug: slug,
      slug: taskSlug,
    },
  })

  const { name, description, status, memo } = task || {}

  return (
    <div className="flex flex-col gap-[24px] h-screen sm:h-full overflow-y-auto sm:pb-[56px]">
      <p className="typo-pre-heading-4 text-grey-9">{name}</p>
      <div className="flex flex-col gap-[10px]">
        <p className="typo-pre-body-5 text-grey-9">업무 상태</p>
        {status && <TaskStatusBadge status={status} className="w-fit" />}
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="typo-pre-body-5 text-grey-9">태스크명</p>
        <Input variant="outline-grey" size="lg" value={name} readOnly />
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="typo-pre-body-5 text-grey-9">태스크 설명</p>
        <Textarea
          variant="outline-grey"
          size="lg"
          value={description}
          readOnly
          className="h-[200px] resize-none"
        />
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="typo-pre-body-5 text-grey-9">메모</p>
        <Textarea
          variant="outline-grey"
          size="lg"
          value={memo}
          readOnly
          className="h-[200px] resize-none"
        />
      </div>
    </div>
  )
}
