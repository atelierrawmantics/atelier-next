'use client'

import { useParams } from 'next/navigation'

import { ClassNameValue } from 'tailwind-merge'

import { Button } from '@/components/ui/button'
import { useProjectShareCreateMutation } from '@/generated/apis/Project/Project.query'
import {
  DownloadSimpleIcon,
  LinkIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

import { ProjectInfoForm } from './components/project-info-form'

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
  value: string
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
  return (
    <div className="flex flex-col p-[20px] gap-[20px]">
      <div className="flex w-full">
        <ProjectInfoItem
          label="생성일자"
          value="2025.01.01"
          className="w-full"
        />
        <ProjectInfoItem
          label="최근저장일자"
          value="2025.01.01"
          className="w-full"
        />
      </div>
      <ProjectInfoItem
        label="프로젝트명"
        value="SS25 시즌 여성 블라우스 라인 개발"
      />
      <ProjectInfoItem
        label="프로젝트 설명"
        value="SS26 시즌용 여성 블라우스 개발 프로젝트입니다. 이번 스타일은 봄 시즌 주요 아이템으로 기획되었으며, 은은한 플라워 패턴과 퍼프 소매 디테일이 특징입니다. 총 3가지 컬러로 진행 예정이며, 원단 개발 및 부자재 테스트가 병행됩니다. 도식화를 기반으로 샘플 제작부터 생산까지의 전체 프로세스를 효율적으로 관리하고자 하며, 클라이언트 요구사항에 따라 반복적인 수정 가능성이 있습니다."
      />
      <ProjectInfoItem label="고객사명" value="Maison Rêve" />
      <ProjectInfoItem
        label="고객사 설명"
        value="Maison Rêve는 30/40대 여성을 타깃으로 한 컨템포러리 브랜드로, 시즌별 약 30~50개 스타일을 자체 기획 및 개발하고 있습니다. 원단 퀄리티와 디테일한 봉제 마감을 중시하며, 도식화 기반의 커뮤니케이션을 선호합니다. 수정 요청이 빠르게 반복되는 편으로, 실시간 피드백과 태스크 상태 공유가 중요합니다. 최근에는 친환경 소재와 지속 가능한 생산 공정을 점차 확대하고 있는 브랜드입니다."
      />
    </div>
  )
}

const ProjectInfo = () => {
  const { id } = useParams<{ id: string }>()
  const { mutate: createProjectShare, isPending: isPendingCreateProjectShare } =
    useProjectShareCreateMutation({})

  const handleCreateProjectShare = () => {
    createProjectShare(
      {
        slug: id,
        data: {
          isShared: true,
        },
      },
      {
        onSuccess: () => {
          toast('링크가 생성되었어요.', {
            action: {
              label: '닫기',
              onClick: () => {},
            },
          })
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
  return (
    <div className="md:max-w-[405px] max-w-full w-full">
      <div
        className={cn('flex flex-col', 'bg-background-basic-1 rounded-[6px]')}
      >
        <ProjectInfoHeader />
        <ProjectInfoContent />
      </div>
      <div className="flex gap-[6px] mt-[12px] justify-end">
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
          <p>공유 링크 생성</p>
        </Button>
        <Button
          variant="solid-primary"
          size="sm"
          className="w-fit hidden md:flex"
        >
          작업지시서 미리보기
        </Button>
      </div>
    </div>
  )
}

export const ProjectDetail = () => {
  return (
    <div
      className={cn(
        'flex justify-end md:justify-center items-start gap-[16px] flex-col-reverse md:flex-row',
        'container',
        'w-full h-full pt-[16px] sm:pt-[20px] md:pt-[36px]',
      )}
    >
      <ProjectInfoForm />
      <ProjectInfo />
    </div>
  )
}
