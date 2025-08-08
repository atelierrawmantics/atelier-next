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

import {
  TaskStatusEnumType,
  TaskType,
} from '@/generated/apis/@types/data-contracts'
import {
  useProjectTaskListQuery,
  useProjectTaskPartialUpdateMutation,
} from '@/generated/apis/Task/Task.query'

import { isColumnData, isTaskData } from '../../utils/dnd'
import { EmptyTask } from './_source/components/empty-task'
import { TaskCard } from './_source/components/task-card'
import { TaskColumn } from './_source/components/task-column'

interface Task {
  id: string
  date: string
  assignee: string
  title: string
}

type TaskStatus = TaskStatusEnumType

const COLUMN_LIST = ['pending', 'in_progress', 'completed', 'issue']

export const Task = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data } = useProjectTaskListQuery({
    variables: {
      projectSlug: slug,
    },
    options: {
      enabled: !!slug,
    },
  })

  const { mutate: updateTask } = useProjectTaskPartialUpdateMutation({
    options: {
      onSuccess: (data) => {
        setActiveTask(null)
        setTasks((prev) => prev.map((t) => (t.slug === data.slug ? data : t)))
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

  const handleAddTask = (status: string) => {
    console.log(`Add task to ${status}`)
  }

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
      isColumnData(over.data.current) ? over.data.current.status : null

    const currentStatus = foundTask?.status

    const isInvalidStatus =
      !foundTask || !newStatus || !currentStatus || currentStatus === newStatus

    if (isInvalidStatus) {
      setActiveTask(null)
      return
    }

    const updatedTask = {
      ...foundTask,
      status: newStatus,
    }
    // 낙관적 업데이트
    setTasks((prev) =>
      prev.map((t) => (t.slug === foundTask.slug ? updatedTask : t)),
    )

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
    <div className="w-full max-w-[1280px] mx-auto pt-[36px] pb-[80px] px-[20px] h-[100%] flex flex-col">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full">
          {tasks.length > 0 &&
            COLUMN_LIST.map((status) => (
              <TaskColumn
                key={status}
                status={status as TaskStatus}
                tasks={tasks?.filter((task) => task.status === status) || []}
                onAddTask={() => handleAddTask(status as TaskStatus)}
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
