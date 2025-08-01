'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

/**
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default function NotFound() {
  const router = useRouter()
  return (
    <div className="flex-1 h-screen w-screen flex flex-col items-center justify-center">
      <p className="typo-pre-display-1 text-primary-3">404</p>
      <p className="typo-pre-heading-3 text-grey-9 mt-[8px]">
        현재 페이지를 찾을 수 없습니다.
      </p>
      <p className="typo-pre-body-2 text-grey-9 whitespace-pre-line text-center mt-[20px]">
        {
          '요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있어요.\n입력하신 주소를 다시 확인해 주세요.'
        }
      </p>
      <Button className="w-[196px] mt-[40px]" onClick={router.back}>
        이전 페이지로
      </Button>
    </div>
  )
}
