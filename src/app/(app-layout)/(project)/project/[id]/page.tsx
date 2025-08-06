import { Children } from 'react'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { FolderIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

import { ProjectContent } from '../../../_source/components/project-content'
import { ProjectDetail } from './_source/components/project-detail/instruction'
import { Schematic } from './_source/components/schematic/schematic'
import { Task } from './_source/components/task/task'

export const metadata = {
  title: '프로젝트 상세',
}

export default function ProjectIdPage({
  searchParams,
}: {
  searchParams: {
    tab: 'project' | 'task' | 'schematic'
  }
}) {
  const { tab = 'project' } = searchParams

  const renderContent = () => {
    switch (tab) {
      case 'project':
        return <ProjectDetail />
      case 'task':
        return <Task />
      case 'schematic':
        return <Schematic />
      default:
        return <ProjectDetail />
    }
  }

  return (
    <ProjectContent
      header={Children.toArray([
        <div className="flex items-center gap-[8px]">
          <FolderIcon className="text-secondary-2 w-[24px] h-[24px]" />
          <p className="typo-pre-heading-5 text-grey-9">
            SS25 시즌 여성 블라우스 라인 개발
          </p>
        </div>,
        <ProjectTabs tab={tab} />,
      ])}
    >
      {renderContent()}
    </ProjectContent>
  )
}

const tabs = [
  { key: 'project', label: '작업지시서' },
  { key: 'schematic', label: 'AI 도식화생성' },
  { key: 'task', label: '태스크 관리' },
]
const ProjectTabs = ({ tab }: { tab: 'project' | 'task' | 'schematic' }) => {
  return (
    <div className="flex gap-[16px] h-full">
      {tabs.map(({ key, label }) => (
        <Button
          key={key}
          variant="ghost"
          size="fit"
          asChild
          className={cn(
            'typo-pre-body-5 h-[56px]',
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
