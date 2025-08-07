import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/generated/icons/MyIcons'

export const LandingHeader = () => {
  return (
    <header className="fixed h-[80px] w-screen bg-white border-b border-gray-200 py-[12px]">
      <div className="flex items-center justify-between container h-full">
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
    </header>
  )
}
