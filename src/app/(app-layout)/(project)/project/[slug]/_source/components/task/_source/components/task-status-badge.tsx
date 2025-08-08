import {
  TaskStatusEnumType,
  TaskStatusEnumTypeMap,
} from '@/generated/apis/@types/data-contracts'
import { theme } from '@/generated/theme-token'

type StatusConfig = {
  label: string
  labelBgColor: `bg-${keyof typeof theme}`
  statusColor: `bg-${keyof typeof theme}`
  textColor: `text-${keyof typeof theme}`
}

interface TaskStatusBadgeProps {
  status: TaskStatusEnumType
  hasDot?: boolean
}

const STATUS_CONFIGS: Record<keyof typeof TaskStatusEnumTypeMap, StatusConfig> =
  {
    pending: {
      label: '진행전',
      labelBgColor: 'bg-background-basic-3',
      statusColor: 'bg-grey-8',
      textColor: 'text-grey-8',
    },
    in_progress: {
      label: '진행중',
      labelBgColor: 'bg-accent-blue1',
      statusColor: 'bg-accent-blue2',
      textColor: 'text-accent-blue2',
    },
    completed: {
      label: '진행완료',
      labelBgColor: 'bg-accent-green2',
      statusColor: 'bg-accent-green3',
      textColor: 'text-accent-green3',
    },
    issue: {
      label: '이슈',
      labelBgColor: 'bg-accent-red1',
      statusColor: 'bg-accent-red2',
      textColor: 'text-accent-red2',
    },
  }

export const TaskStatusBadge = ({
  status,
  hasDot = true,
}: TaskStatusBadgeProps) => {
  const config = STATUS_CONFIGS[status]

  return (
    <div
      className={`h-6 flex items-center justify-center gap-1 px-2 py-0 rounded-full ${config.labelBgColor}`}
    >
      {hasDot && (
        <div className={`w-1.5 h-1.5 rounded-full ${config.statusColor}`} />
      )}
      <span className={`typo-pre-caption-1 ${config.textColor} `}>
        {config.label}
      </span>
    </div>
  )
}
