import { PropsWithChildren, ReactNode } from 'react'

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
            <div className="w-full container h-[92px] sm:h-[56px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px] sm:gap-0 pt-[12px] sm:pt-0">
              {header.map((component, index) => (
                <div key={index}>{component}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex-1 overflow-auto">{children}</div>
    </div>
  )
}
