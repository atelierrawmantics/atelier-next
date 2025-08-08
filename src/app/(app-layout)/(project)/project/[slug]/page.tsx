import { Children } from 'react'

import { ProjectContent } from '../../_source/components/project-content'
import { ProjectDetail } from './_source/components/project-detail/project-detail'
import { ProjectHeader } from './_source/components/project-header'
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
      header={Children.toArray([<ProjectHeader />, <ProjectTabs tab={tab} />])}
    >
      {renderContent()}
    </ProjectContent>
  )
}
