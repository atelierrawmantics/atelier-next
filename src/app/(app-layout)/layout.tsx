'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { MY_IMAGES } from '@/generated/path/images'
import { cn } from '@/lib/utils'

import { AppLayoutHeader } from './_source/components/app-layout-header/app-layout-header'

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

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { open } = useSidebar()

  return (
    <div className="h-screen overflow-hidden">
      {/* 헤더 - 최상단 고정 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <AppLayoutHeader />
      </div>

      {/* 사이드바 - 헤더 아래 고정 */}
      <AppSidebar />

      {/* 콘텐츠 영역 - 헤더와 사이드바를 제외한 영역 */}
      <div
        className={cn(
          'fixed top-[60px] left-0 right-0 bottom-0 bg-gray-50 transition-all duration-200 ease-in-out',
          open ? 'ml-0 md:ml-[240px]' : 'ml-0 md:ml-[60px]',
        )}
      >
        {/* 배경 이미지 */}
        <BgDot />

        {/* 콘텐츠 */}
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppContent>{children}</AppContent>
    </SidebarProvider>
  )
}
