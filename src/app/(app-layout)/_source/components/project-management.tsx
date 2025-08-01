'use client'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useProjectListInfiniteQuery } from '@/generated/apis/Project/Project.query'
import { FolderIcon } from '@/generated/icons/MyIcons'

export const ProjectManagement = () => {
  // const { data: projectList } = useProjectListInfiniteQuery({})
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <EmptyProject />
    </div>
  )
}

const EmptyProject = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-[12px] pt-[36px] pb-[80px]">
      <div className="flex flex-col items-center justify-center max-w-[1300px] w-full h-full gap-[12px] container">
        <div className="w-full flex items-center justify-between">
          <p className="typo-pre-heading-4 text-grey-9">나의 프로젝트 0</p>
          <Button size="sm" className="flex gap-[4px] items-center w-fit">
            <PlusIcon className="size-[16px]" />
            <p>프로젝트 생성</p>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center bg-grey-0 rounded-[8px] w-full h-full">
          <div className="flex items-center justify-center bg-secondary-2 rounded-full size-[56px]">
            <FolderIcon className="text-secondary-3 size-[28px]" />
          </div>
          <div className="text-center">
            <p className="typo-pre-body-5 text-grey-9">
              생성된 프로젝트가 없습니다.
            </p>
            <p className="typo-pre-body-6 text-grey-8">
              업무 관리를 시작하려면 먼저 프로젝트를 생성해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
