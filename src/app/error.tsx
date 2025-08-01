'use client'

import { useRouter } from 'next/navigation'

/**
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter()
  const handleReset = () => {
    reset()
    router.back()
  }
  return (
    <div className="flex-1 h-screen bg-black">
      <div>Internet Server Error</div>
    </div>
  )
}
