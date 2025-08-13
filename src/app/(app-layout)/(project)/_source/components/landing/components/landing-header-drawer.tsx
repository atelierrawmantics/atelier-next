import { useEffect } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ListIcon, XIcon } from '@/generated/icons/MyIcons'
import { useDrawerAutoClose } from '@/hooks/use-drawer-auto-close'

export const LandingHeaderDrawer = () => {
  const { open, setOpen, handleOpenChange, handleAnimationEnd } =
    useDrawerAutoClose()

  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <Drawer
      direction="top"
      open={open}
      onOpenChange={handleOpenChange}
      onAnimationEnd={handleAnimationEnd}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="fit"
          aria-label="menu"
          className="sm:hidden"
        >
          <ListIcon className="size-[32px] text-primary-3 cursor-pointer" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-grey-0 h-[204px] min-w-full w-full !border-0">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-center justify-end h-[60px] px-[20px] py-[12px] border-b border-border-basic-1">
            <DrawerClose asChild className="size-[32px]">
              <Button variant="ghost" size="fit" aria-label="close">
                <XIcon className="size-[32px] text-primary-3" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
        </div>
        <div className="flex flex-col h-full p-[20px] gap-[8px]">
          <Button variant="outline-primary">
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="solid-primary">
            <Link href="/login">Sign up for free</Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
