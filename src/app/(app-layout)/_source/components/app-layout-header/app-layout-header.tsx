'use client'

import Link from 'next/link'

import { logout } from '@/actions/logout'
import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/generated/icons/MyIcons'

import { AppLayoutDrawer } from './components/app-layout-drawer'

export const AppLayoutHeader = () => {
  return (
    <header className="h-[60px] w-screen bg-white px-[20px] py-[12px]">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="fit" asChild>
          <Link href="/">
            <LogoIcon className="w-[100px] h-[24px] my-[4px]" />
          </Link>
        </Button>
        <div className="md:hidden">
          <AppLayoutDrawer />
        </div>
        <Button
          variant="outline-grey"
          size="sm"
          className="w-[61px] hidden md:block"
          onClick={() => logout()}
        >
          로그아웃
        </Button>
      </div>
    </header>
  )
}
