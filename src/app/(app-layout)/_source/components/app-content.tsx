'use client'

import { usePathname } from 'next/navigation'

import { AppSidebar } from '@/components/app-sidebar'
import { BgDot } from '@/components/bg-dot'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import { AppLayoutHeader } from './app-layout-header/app-layout-header'

interface AppContentInnerProps {
  isLoggedIn: boolean
  children: React.ReactNode
}

const AppContentInner = ({ isLoggedIn, children }: AppContentInnerProps) => {
  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col">
      {/* 헤더 - 최상단 고정 */}
      {isLoggedIn && (
        <div className="bg-white border-b border-border-basic-1">
          <AppLayoutHeader />
        </div>
      )}

      <div className="flex w-full flex-1 overflow-hidden">
        {/* 사이드바 - 헤더 아래 고정 */}
        {isLoggedIn && <AppSidebar />}

        {/* 콘텐츠 영역 - 헤더와 사이드바를 제외한 영역 */}
        <div className={cn('flex flex-col', 'flex-1 h-full')}>
          {/* 배경 이미지 */}
          <BgDot />

          {/* 콘텐츠 */}
          <div className="w-full flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  )
}

export const AppContent = ({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode
  isLoggedIn: boolean
}) => {
  const pathname = usePathname()
  const isRootPath = pathname === '/'

  return (
    isLoggedIn ?
      <SidebarProvider defaultOpen={false}>
        <AppContentInner isLoggedIn={isLoggedIn}>{children}</AppContentInner>
      </SidebarProvider>
    : isRootPath ? <>{children}</>
    : <AppContentInner isLoggedIn={isLoggedIn}>{children}</AppContentInner>
  )
}
