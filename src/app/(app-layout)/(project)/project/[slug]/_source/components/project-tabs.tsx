'use client'

import { useEffect } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { LoadingView } from '@toktokhan-dev/react-universal'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { cn } from '@/lib/utils'

type TabKey = 'project' | 'task' | 'schematic'

interface TabItem {
  key: TabKey
  label: string
}

const ALL_TABS: TabItem[] = [
  { key: 'project', label: '작업지시서' },
  { key: 'schematic', label: 'AI 도식화생성' },
  { key: 'task', label: '태스크 관리' },
]

const READONLY_TABS: TabItem[] = [
  { key: 'project', label: '작업지시서' },
  { key: 'task', label: '태스크 관리' },
]

interface ProjectTabsProps {
  tab: TabKey
}

const getTabStyles = (isActive: boolean) => {
  return cn(
    'typo-pre-body-5 h-[40px] sm:h-[56px]',
    'border-b-2',
    isActive ?
      'border-primary-3 text-primary-3'
    : 'border-transparent text-grey-7',
  )
}

export const ProjectTabs = ({ tab }: ProjectTabsProps) => {
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>()

  const { data: project, isLoading } = useProjectRetrieveQuery({
    variables: { slug },
  })

  const { isShared, isOwned } = project || {}
  const isReadOnly = Boolean(isShared && !isOwned)
  const tabs = isReadOnly ? READONLY_TABS : ALL_TABS

  useEffect(() => {
    if (isReadOnly && tab === 'schematic') {
      router.replace(`/project/${slug}?tab=project`)
    }
  }, [isReadOnly, router, slug, tab])

  return (
    <div className="flex gap-4 h-full justify-end sm:justify-start">
      <LoadingView
        isLoading={isLoading}
        fallback={<Skeleton className="w-[250px] h-6" />}
      >
        {tabs.map(({ key, label }) => (
          <Button
            key={key}
            variant="ghost"
            size="fit"
            asChild
            className={getTabStyles(tab === key)}
          >
            <Link href={{ search: `tab=${key}` }}>{label}</Link>
          </Button>
        ))}
      </LoadingView>
    </div>
  )
}
