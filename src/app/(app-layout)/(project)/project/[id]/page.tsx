import { Children } from 'react'

import { FolderIcon } from '@/generated/icons/MyIcons'

import { ProjectContent } from '../../../_source/components/project-content'
import { ProjectDetail } from './_source/components/project-detail/instruction'
import { ProjectTabs } from './_source/components/project-tabs'
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
