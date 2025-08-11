'use client'

import { useParams } from 'next/navigation'

import { LoadingView } from '@toktokhan-dev/react-universal'

import { useProjectTaskListQuery } from '@/generated/apis/Task/Task.query'

import { LoadingTask } from './_source/components/loading-task'
import { TaskContainer } from './_source/components/task-container'

export const Task = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading } = useProjectTaskListQuery({
    variables: {
      projectSlug: slug,
    },
    options: {
      enabled: !!slug,
    },
  })

  return (
    <LoadingView isLoading={isLoading} fallback={<LoadingTask />}>
      <TaskContainer data={data!} />
    </LoadingView>
  )
}
