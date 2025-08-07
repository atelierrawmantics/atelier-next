'use client'

import { useParams } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import dayjs from 'dayjs'
import { ClassNameValue } from 'tailwind-merge'

import { Button } from '@/components/ui/button'
import {
  QUERY_KEY_PROJECT_API,
  useProjectRetrieveQuery,
  useProjectShareCreateMutation,
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

const ProjectInfoHeader = () => {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'px-[20px] h-[60px]',
        'border-b border-border-basic-1',
      )}
    >
      <p className="typo-pre-body-5 text-grey-9">프로젝트 정보</p>
      <div className="flex gap-[12px]">
        <Button size="fit" variant="ghost">
          <PencilSimpleIcon />
        </Button>
        <Button size="fit" variant="ghost">
          <TrashIcon />
        </Button>
      </div>
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
  const { id } = useParams<{ id: string }>()
  const { data: project } = useProjectRetrieveQuery({
    variables: {
      slug: id,
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

export const ProjectInfo = () => {
  const queryClient = useQueryClient()

  const { id } = useParams<{ id: string }>()
  const { data: project } = useProjectRetrieveQuery({
    variables: {
      slug: id,
    },
  })
  const { mutate: createProjectShare, isPending: isPendingCreateProjectShare } =
    useProjectShareCreateMutation({})

  const { isShared, sharedUrl } = project || {}

  const handleCreateProjectShare = () => {
    createProjectShare(
      {
        slug: id,
        data: {
          isShared: !isShared,
        },
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY_PROJECT_API.RETRIEVE({
              slug: id,
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
    <div className="md:max-w-[405px] max-w-full w-full flex flex-col gap-[12px]">
      <div
        className={cn('flex flex-col', 'bg-background-basic-1 rounded-[6px]')}
      >
        <ProjectInfoHeader />
        <ProjectInfoContent />
      </div>
      <div className="flex gap-[6px] justify-end">
        <Button variant="outline-grey" size="sm" className="w-fit">
          <DownloadSimpleIcon className="size-[16px]" />
          <p>PDF 다운로드</p>
        </Button>
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
      </div>
      {isShared && (
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
    </div>
  )
}
