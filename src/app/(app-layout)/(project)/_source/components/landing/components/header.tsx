import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

const Header = () => {
  return (
    <div className="absolute top-0 right-0 h-[80px] w-screen bg-white border-b border-gray-200">
      <div
        className={cn(
          'flex items-center justify-between',
          'w-full h-full max-w-[1280px]',
          'mx-auto py-[12px] px-[16px] sm:px-[40px] md:px-0',
        )}
      >
        <Button variant="ghost" size="fit" asChild>
          <Link href="/">
            <LogoIcon className="w-[100px] h-[24px] my-[4px]" />
          </Link>
        </Button>

        <div className="flex items-center gap-[8px]">
          <Button
            variant="outline-primary"
            size="md"
            className="w-fit hidden md:block"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            variant="solid-primary"
            size="md"
            className="w-fit hidden md:block"
          >
            <Link href="/login">Sign up for free</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Header
