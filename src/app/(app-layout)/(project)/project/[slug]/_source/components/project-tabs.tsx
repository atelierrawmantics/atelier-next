import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'project', label: '작업지시서' },
  { key: 'schematic', label: 'AI 도식화생성' },
  { key: 'task', label: '태스크 관리' },
]
export const ProjectTabs = ({
  tab,
}: {
  tab: 'project' | 'task' | 'schematic'
}) => {
  return (
    <div className="flex gap-[16px] h-full justify-end sm:justify-start">
      {TABS.map(({ key, label }) => (
        <Button
          key={key}
          variant="ghost"
          size="fit"
          asChild
          className={cn(
            'typo-pre-body-5 h-[40px] sm:h-[56px]',
            'border-b-2',
            tab === key ? 'border-primary-3' : 'border-transparent',
            tab === key ? 'text-primary-3' : 'text-grey-7',
          )}
        >
          <Link
            href={{
              search: `tab=${key}`,
            }}
          >
            {label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
