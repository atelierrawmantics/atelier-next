import { Accordion } from '@/components/ui/accordion'
import {
  TaskStatusEnumType,
  TaskType,
} from '@/generated/apis/@types/data-contracts'

import { TaskAccordionColumn } from './task-accordion-column'
import { TaskDndColumn } from './task-dnd-column'

interface TaskColumnProps {
  status: TaskStatusEnumType
  tasks: TaskType[]
}

export const TaskColumn = ({ status, tasks }: TaskColumnProps) => {
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
  )

  return (
    <>
      <TaskDndColumn status={status} tasks={sortedTasks} />
      <Accordion
        type="single"
        collapsible
        className="block md:hidden w-full rounded-[12px] border-1 border-border-basic-1"
      >
        <TaskAccordionColumn status={status} tasks={sortedTasks} />
      </Accordion>
    </>
  )
}
