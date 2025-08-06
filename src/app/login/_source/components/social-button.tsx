'use client'

import { useSearchParams } from 'next/navigation'

import {
  Kakao,
  KakaoButton,
  Naver,
  NaverButton,
} from '@toktokhan-dev/react-web'

import { ENV } from '@/configs/env'

const kakao = new Kakao(ENV.KAKAO_CLIENT_ID)
const naver = new Naver(ENV.NAVER_CLIENT_ID)

export const SocialButton = () => {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')

  return (
    <div className="flex flex-col gap-[12px] mt-[36px] sm:mt-[56px] w-full items-center px-[16px]">
      <div className="w-full sm:w-[480px] h-[54px]">
        <KakaoButton
          colorMode="light"
          onClick={() =>
            kakao.loginToLink({
              redirect_uri: `${window.origin}/social/callback`,
              state: {
                returnUrl: returnUrl || '/',
                type: 'kakao',
              },
              prompt: 'login',
            })
          }
        />
      </div>
      <div className="w-full sm:w-[480px] h-[54px]">
        <NaverButton
          colorMode="light"
          onClick={() =>
            naver.loginToLink({
              redirect_uri: `${window.origin}/social/callback`,
              state: {
                returnUrl: returnUrl || '/',
                type: 'naver',
              },
            })
          }
        />
      </div>
    </div>
  )
}
