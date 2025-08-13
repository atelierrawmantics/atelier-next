import { ClassNameValue } from 'tailwind-merge'

import { cn } from '@/lib/utils'

// 테이블 헤더 컴포넌트
interface TableHeaderProps {
  className?: ClassNameValue
  headers: string[]
  sizeNames?: string[]
  sizeNamesIndex?: number
}

export const TableHeader = ({
  className,
  headers,
  sizeNames,
  sizeNamesIndex,
}: TableHeaderProps) => {
  return (
    <div className={cn(`grid gap-[4px] items-center space-y-[4px]`, className)}>
      {headers.map((header, index) => (
        <div key={index} className="typo-pre-body-5 text-grey-9 text-center">
          {(
            sizeNames &&
            sizeNamesIndex !== undefined &&
            index > 0 &&
            index < headers.length - 1
          ) ?
            sizeNames[index - 1] || header
          : header}
        </div>
      ))}
    </div>
  )
}
