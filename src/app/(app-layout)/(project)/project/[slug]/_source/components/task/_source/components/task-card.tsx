'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { formatDate } from '@/app/_source/utils/date'
import { TaskType } from '@/generated/apis/@types/data-contracts'

import { DragTaskData } from '../../../../utils/dnd'

interface TaskCardProps {
  task: TaskType
  isSelected?: boolean
}

export const TaskCard = ({ task, isSelected = false }: TaskCardProps) => {
  const { id, createdAt, name, description, slug, status } = task
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: 'task', task } satisfies DragTaskData,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex flex-col justify-center items-center p-[10px_12px_12px_16px] gap-5 bg-background-basic-1 rounded-[6px] shadow-[0_2px_6px_0_rgba(0,0,0,0.06)] cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 touch-none ${
        isSelected ? 'bg-secondary-2 border border-primary-3' : ''
      }`}
    >
      <div className="w-full flex items-center gap-1.5">
        <p className="typo-pre-caption-2 text-grey-9">
          {formatDate(createdAt)}
        </p>
        <div className="w-px h-[10px] bg-grey-3" />
        <p className="typo-pre-caption-2 text-grey-9">{name}</p>
      </div>
      <div className="flex justify-between items-center w-full gap-4">
        <h3 className="typo-pre-body-5 text-grey-9 flex-1">{description}</h3>
      </div>
    </div>
  )
}
