import { PropsWithChildren, ReactNode } from 'react'

import { ClassNameValue } from 'tailwind-merge'

import { cn } from '@/lib/utils'

interface ProjectContentProps {
  header: ReactNode[]
  contentClassName?: ClassNameValue
}

export const ProjectContent = ({
  header,
  children,
  contentClassName,
}: PropsWithChildren<ProjectContentProps>) => {
  return (
    <div className="w-full h-full flex flex-col">
      {header && (
        <div className="relative w-full border-b border-border-basic-1">
          <div className="w-full bg-background-basic-1">
            <div
              className={cn(
                'w-full container sm:h-[56px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px] sm:gap-0 sm:pt-0',
                header.length > 1 ?
                  'h-[92px] pt-[12px]'
                : 'h-[56px] pt-0 justify-center',
              )}
            >
              {header.map((component, index) => (
                <div key={index}>{component}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          'w-full flex-1 flex-col overflow-auto pb-[80px]',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
