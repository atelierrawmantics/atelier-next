'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { throttle } from 'lodash-es'

import { logout } from '@/actions/logout'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  FolderIcon,
  ListIcon,
  LogoIcon,
  UserIcon,
  XIcon,
} from '@/generated/icons/MyIcons'

export const AppLayoutDrawer = () => {
  const [open, setOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const pathname = usePathname()

  console.log(pathname)

  const handleOpenChange = (v: boolean) => {
    if (isAnimating) return
    setOpen(v)
    setIsAnimating(true)
  }

  const handleAnimationEnd = () => {
    setIsAnimating(false)
  }

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleResize = throttle(() => {
      if (window.innerWidth <= 1440 && open) {
        setOpen(false)
      }
    }, 200)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      handleResize.cancel()
    }
  }, [open])

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={handleOpenChange}
      onAnimationEnd={handleAnimationEnd}
    >
      <DrawerTrigger asChild>
        <Button variant="ghost" size="fit" aria-label="menu">
          <ListIcon className="size-[32px] text-primary-3 cursor-pointer" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-grey-0 min-w-[calc(100vw-75px)] sm:min-w-[calc(100vw-168px)] !border-0">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-center justify-between h-[60px] px-[20px] py-[12px] border-b border-border-basic-1">
            <Button variant="ghost" size="fit" asChild>
              <Link href="/">
                <LogoIcon className="w-[80px] h-[20px] my-[6.4px]" />
              </Link>
            </Button>
            <DrawerClose asChild className="size-[32px]">
              <Button variant="ghost" size="fit" aria-label="close">
                <XIcon className="size-[32px] text-primary-3" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">
            <SidebarMenu>
              {/* 프로젝트 관리 메뉴 (선택된 상태) */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="data-[state=collapsed]:[&>span]:flex"
                  asChild
                  isActive={pathname === '/'}
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
                  className="data-[state=collapsed]:[&>span]:flex"
                  asChild
                  isActive={pathname === '/mypage'}
                >
                  <Link href="/mypage">
                    <UserIcon className="size-[20px]" />
                    <span>마이페이지</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
          <DrawerFooter className="w-full flex flex-col items-end justify-center">
            <Button
              variant="outline-grey"
              size="sm"
              className="w-[61px]"
              onClick={() => logout()}
            >
              로그아웃
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
