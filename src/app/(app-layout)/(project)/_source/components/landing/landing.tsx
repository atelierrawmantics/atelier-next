import { cn } from '@/lib/utils'

import { LandingHeader } from './components/landing-header'

export const Landing = () => {
  return (
    <div className="h-screen overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 bg-grey-0 border-b border-gray-200">
        <LandingHeader />
      </div>
      <div
        className={cn(
          'fixed top-[80px] left-0 right-0 bottom-0 bg-grey-0 transition-all duration-200 ease-in-out',
        )}
      >
        <div className="w-full h-full">Landing Page ......</div>
      </div>
    </div>
  )
}
