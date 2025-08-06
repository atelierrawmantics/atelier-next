'use client'

import { useRouter } from 'next/navigation'

import { useOauthLinkCallback } from '@toktokhan-dev/react-web'

import { Loader2Icon } from 'lucide-react'

import setToken from '@/actions/set-token'
import { COOKIE_KEYS } from '@/constants/cookie-keys'
import {
  CommonErrorType,
  UserSocialLoginRequestStateEnumType,
  UserSocialLoginValidationErrorType,
} from '@/generated/apis/@types/data-contracts'
import { useUserSocialLoginCreateMutation } from '@/generated/apis/User/User.query'
import { clientCookie } from '@/stores/cookie/store'

import { OauthCallback } from '../types'

export const PopupCallback = () => {
  const router = useRouter()
  const { mutateAsync: socialLoginMutate } = useUserSocialLoginCreateMutation(
    {},
  )
  useOauthLinkCallback<OauthCallback>({
    onSuccess: async (oAuthResponse) => {
      const { code, state } = oAuthResponse || {}
      if (!code || !state) return

      try {
        const loginResponse = await socialLoginMutate({
          data: {
            code: code,
            state: state.type as UserSocialLoginRequestStateEnumType,
          },
        })

        const { accessToken, refreshToken } = loginResponse || {}
        await setToken({
          accessToken,
          refreshToken,
        })
        router.replace('/')
      } catch (errResponse) {
        const err = errResponse as unknown as
          | UserSocialLoginValidationErrorType
          | CommonErrorType

        if (
          'error' in err &&
          err.error &&
          typeof err.error === 'object' &&
          'registerToken' in err.error
        ) {
          clientCookie.set(
            COOKIE_KEYS.AUTH.REGISTER_TOKEN,
            err.error.registerToken as string,
          )

          router.replace('/join')
        }

        // 기타 에러 처리
      }
    },
    onFail: (oAuthResponse) => {
      console.log('OAuth failed:', oAuthResponse)
    },
  })
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2Icon className="animate-spin" size={36} />
    </div>
  )
}
