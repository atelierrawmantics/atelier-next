import { MY_IMAGES } from '@/generated/path/images'
import { cn } from '@/lib/utils'

interface BgDotProps {
  className?: string
}

export const BgDot = ({ className }: BgDotProps) => {
  return (
    <div
      className={cn(
        'fixed top-0 w-screen h-screen z-[-1] bg-accent-deepgrey2',
        className,
      )}
      style={{
        backgroundImage: `url(${MY_IMAGES.DOT.src})`,
        backgroundPosition: '100% 75%',
      }}
    />
  )
}
