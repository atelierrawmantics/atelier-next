import { PropsWithChildren, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ProjectContentProps {
  header: ReactNode[]
}

export const ProjectContent = ({
  header,
  children,
}: PropsWithChildren<ProjectContentProps>) => {
  return (
    <div className="w-full h-[calc(100vh-56px)] flex flex-col overflow-hidden">
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

      <div className="w-full flex-1 flex-col overflow-auto">{children}</div>
    </div>
  )
}
