'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useQueryClient } from '@tanstack/react-query'

import {
  TaskStatusEnumType,
  TaskType,
} from '@/generated/apis/@types/data-contracts'
import {
  QUERY_KEY_TASK_API,
  useProjectTaskPartialUpdateMutation,
} from '@/generated/apis/Task/Task.query'

import { isColumnData, isTaskData } from '../../../../utils/dnd'
import { EmptyTask } from './empty-task'
import { TaskCard } from './task-card'
import { TaskColumn } from './task-column'

type TaskStatus = TaskStatusEnumType

interface TaskContainerProps {
  data: TaskType[]
}

const COLUMN_LIST = ['pending', 'in_progress', 'completed', 'issue']

export const TaskContainer = ({ data }: TaskContainerProps) => {
  const qc = useQueryClient()
  const { slug } = useParams<{ slug: string }>()

  const { mutate: updateTask } = useProjectTaskPartialUpdateMutation({
    options: {
      onSuccess: () => {
        setActiveTask(null)
        qc.invalidateQueries({
          queryKey: QUERY_KEY_TASK_API.PROJECT_TASK_LIST({
            projectSlug: slug,
          }),
        })
      },
    },
  })

  const [tasks, setTasks] = useState<TaskType[]>(data || [])
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    if (!tasks) return

    const { active } = event

    const foundTask =
      isTaskData(active.data.current) ? active.data.current.task : null

    if (foundTask) {
      setActiveTask(foundTask)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!tasks || !over) return

    const foundTask =
      isTaskData(active.data.current) ? active.data.current.task : null

    const newStatus =
      isColumnData(over.data.current) ? over.data.current.status
      : isTaskData(over.data.current) ? over.data.current.task.status
      : null

    const currentStatus = foundTask?.status

    const isInvalidStatus =
      !foundTask || !newStatus || !currentStatus || currentStatus === newStatus

    if (isInvalidStatus) {
      setActiveTask(null)
      return
    }

    const updatedTask: TaskType = {
      ...foundTask,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }

    // 낙관적 업데이트
    // 1) 기존 항목 제거
    // 2) 업데이트된 항목을 배열 끝에 추가
    setTasks((prev) => {
      const withoutOld = prev.filter((t) => t.slug !== foundTask.slug)
      return [...withoutOld, updatedTask]
    })

    updateTask({
      data: {
        status: newStatus,
      },
      slug: foundTask.slug,
      projectSlug: slug,
    })
  }

  useEffect(() => {
    if (data) {
      setTasks(data)
    }
  }, [data])

  return (
    <div className="w-full container mx-auto pt-[36px] pb-[80px] px-[20px] h-[100%] flex flex-col">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full gap-4 h-full justify-center ">
          {tasks.length > 0 &&
            COLUMN_LIST.map((status) => (
              <TaskColumn
                key={status}
                status={status as TaskStatus}
                tasks={tasks?.filter((task) => task.status === status) || []}
              />
            ))}

          {tasks?.length === 0 && <EmptyTask />}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ?
            <div className="shadow-xl">
              <TaskCard task={activeTask} isSelected={true} />
            </div>
          : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
