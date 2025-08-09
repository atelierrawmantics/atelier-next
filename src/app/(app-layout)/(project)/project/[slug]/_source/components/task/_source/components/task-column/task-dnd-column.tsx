'use client'

import { useDroppable } from '@dnd-kit/core'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  TaskStatusEnumType,
  TaskStatusEnumTypeMap,
  TaskType,
} from '@/generated/apis/@types/data-contracts'
import { theme } from '@/generated/theme-token'

import { useTaskModal } from '../../../../../hooks/use-task-modal'
import { DragColumnData } from '../../../../../utils/dnd'
import { TaskCard } from '../task-card'
import { TaskStatusBadge } from '../task-status-badge'

interface TaskColumnProps {
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

export const TaskDndColumn = ({ status, tasks }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: status,
    data: { type: 'column', status } satisfies DragColumnData,
  })

  const { openTaskCreateModal } = useTaskModal()

  const config = STATUS_CONFIGS[status]

  return (
    <div
      ref={setNodeRef}
      className={`hidden md:flex flex-col max-w-[308px] items-center border border-border-basic-1 rounded-[12px] ${config.bgColor} w-full gap-3 min-h-[400px] transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 w-full p-4 pb-3">
        <TaskStatusBadge status={status} />
        <span className="typo-pre-body-6 text-grey-8">{tasks.length}</span>
      </div>

      {/* Task Cards */}
      <div className="flex flex-col gap-2 w-full px-4 pb-4 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {status === 'pending' && (
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
  )
}
