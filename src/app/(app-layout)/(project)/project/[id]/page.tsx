import { Children } from 'react'

import { FolderIcon } from '@/generated/icons/MyIcons'

import { ProjectContent } from '../../../_source/components/project-content'
import { ProjectDetail } from './_source/components/project-detail/project-detail'

export const metadata = {
  title: '프로젝트 상세',
}

export default function ProjectIdPage() {
  return (
    <ProjectContent
      header={Children.toArray([
        <div className="flex items-center gap-[8px]">
          <FolderIcon className="text-secondary-2 w-[24px] h-[24px]" />
          <p className="typo-pre-heading-5 text-grey-9">
            SS25 시즌 여성 블라우스 라인 개발
          </p>
        </div>,
        <div>?</div>,
      ])}
    >
      <ProjectDetail />
    </ProjectContent>
  )
}
