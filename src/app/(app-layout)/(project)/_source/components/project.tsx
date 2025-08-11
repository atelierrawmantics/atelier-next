'use client'

import { useMemo } from 'react'

import Link from 'next/link'

import { useQueryClient } from '@tanstack/react-query'
import { EmptyView, LoadingView } from '@toktokhan-dev/react-universal'
import { isNotNullish } from '@toktokhan-dev/universal'

import dayjs from 'dayjs'
import { PlusIcon } from 'lucide-react'

import { useProjectModal } from '@/app/(app-layout)/(project)/_source/hooks/use-project-modal'
import { ProjectCreateModal } from '@/app/(app-layout)/(project)/_source/hooks/use-project-modal'
import { InfinityContent } from '@/components/infinite-content'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectType } from '@/generated/apis/@types/data-contracts'
import {
  QUERY_KEY_PROJECT_API,
  useProjectCreateMutation,
  useProjectListInfiniteQuery,
} from '@/generated/apis/Project/Project.query'
import { FolderIcon } from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

const EmptyProject = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-grey-0 rounded-[8px] w-full h-full gap-[12px]">
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
  )
}

interface ProjectHeaderProps {
  projectCount?: number
  onOpenCreateModal: () => void
}
export const ProjectHeader = ({
  projectCount,
  onOpenCreateModal,
}: ProjectHeaderProps) => {
  return (
    <div className="sticky w-full container flex items-center justify-between pt-[12px] sm:pt-[20px] md:pt-[28px] pb-[12px]">
      <p className="typo-pre-heading-4 text-grey-9">
        나의 프로젝트 {projectCount || 0}
      </p>
      <Button
        size="sm"
        className="flex gap-[4px] items-center w-fit"
        onClick={onOpenCreateModal}
      >
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

interface ProjectCardProps {
  project: ProjectType
}
const ProjectCard = ({ project }: ProjectCardProps) => {
  const { slug, name, clientName, createdAt, updatedAt } = project
  return (
    <Link
      href={`/project/${slug}`}
      className={cn(
        'flex flex-col gap-[12px] w-full py-[16px] px-[20px] h-[108px] border-1 border-border-basic-2 bg-grey-0 rounded-[8px] cursor-pointer',
        'hover:border-primary-3 hover:bg-secondary-2',
        'transition-all duration-200 ease-in-out',
      )}
    >
      <p className="typo-pre-heading-5 text-grey-9">{name}</p>
      <div className="flex flex-col gap-[4px]">
        <InfoItem label="고객사" value={clientName} />
        <div className="flex flex-row items-center">
          <InfoItem
            label="프로젝트 생성일"
            value={dayjs(createdAt).format('YYYY/MM/DD')}
          />
          <div className="w-[1px] h-[12px] bg-grey-3 mx-[8px]" />
          <InfoItem
            label="최근 업데이트일"
            value={dayjs(updatedAt).format('YYYY/MM/DD')}
          />
        </div>
      </div>
    </Link>
  )
}

export const Project = () => {
  const {
    data: projectList,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProjectListInfiniteQuery({
    variables: {
      query: {
        page_size: 10,
      },
    },
  })

  const projectListData = useMemo(
    () =>
      projectList?.pages.flatMap((page) => page.results).filter(isNotNullish) ??
      [],
    [projectList],
  )

  const { isOpen, openProjectCreateModal, closeModal } = useProjectModal()
  const queryClient = useQueryClient()
  const { mutate: createProject, isPending } = useProjectCreateMutation({})

  const handleCreateProject = (data: {
    projectName: string
    projectDescription: string
    clientName?: string
    clientDescription?: string
  }) => {
    createProject(
      {
        data: {
          name: data.projectName,
          description: data.projectDescription,
          clientName: data.clientName ?? '',
          clientDescription: data.clientDescription ?? '',
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY_PROJECT_API.LIST_INFINITE(),
          })
          toast('프로젝트가 생성되었어요.', {
            action: {
              label: '닫기',
              onClick: () => {},
            },
          })
          closeModal()
        },
      },
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full">
        <div className="w-full bg-accent-deepgrey2">
          <ProjectHeader
            projectCount={projectList?.pages[0].count}
            onOpenCreateModal={openProjectCreateModal}
          />
        </div>
      </div>

      <div className="flex flex-col items-center w-full flex-1 overflow-y-auto pb-[80px]">
        <div
          className={cn(
            'w-full container',
            projectListData.length === 0 ? 'h-full' : 'h-auto',
          )}
        >
          <div className="flex flex-col justify-center items-center w-full h-full gap-[12px]">
            <div
              className={cn(
                'relative flex flex-col items-center justify-start w-full h-full',
              )}
            >
              <LoadingView
                fallback={
                  <div className="flex flex-col gap-[8px] w-full">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="w-full h-[108px] rounded-[8px]"
                      />
                    ))}
                  </div>
                }
                isLoading={isLoading}
              >
                <EmptyView fallback={<EmptyProject />} data={projectListData}>
                  <InfinityContent
                    hasMore={hasNextPage}
                    isFetching={isFetchingNextPage}
                    onFetchMore={fetchNextPage}
                  >
                    <div className="flex flex-col gap-[8px] w-full">
                      {projectListData.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </InfinityContent>
                </EmptyView>
              </LoadingView>
            </div>
          </div>
        </div>
      </div>

      <ProjectCreateModal
        isOpen={isOpen}
        onClose={closeModal}
        data={{
          headerTitle: '프로젝트 생성',
          footerText: '프로젝트 생성',
        }}
        status="create"
        onSubmit={handleCreateProject}
        loading={isPending}
      />
    </div>
  )
}
