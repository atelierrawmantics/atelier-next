'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { FolderIcon, UserIcon } from '@/generated/icons/MyIcons'

// 사이드바 콘텐츠 컴포넌트
function SidebarContentComponent() {
  const segment = useSelectedLayoutSegment()

  const isProject = segment?.includes('project')

  return (
    <div className="flex flex-col h-full bg-white">
      <SidebarHeader className="flex items-end justify-center bg-accent-deepgrey2 p-[8px] h-[32px]">
        <SidebarTrigger className="size-fit" />
      </SidebarHeader>

      <div className="flex-1">
        <SidebarMenu>
          {/* 프로젝트 관리 메뉴 (선택된 상태) */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="프로젝트 관리"
              asChild
              isActive={isProject}
            >
              <Link href="/">
                <FolderIcon className="size-[20px] text-transparent" />
                <span>프로젝트 관리</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* 마이페이지 메뉴 */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="마이페이지"
              asChild
              isActive={!isProject}
            >
              <Link href="/mypage">
                <UserIcon className="size-[20px]" />
                <span>마이페이지</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  )
}

// 메인 사이드바 컴포넌트
export function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="min-w-[60px] max-w-[240px] w-full border-r border-border-basic-1"
      style={{
        boxShadow:
          '15px 0 80px 0 rgba(27, 28, 29, 0.02), 4px 0 10px 0 rgba(27, 28, 29, 0.02)',
      }}
    >
      <SidebarContentComponent />
    </Sidebar>
  )
}
