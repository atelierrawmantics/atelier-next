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
  TaskStatusEnumTypeMap,
  TaskType,
} from '@/generated/apis/@types/data-contracts'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import {
  QUERY_KEY_TASK_API,
  useProjectTaskPartialUpdateMutation,
} from '@/generated/apis/Task/Task.query'
import { InfoFillIcon } from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'

import { isColumnData, isTaskData } from '../../../../utils/dnd'
import { TaskCard } from './task-card'
import { TaskColumn } from './task-column/task-column'

type TaskStatus = TaskStatusEnumType

interface TaskContainerProps {
  data: TaskType[]
}

const COLUMN_LIST = ['pending', 'in_progress', 'completed', 'issue']

export const TaskContainer = ({ data }: TaskContainerProps) => {
  const qc = useQueryClient()
  const { slug } = useParams<{ slug: string }>()

  const { data: project } = useProjectRetrieveQuery({
    variables: { slug },
  })

  const { isShared, isOwned } = project || {}
  const isReadOnly = Boolean(isShared && !isOwned)

  const { mutate: updateTask } = useProjectTaskPartialUpdateMutation({
    options: {
      onSuccess: (res) => {
        const { isAlarm, managerPhone, status } = res || {}
        setActiveTask(null)
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
    if (!tasks || isReadOnly) return

    const { active } = event

    const foundTask =
      isTaskData(active.data.current) ? active.data.current.task : null

    if (foundTask) {
      setActiveTask(foundTask)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!tasks || !over || isReadOnly) return

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
    <div className="w-full container mx-auto pt-[16px] sm:pt-[20px] md:pt-[36px] flex flex-col h-screen">
      <div className="hidden md:block h-full">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col md:flex-row w-full gap-4 h-full md:justify-center">
            {tasks.length > 0 &&
              COLUMN_LIST.map((status) => (
                <TaskColumn
                  key={status}
                  status={status as TaskStatus}
                  tasks={tasks?.filter((task) => task.status === status) || []}
                />
              ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeTask && (
              <div className="shadow-xl">
                <TaskCard task={activeTask} isSelected={true} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* tablet 이하 모바일 뷰 */}
      <div className="flex h-full flex-col md:hidden gap-5">
        <div className="py-[10px] px-[20px] bg-primary-2 flex gap-[6px] items-center sm:items-start">
          <InfoFillIcon className="min-w-[20px] size-[20px] text-primary-3" />
          <p className="typo-pre-body-6">
            모바일 환경에서는 드래그앤드랍을 통한 상태 변경 기능을 지원하지
            않습니다. PC 환경에서 이용해 주세요.
          </p>
        </div>

        <div className="flex flex-col w-full gap-4 h-full md:justify-center">
          {tasks.length > 0 &&
            COLUMN_LIST.map((status) => (
              <TaskColumn
                key={status}
                status={status as TaskStatus}
                tasks={tasks?.filter((task) => task.status === status) || []}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
