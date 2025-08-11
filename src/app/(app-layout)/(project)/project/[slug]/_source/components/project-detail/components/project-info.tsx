'use client'

import { useParams, useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'
import { LoadingView } from '@toktokhan-dev/react-universal'
import { useOverlay } from '@toss/use-overlay'

import dayjs from 'dayjs'
import { ClassNameValue } from 'tailwind-merge'

import {
  ProjectCreateModal,
  useProjectModal,
} from '@/app/(app-layout)/(project)/_source/hooks/use-project-modal'
import { CommonAlert } from '@/components/common-alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  QUERY_KEY_PROJECT_API,
  useProjectDestroyMutation,
  useProjectRetrieveQuery,
  useProjectShareCreateMutation,
  useProjectUpdateMutation,
} from '@/generated/apis/Project/Project.query'
import {
  CopyIcon,
  DownloadSimpleIcon,
  LinkIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

const ProjectInfoHeaderSkeleton = () => (
  <div className="flex items-center justify-between p-[20px] border-b border-border-basic-1">
    <div className="flex items-center gap-2">
      <Skeleton className="w-32 h-5" />
    </div>
  </div>
)

const ProjectInfoContentSkeleton = () => (
  <div className="flex flex-col p-[20px] gap-[20px]">
    <div className="flex w-full gap-4">
      <div className="w-full">
        <Skeleton className="w-16 h-4 mb-2" />
        <Skeleton className="w-20 h-5" />
      </div>
      <div className="w-full">
        <Skeleton className="w-20 h-4 mb-2" />
        <Skeleton className="w-20 h-5" />
      </div>
    </div>
    <div>
      <Skeleton className="w-20 h-4 mb-2" />
      <Skeleton className="w-40 h-5" />
    </div>
    <div>
      <Skeleton className="w-24 h-4 mb-2" />
      <Skeleton className="w-full h-16" />
    </div>
    <div>
      <Skeleton className="w-16 h-4 mb-2" />
      <Skeleton className="w-32 h-5" />
    </div>
    <div>
      <Skeleton className="w-20 h-4 mb-2" />
      <Skeleton className="w-full h-12" />
    </div>
  </div>
)

const ProjectInfoSkeleton = () => (
  <div className="md:max-w-[405px] max-w-full w-full flex flex-col gap-[12px]">
    <div className="flex flex-col bg-background-basic-1 rounded-[6px] border-1 border-border-basic-1">
      <ProjectInfoHeaderSkeleton />
      <ProjectInfoContentSkeleton />
    </div>
    <div className="flex gap-[6px] justify-end">
      <Skeleton className="w-28 h-8" />
      <Skeleton className="w-32 h-8" />
      <Skeleton className="w-36 h-8" />
    </div>
  </div>
)

const ProjectInfoHeader = ({
  onOpenUpdateModal,
  isReadOnly,
}: {
  onOpenUpdateModal: () => void
  isReadOnly?: boolean
}) => {
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>()

  const queryClient = useQueryClient()
  const { open } = useOverlay()

  const { mutate: deleteProject, isPending: isPendingDeleteProject } =
    useProjectDestroyMutation({})

  const handleDeleteProject = () => {
    open(({ isOpen, close }) => (
      <CommonAlert
        isOpen={isOpen}
        onClose={close}
        loading={isPendingDeleteProject}
        title="프로젝트를 삭제하시겠어요?"
        description={
          '삭제한 프로젝트는 다시 복구할 수 없어요.\n작업 지시서와 파일도 함께 삭제되는데,\n정말 삭제하시겠어요?'
        }
        onConfirm={() => {
          deleteProject(
            {
              slug,
            },
            {
              onSuccess: () => {
                close()
                toast('프로젝트가 삭제되었어요.', {
                  action: {
                    label: '닫기',
                    onClick: () => {},
                  },
                })
                queryClient.invalidateQueries({
                  queryKey: QUERY_KEY_PROJECT_API.RETRIEVE({
                    slug,
                  }),
                })
                router.push('/')
              },
            },
          )
        }}
      />
    ))
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'p-[20px] border-b border-border-basic-1',
      )}
    >
      <div className="flex items-center gap-[8px]">
        <p className="typo-pre-body-3 text-grey-9">프로젝트 정보</p>
      </div>
      {!isReadOnly && (
        <div className="flex gap-[12px]">
          <Button variant="ghost" size="fit" onClick={onOpenUpdateModal}>
            <PencilSimpleIcon className="size-[20px]" />
          </Button>
          <Button variant="ghost" size="fit" onClick={handleDeleteProject}>
            <TrashIcon className="size-[20px]" />
          </Button>
        </div>
      )}
    </div>
  )
}

interface ProjectInfoItemProps {
  label: string
  value?: string
  className?: ClassNameValue
}

const ProjectInfoItem = ({ label, value, className }: ProjectInfoItemProps) => {
  return (
    <div className={cn('flex flex-col gap-[6px]', className)}>
      <p className="typo-pre-caption-1 text-grey-9">{label}</p>
      <p className="typo-pre-caption-2 text-grey-8">{value}</p>
    </div>
  )
}

