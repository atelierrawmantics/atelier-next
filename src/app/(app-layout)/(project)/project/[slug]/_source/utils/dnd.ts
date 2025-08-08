import type {
  TaskStatusEnumType,
  TaskType,
} from '@/generated/apis/@types/data-contracts'

export type DragTaskData = {
  type: 'task'
  task: TaskType
}
export type DragColumnData = { type: 'column'; status: TaskStatusEnumType }
export type DragData = DragTaskData | DragColumnData

export function isTaskData(data: unknown): data is DragTaskData {
  if (!data || typeof data !== 'object') return false
  const candidate = data as Partial<DragTaskData>
  return (
    candidate.type === 'task' &&
    candidate.task !== undefined &&
    candidate.task !== null &&
    typeof candidate.task === 'object' &&
    'slug' in candidate.task
  )
}

export function isColumnData(data: unknown): data is DragColumnData {
  return (
    !!data &&
    (data as any).type === 'column' &&
    typeof (data as any).status === 'string'
  )
}
