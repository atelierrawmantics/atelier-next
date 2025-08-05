import { Children } from 'react'

import { Project } from './_source/components/project'
import { ProjectContent } from './_source/components/project-content'

export default function HomePage() {
  return (
    <ProjectContent header={Children.toArray([<div>?</div>, <div>?</div>])}>
      <Project />
    </ProjectContent>
  )
}
