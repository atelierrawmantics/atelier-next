import { Children } from 'react'

import { ProjectContent } from '../../_source/components/project-content'
import { ProjectDetail } from './_source/components/project-detail/project-detail'

export const metadata = {
  title: '프로젝트 상세',
}

export default function ProjectIdPage() {
  return (
    <ProjectContent header={Children.toArray([<div>?</div>, <div>?</div>])}>
      <ProjectDetail />
    </ProjectContent>
  )
}
