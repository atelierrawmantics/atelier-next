import { Suspense } from 'react'

import { Metadata } from 'next'

import { LogoIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

import { SocialButton } from './_source/components/social-button'

export const metadata: Metadata = {
  title: '로그인',
}

export default function LoginPage() {
  return (
    <div className="flex flex-row flex-1 h-[100dvh]">
      <InfoSection />
      <LoginSection />
    </div>
  )
}

const InfoSection = () => {
  return (
    <div
      className={cn(
        'hidden flex-1 md:flex flex-col items-center justify-center gap-[64px] pt-[140px]',
        'bg-[linear-gradient(215deg,_#D5E3FC_0.31%,_#F6FAF6_104.05%)]',
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-[8px] border-1 w-fit px-[8px] py-[2px]">
          <p className="typo-pre-body-5 text-primary-3 text-center">
            복잡한 협업, 이제 간단하게
          </p>
        </div>
        <p className="typo-pre-display-3 whitespace-pre-line text-center w-full mt-[16px]">
          {'패션 협업,\n아뜰리에 하나로 통합합니다.'}
        </p>
      </div>

      <div className="relative flex w-full flex-1 px-[80px] items-center justify-center">
        <div className="w-full max-w-[800px] h-full bg-no-repeat bg-top bg-contain bg-[url('/images/login-bg.png')]" />
      </div>
    </div>
  )
}

const LoginSection = () => {
  return (
    <div
      className={cn(
        'flex flex-1 w-full flex-col items-center justify-center',
        'bg-[linear-gradient(215deg,_#D5E3FC_0.31%,_#F6FAF6_104.05%)] md:bg-none',
      )}
    >
      <LogoIcon className="w-[109px] h-[26px]" />
      <p className="px-[16px] mt-[16px] typo-pre-body-6 text-grey-9 whitespace-pre-line sm:whitespace-normal text-center">
        {'패션 디자이너를 위한 협업,\n지금 간편 로그인으로 시작해보세요.'}
      </p>
      <Suspense fallback={<></>}>
        <SocialButton />
      </Suspense>
    </div>
  )
}
