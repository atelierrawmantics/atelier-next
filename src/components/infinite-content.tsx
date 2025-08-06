import { ReactNode } from 'react'

import { useIntersectionObserver } from '@toktokhan-dev/react-web'

import { Loader2Icon } from 'lucide-react'
import { ClassNameValue } from 'tailwind-merge'

import { cn } from '@/lib/utils'

export interface InfinityContentProps {
  /**
   * 자식 컴포넌트
   */
  children: ReactNode
  /**
   * 다음 페이지가 있는지 여부
   */
  hasMore: boolean
  /**
   * 데이터를 가져오고 있는지 여부
   */
  isFetching: boolean
  /**
   * 데이터를 가져오는 함수
   */
  onFetchMore: () => void
  /**
   * IntersectionObserver 옵션
   */
  observerOption?: IntersectionObserverInit
  /**
   * isFetching 시 보여줄 스피너
   */
  spinner?: ReactNode
  /**
   * 스타일
   */
  styles?: {
    /**
     * 컨테이너 스타일
     */
    container?: ClassNameValue
    /**
     * 바텀 플래그 스타일
     */
    bottomFlag?: ClassNameValue
  }
}

/**
 * @category Component
 *
 * 무한 스크롤을 구현할 수 있는 컴포넌트입니다.
 * 자식에 랜더링하고 싶은 컴포넌트(리스트 컴포넌트)를 받아 랜더링합니다.
 * 유저의 화면이 스크롤 될때 observer 가 보고 있는 요소가 화면에 보이면 `onFetchMore` 함수를 호출합니다.
 *
 * @example
 * ```tsx
 *
 * const ExampleComponent = () => {
 *  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePostsInfiniteQuery();
 *
 *  return (
 *   <InfinityContent
 *      hasMore={hasNextPage}
 *      isFetching={isFetchingNextPage}
 *      onFetchMore={fetchNextPage}
 *   >
 *    <PostList data={data} />
 *  </InfinityContent>
 *  )
 * }
 * ```
 *
 */
export const InfinityContent = ({
  children,
  hasMore,
  isFetching,
  onFetchMore,
  observerOption,
  styles,
  spinner = (
    <div className="flex justify-center items-center">
      <Loader2Icon size={'sm'} />
    </div>
  ),
}: InfinityContentProps) => {
  const canFetch = hasMore && !isFetching
  const { targetRef: bottomRef } = useIntersectionObserver(
    {
      onVisible: () => {
        if (!canFetch) return
        onFetchMore()
      },
      options: {
        root: observerOption?.root ?? null,
        rootMargin: observerOption?.rootMargin ?? '0px',
        threshold: observerOption?.threshold ?? 0.5,
      },
    },
    [canFetch],
  )

  return (
    <div aria-label={'container'} className={cn('w-full', styles?.container)}>
      {children}
      <div
        ref={bottomRef as React.RefObject<HTMLDivElement>}
        aria-label={'flag'}
        className={cn('w-full', styles?.bottomFlag)}
      >
        {isFetching && spinner}
      </div>
    </div>
  )
}
