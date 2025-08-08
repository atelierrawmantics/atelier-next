'use client'

import { useParams } from 'next/navigation'

import { LoadingView } from '@toktokhan-dev/react-universal'

import { Skeleton } from '@/components/ui/skeleton'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { FolderIcon } from '@/generated/icons/MyIcons'

export const ProjectHeader = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data: project, isLoading } = useProjectRetrieveQuery({
    variables: {
      slug,
    },
  })

  return (
    <div className="flex items-center gap-[8px]">
      <FolderIcon className="text-secondary-2 w-[24px] h-[24px]" />

      <LoadingView
        isLoading={isLoading}
        fallback={<Skeleton className="w-[250px] h-[24px]" />}
      >
        <p className="typo-pre-heading-5 text-grey-9">{project?.name}</p>
      </LoadingView>
    </div>
  )
}
