import { useParams } from 'next/navigation'

import { PlusIcon } from 'lucide-react'

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  TaskStatusEnumType,
  TaskStatusEnumTypeMap,
  TaskType,
} from '@/generated/apis/@types/data-contracts'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { theme } from '@/generated/theme-token'

import { useTaskModal } from '../../../../../hooks/use-task-modal'
import { TaskCard } from '../task-card'
import { TaskStatusBadge } from '../task-status-badge'

interface TaskAccordionColumnProps {
  status: TaskStatusEnumType
  tasks: TaskType[]
}

type StatusConfig = {
  bgColor: `bg-${keyof typeof theme}`
}

const STATUS_CONFIGS: Record<keyof typeof TaskStatusEnumTypeMap, StatusConfig> =
  {
    pending: {
      bgColor: 'bg-grey-1',
    },
    in_progress: {
      bgColor: 'bg-primary-1',
    },
    completed: {
      bgColor: 'bg-accent-green1',
    },
    issue: {
      bgColor: 'bg-accent-red1',
    },
  }

export const TaskAccordionColumn = ({
  status,
  tasks,
}: TaskAccordionColumnProps) => {
  const { slug } = useParams<{ slug: string }>()
  const { openTaskCreateModal } = useTaskModal()
  const { data: projectData } = useProjectRetrieveQuery({
    variables: {
      slug: slug,
    },
    options: {
      enabled: !!slug,
    },
  })
  const { isOwned, isShared } = projectData || {}

  const isReadOnly = !isOwned && isShared

  return (
    <AccordionItem value={'hi'} className="w-full border-none rounded-t-[6px]">
      <AccordionTrigger
        className={`w-full h-[62px] typo-pre-body-5 text-grey-10 border-none rounded-[12px] ${STATUS_CONFIGS[status].bgColor}`}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2 ">
            <TaskStatusBadge status={status} />
            <span className="typo-pre-body-6 text-grey-8">{tasks.length}</span>
          </div>

          <div className="flex gap-[6px]" onClick={(e) => e.stopPropagation()}>
            {status === 'pending' && !isReadOnly && (
              <Button
                className="w-full justify-start"
                variant={'ghost'}
                size={'sm'}
                onClick={() =>
                  openTaskCreateModal({
                    data: { projectName: '태스크 생성' },
                    onClose: () => {},
                  })
                }
              >
                <PlusIcon className="w-4 h-4 size-4" />
                태스크 생성
              </Button>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={`border-none rounded-b-[12px] ${STATUS_CONFIGS[status].bgColor} flex flex-col gap-2`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}