const ProjectInfoContent = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: project } = useProjectRetrieveQuery({
    variables: {
      slug,
    },
  })

  const {
    createdAt,
    updatedAt,
    name,
    description,
    clientName,
    clientDescription,
  } = project || {}

  return (
    <div className="flex flex-col p-[20px] gap-[20px]">
      <div className="flex w-full">
        <ProjectInfoItem
          label="생성일자"
          value={dayjs(createdAt).format('YYYY/MM/DD')}
          className="w-full"
        />
        <ProjectInfoItem
          label="최근저장일자"
          value={dayjs(updatedAt).format('YYYY/MM/DD')}
          className="w-full"
        />
      </div>
      <ProjectInfoItem label="프로젝트명" value={name} />
      <ProjectInfoItem label="프로젝트 설명" value={description} />
      <ProjectInfoItem label="고객사명" value={clientName} />
      <ProjectInfoItem label="고객사 설명" value={clientDescription} />
    </div>
  )
}

interface ProjectInfoProps {
  className?: ClassNameValue
}

export const ProjectInfo = ({ className }: ProjectInfoProps) => {
  const queryClient = useQueryClient()

  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading } = useProjectRetrieveQuery({
    variables: {
      slug,
    },
  })
  const { mutate: createProjectShare, isPending: isPendingCreateProjectShare } =
    useProjectShareCreateMutation({})

  const { isOwned, isShared, sharedUrl } = project || {}
  const isReadOnly = isShared && !isOwned

  const { isOpen, openProjectUpdateModal, closeModal } = useProjectModal()
  const { mutate: updateProject, isPending: isPendingUpdate } =
    useProjectUpdateMutation({})

  const handleUpdateProject = (data: {
    projectName: string
    projectDescription: string
    clientName?: string
    clientDescription?: string
  }) => {
    updateProject(
      {
        slug,
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
            queryKey: QUERY_KEY_PROJECT_API.RETRIEVE({
              slug,
            }),
          })
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY_PROJECT_API.LIST_INFINITE(),
          })
          toast('프로젝트가 수정되었어요.', {
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

  const handleCreateProjectShare = () => {
    createProjectShare(
      {
        slug,
        data: {
          isShared: !isShared,
        },
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY_PROJECT_API.RETRIEVE({
              slug,
            }),
          })
          if (res.isShared) {
            toast('링크가 생성되었어요.', {
              action: {
                label: '닫기',
                onClick: () => {},
              },
            })
          } else {
            toast('링크 공유가 중단되었어요.', {
              action: {
                label: '닫기',
                onClick: () => {},
              },
            })
          }
        },
        onError: () => {
          toast(
            '링크 생성 중 문제가 발생했습니다. 다시 시도해 주세요.',
            {
              action: {
                label: '닫기',
                onClick: () => {},
              },
            },
            'error',
          )
        },
      },
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedUrl || '')
    toast('링크가 복사되었어요.', {
      action: {
        label: '닫기',
        onClick: () => {},
      },
    })
  }

  return (
    <LoadingView isLoading={isLoading} fallback={<ProjectInfoSkeleton />}>
      <div
        className={cn(
          'md:max-w-[405px] max-w-full w-full flex flex-col gap-[12px]',
          className,
        )}
      >
        <div
          className={cn(
            'flex flex-col',
            'bg-background-basic-1 rounded-[6px] border-1 border-border-basic-1',
          )}
        >
          <ProjectInfoHeader
            onOpenUpdateModal={openProjectUpdateModal}
            isReadOnly={isReadOnly}
          />
          <ProjectInfoContent />
        </div>
        <div className="flex gap-[6px] justify-end">
          <Button variant="outline-grey" size="sm" className="w-fit">
            <DownloadSimpleIcon className="size-[16px]" />
            <p>PDF 다운로드</p>
          </Button>
          {!isReadOnly && (
            <>
              <Button
                variant="outline-grey"
                size="sm"
                className="w-fit hidden md:flex"
                onClick={handleCreateProjectShare}
                loading={isPendingCreateProjectShare}
              >
                <LinkIcon />
                <p>{isShared ? '링크 공유 중단' : '공유 링크 생성'}</p>
              </Button>
              <Button
                variant="solid-primary"
                size="sm"
                className="w-fit hidden md:flex"
              >
                작업지시서 미리보기
              </Button>
            </>
          )}
        </div>
        {!isReadOnly && isShared && (
          <div className="flex justify-end">
            <Button
              variant={'ghost'}
              size="fit"
              className="px-[10px]"
              onClick={handleCopyLink}
            >
              <CopyIcon />
              <p className="typo-pre-caption-1 text-grey-8">링크 복사</p>
            </Button>
          </div>
        )}

        <ProjectCreateModal
          isOpen={isOpen}
          onClose={closeModal}
          data={{
            headerTitle: '프로젝트 수정',
            footerText: '프로젝트 수정',
          }}
          status="update"
          onSubmit={handleUpdateProject}
          loading={isPendingUpdate}
        />
      </div>
    </LoadingView>
  )
}
