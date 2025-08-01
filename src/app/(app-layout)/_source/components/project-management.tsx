'use client'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useProjectListInfiniteQuery } from '@/generated/apis/Project/Project.query'
import { FolderIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

export const ProjectManagement = () => {
  // const { data: projectList } = useProjectListInfiniteQuery({})
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col justify-center items-center w-full h-full gap-[12px] pb-[80px]">
        {/* <EmptyProject /> */}
        <ProjectList />
      </div>
    </div>
  )
}

const EmptyProject = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-[1300px] w-full h-full gap-[12px] container">
      <ProjectHeader />
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
  )
}

export const ProjectHeader = () => {
  return (
    <div className="w-full flex items-center justify-between pt-[28px] pb-[12px]">
      <p className="typo-pre-heading-4 text-grey-9">나의 프로젝트 0</p>
      <Button size="sm" className="flex gap-[4px] items-center w-fit">
        <PlusIcon className="size-[16px]" />
        <p>프로젝트 생성</p>
      </Button>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="flex items-center gap-[10px]">
      <p className="typo-pre-caption-1 text-grey-9">{label}</p>
      <p className="typo-pre-caption-2 text-grey-8">{value}</p>
    </div>
  )
}

const ProjectList = () => {
  return (
    <div className="flex flex-col items-center justify-start max-w-[1300px] w-full h-full gap-[12px]">
      <ProjectHeader />
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
    </div>
  )
}

const ProjectCard = () => {
  return (
    <div
      className={cn(
        'flex flex-col gap-[12px] w-full py-[16px] px-[20px] h-[108px] border-1 border-border-basic-2 bg-grey-0 rounded-[8px] cursor-pointer',
        'hover:border-primary-3 hover:bg-secondary-2',
        'transition-all duration-200 ease-in-out',
      )}
    >
      <p className="typo-pre-heading-5 text-grey-9">SS26 봄 블라우스 개발</p>
      <div className="flex flex-col gap-[4px]">
        <InfoItem label="고객사" value="Maison Rêve" />
        <div className="flex flex-row items-center">
          <InfoItem label="프로젝트 생성일" value="2025.01.01" />
          <div className="w-[1px] h-[12px] bg-grey-3 mx-[8px]" />
          <InfoItem label="최근 업데이트일" value="2025.01.01" />
        </div>
      </div>
    </div>
  )
}
