import { Children } from 'react'

import { FolderIcon } from '@/generated/icons/MyIcons'

import { Project } from '../_source/components/project'
import { ProjectContent } from '../_source/components/project-content'

export default function HomePage() {
  return (
    <ProjectContent
      header={Children.toArray([
        <div className="flex items-center gap-[8px]">
          <FolderIcon className="text-secondary-2 w-[24px] h-[24px]" />
          <p className="typo-pre-heading-5 text-grey-9">프로젝트 관리</p>
        </div>,
      ])}
    >
      <Project />
    </ProjectContent>
  )
}
