'use client'

import { useState } from 'react'

import { useParams } from 'next/navigation'

import { ClassNameValue } from 'tailwind-merge'

import { Button } from '@/components/ui/button'
import { useProjectInstructionRetrieveQuery } from '@/generated/apis/Instruction/Instruction.query'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { FolderIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

import { downloadInstructionPDF } from './instruction-order-modal'

interface ProjectInfoMoProps {
  className?: ClassNameValue
}

export const ProjectInfoMo = ({ className }: ProjectInfoMoProps) => {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  const { slug } = useParams<{ slug: string }>()

  const { data: project } = useProjectRetrieveQuery({
    variables: {
      slug,
    },
  })

  const { data: instruction } = useProjectInstructionRetrieveQuery({
    variables: {
      projectSlug: slug,
      id: 'me',
    },
  })

  const handlePdfDownload = async () => {
    if (!instruction) return
    setIsDownloadingPDF(true)
    await downloadInstructionPDF({
      instruction,
      projectName: project?.name || '',
    })
    setIsDownloadingPDF(false)
  }

  return (
    <div
      className={cn(
        'bg-grey-0 w-full h-full rounded-[8px] flex flex-col justify-center items-center gap-[12px]',
        className,
      )}
    >
      <div className="flex justify-center items-center bg-primary-2 size-[56px] rounded-full">
        <FolderIcon className="text-secondary-3" />
      </div>
      <div className="text-center">
        <p className="text-grey-9 typo-pre-body-5">
          모바일에서는 작업지시서 보기 기능을 지원하지 않습니다.
        </p>
        <p className="text-grey-8 typo-pre-body-6">
          PDF 파일을 다운로드한 후, 기기 내 ‘파일’ 앱에서 확인해 주세요.
        </p>
      </div>
      <Button
        size="sm"
        className="w-[106px]"
        onClick={handlePdfDownload}
        loading={isDownloadingPDF}
      >
        PDF 다운로드
      </Button>
    </div>
  )
}
