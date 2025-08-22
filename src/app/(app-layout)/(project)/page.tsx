import { Children } from 'react'

import { cookies } from 'next/headers'

import { COOKIE_KEYS } from '@/constants/cookie-keys'
import { FolderIcon } from '@/generated/icons/MyIcons'

import { Landing } from './_source/components/landing/landing'
import { Project } from './_source/components/project'
import { ProjectContent } from './_source/components/project-content'

export default function HomePage() {
  const accessToken = cookies().get(COOKIE_KEYS.AUTH.ACCESS_TOKEN)?.value
  const refreshToken = cookies().get(COOKIE_KEYS.AUTH.REFRESH_TOKEN)?.value
  const isLoggedIn = !!accessToken && !!refreshToken

  return isLoggedIn ?
      <ProjectContent
        header={Children.toArray([
          <div className="flex items-center gap-[8px]">
            <FolderIcon className="text-secondary-2 w-[24px] h-[24px]" />
            <p className="typo-pre-heading-5 text-grey-9">프로젝트 관리</p>
          </div>,
        ])}
        contentClassName="pb-0"
      >
        <Project />
      </ProjectContent>
    : <Landing />
}
