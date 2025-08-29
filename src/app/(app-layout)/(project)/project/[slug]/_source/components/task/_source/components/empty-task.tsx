'use client'

import { useParams } from 'next/navigation'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { ArticleIcon } from '@/generated/icons/MyIcons'

import { useTaskModal } from '../../../../hooks/use-task-modal'

export const EmptyTask = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: project } = useProjectRetrieveQuery({
    variables: { slug },
  })
  const { isOwned } = project || {}

  const { openTaskCreateModal } = useTaskModal()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-grey-0 rounded-[12px] border border-border-basic-1 py-[96px]">
      <div className="w-full flex flex-col items-center justify-center gap-3">
        <div className="flex flex-col items-center justify-center size-[56px] rounded-full bg-secondary-2">
          <ArticleIcon className="size-[28px] text-secondary-3" />
        </div>
        <div className="flex flex-col items-center justify-center gap-0">
          <p className="typo-pre-body-5 text-grey-9">
            생성된 태스크가 없습니다.
          </p>
          {isOwned && (
            <p className="typo-pre-body-6 text-grey-8">
              업무 관리를 시작하려면 태스크를 생성해주세요.
            </p>
          )}
        </div>
        {isOwned && (
          <Button
            variant="solid-primary"
            size="sm"
            className="w-[96px]"
            onClick={() => {
              openTaskCreateModal({
                data: {
                  projectName: '태스크 생성',
                },
                onClose: () => {},
              })
            }}
          >
            <PlusIcon className="size-[16px]" />
            태스크 생성
          </Button>
        )}
      </div>
    </div>
  )
}
