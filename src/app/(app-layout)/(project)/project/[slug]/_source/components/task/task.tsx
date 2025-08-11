'use client'

import { useParams } from 'next/navigation'

import { EmptyView, LoadingView } from '@toktokhan-dev/react-universal'

import { useProjectTaskListQuery } from '@/generated/apis/Task/Task.query'

import { EmptyTask } from './_source/components/empty-task'
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
      <EmptyView
        fallback={
          <div className="container pt-[16px] sm:pt-[20px] md:pt-[36px] h-full">
            <EmptyTask />
          </div>
        }
        data={data}
      >
        <TaskContainer data={data!} />
      </EmptyView>
    </LoadingView>
  )
}
