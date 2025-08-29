'use client'

import { useParams } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { TaskStatusBadge } from '@/app/(app-layout)/(project)/project/[slug]/_source/components/task/_source/components/task-status-badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  TaskStatusEnumType,
  TaskStatusEnumTypeMap,
} from '@/generated/apis/@types/data-contracts'
import {
  QUERY_KEY_TASK_API,
  useProjectTaskPartialUpdateMutation,
  useProjectTaskRetrieveQuery,
} from '@/generated/apis/Task/Task.query'
import { toast } from '@/hooks/useToast'

export const TaskDetail = () => {
  const { slug, taskSlug } = useParams<{ slug: string; taskSlug: string }>()
  const qc = useQueryClient()

  const { data: task } = useProjectTaskRetrieveQuery({
    variables: {
      projectSlug: slug,
      slug: taskSlug,
    },
  })

  const { mutate: updateTask } = useProjectTaskPartialUpdateMutation({
    options: {
      onSuccess: (res) => {
        const { isAlarm, managerPhone, status } = res || {}
        qc.invalidateQueries({
          queryKey: QUERY_KEY_TASK_API.PROJECT_TASK_LIST({
            projectSlug: slug,
          }),
        })

        if (status) {
          toast(
            `태스크가 ${TaskStatusEnumTypeMap[status]} 상태로 변경되었어요.`,
            {
              action: {
                label: '닫기',
                onClick: () => {},
              },
            },
          )
        }
        if (isAlarm && managerPhone) {
          toast('진행 현황 변경 알림톡이 발송되었습니다.', {
            action: {
              label: '닫기',
              onClick: () => {},
            },
          })
        }
      },
    },
  })

  const { name, description, status, memo } = task || {}

  return (
    <div className="flex flex-col gap-[24px] h-screen sm:h-full overflow-y-auto sm:pb-[56px]">
      <div className="flex gap-[8px] items-center">
        <p className="typo-pre-heading-4 text-grey-9">{name}</p>
        {status && <TaskStatusBadge status={status} className="w-fit" />}
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className="typo-pre-body-5 text-grey-9">업무 상태</p>
        {status && (
          <Select
            onValueChange={(value) =>
              updateTask({
                projectSlug: slug,
                slug: taskSlug,
                data: { status: value as TaskStatusEnumType },
              })
            }
          >
            <SelectTrigger className="h-[48px]">
              <SelectValue placeholder={TaskStatusEnumTypeMap[status]} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TaskStatusEnumTypeMap).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
