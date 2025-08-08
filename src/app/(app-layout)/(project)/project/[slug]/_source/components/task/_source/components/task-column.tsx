'use client'

import React from 'react'

import { useDroppable } from '@dnd-kit/core'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  TaskStatusEnumType,
  TaskStatusEnumTypeMap,
  TaskType,
} from '@/generated/apis/@types/data-contracts'
import { theme } from '@/generated/theme-token'

import { useTaskModal } from '../../../../hooks/use-task-modal'
import { DragColumnData } from '../../../../utils/dnd'
import { TaskCard } from './task-card'

interface TaskColumnProps {
  status: TaskStatusEnumType
  tasks: TaskType[]
}

type StatusConfig = {
  label: string
  labelBgColor: `bg-${keyof typeof theme}`
  bgColor: `bg-${keyof typeof theme}`
  statusColor: `bg-${keyof typeof theme}`
  textColor: `text-${keyof typeof theme}`
}

const statusConfigs: Record<keyof typeof TaskStatusEnumTypeMap, StatusConfig> =
  {
    pending: {
      label: '진행전',
      labelBgColor: 'bg-background-basic-3',
      bgColor: 'bg-grey-1',
      statusColor: 'bg-grey-8',
      textColor: 'text-grey-8',
    },
    in_progress: {
      label: '진행중',
      bgColor: 'bg-primary-1',
      labelBgColor: 'bg-accent-blue1',
      statusColor: 'bg-accent-blue2',
      textColor: 'text-accent-blue2',
    },
    completed: {
      label: '진행완료',
      bgColor: 'bg-accent-green1',
      labelBgColor: 'bg-accent-green2',
      statusColor: 'bg-accent-green3',
      textColor: 'text-accent-green3',
    },
    issue: {
      label: '이슈',
      bgColor: 'bg-accent-red1',
      labelBgColor: 'bg-accent-red1',
      statusColor: 'bg-accent-red2',
      textColor: 'text-accent-red2',
    },
  }

export const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: status,
    data: { type: 'column', status } satisfies DragColumnData,
  })

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
  )

  const { openTaskCreateModal } = useTaskModal()

  const config = statusConfigs[status]

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col max-w-[308px] items-center border border-border-basic-1 rounded-[12px] ${config.bgColor} w-full gap-3 min-h-[400px] transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 w-full p-4 pb-3">
        <div
          className={`flex items-center justify-center gap-1 px-2 py-0 rounded-full ${config.labelBgColor}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${config.statusColor}`} />
          <span
            className={`text-xs font-semibold leading-5 tracking-[-0.02em] ${config.textColor} `}
          >
            {config.label}
          </span>
        </div>
        <span className="typo-pre-body-6 text-grey-8">{tasks.length}</span>
      </div>

      {/* Task Cards */}
      <div className="flex flex-col gap-2 w-full px-4 pb-4 flex-1">
        {sortedTasks.map((task) => (
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
