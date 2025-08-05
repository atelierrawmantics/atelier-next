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
        <div className="relative w-full">
          <div className="w-full bg-background-basic-1">
            <div className="w-full container h-[56px] flex items-center justify-between">
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
