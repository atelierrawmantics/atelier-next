'use client'

import { useSearchParams } from 'next/navigation'

import {
  Kakao,
  KakaoButton,
  Naver,
  NaverButton,
  useOauthPopupListener,
} from '@toktokhan-dev/react-web'

import { OauthCallback } from '@/app/social/callback/_source/types'
import { ENV } from '@/configs/env'

const kakao = new Kakao(ENV.KAKAO_CLIENT_ID)
const naver = new Naver(ENV.NAVER_CLIENT_ID)

export const SocialButton = () => {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')

  useOauthPopupListener<OauthCallback>({
    onSuccess: (res) => {
      console.log('res', res)
      // if (!res?.code || !res.state) return // TODO: error handling
      // mutateAsync({
      //   data: {
      //     code: res.code,
      //     type: res.state.type,
      //   },
      // }).then((res) =>
      // save token to client storage
      //
    },
    onFail: () => {
      // console.log('fail')
    },
  })

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
