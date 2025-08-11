'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { MY_IMAGES } from '@/generated/path/images'
import { cn } from '@/lib/utils'

import { AppLayoutHeader } from './app-layout-header/app-layout-header'

const BgDot = () => {
  return (
    <div
      className="fixed top-0 w-screen h-screen z-[-1] bg-accent-deepgrey2"
      style={{
        backgroundImage: `url(${MY_IMAGES.DOT.src})`,
        backgroundPosition: '100% 75%',
      }}
    />
  )
}

const AppContentInner = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col">
      {/* 헤더 - 최상단 고정 */}
      <div className="bg-white border-b border-border-basic-1">
        <AppLayoutHeader />
      </div>

      <div className="flex w-full flex-1 overflow-hidden">
        {/* 사이드바 - 헤더 아래 고정 */}
        <AppSidebar />

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

export const AppContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppContentInner>{children}</AppContentInner>
    </SidebarProvider>
  )
}
