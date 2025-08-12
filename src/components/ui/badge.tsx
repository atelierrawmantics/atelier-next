import { cn } from '@/lib/utils'

interface BadgeProps {
  text: string

  badgeClassName?: string
  textClassName?: string
}

const Badge = ({ text, badgeClassName, textClassName }: BadgeProps) => {
  return (
    <div
      className={cn(
        'w-fit',
        'py-[2px] px-[8px]',
        'border-1 border-primary-3 rounded-[8px]',
        badgeClassName,
      )}
    >
      <p className={cn(textClassName)}>{text}</p>
    </div>
  )
}

export default Badge
