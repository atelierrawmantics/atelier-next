import { useRouter } from 'next/navigation'

import { useOauthPopupCallback } from '@toktokhan-dev/react-web'

import setToken from '@/actions/set-token'
import { UserSocialLoginRequestStateEnumType } from '@/generated/apis/@types/data-contracts'
import { useUserSocialLoginCreateMutation } from '@/generated/apis/User/User.query'

import { OauthCallback } from '../types'

export const PopupCallback = () => {
  const router = useRouter()
  const { mutate: socialLoginMutate } = useUserSocialLoginCreateMutation({})
  useOauthPopupCallback<OauthCallback>({
    onSuccess: (oAuthResponse) => {
      const { code, state } = oAuthResponse || {}
      if (!code || !state) return
      socialLoginMutate(
        {
          data: {
            code: code,
            state: state.type as UserSocialLoginRequestStateEnumType,
          },
        },
        {
          onSuccess: async (loginResponse) => {
            const { accessToken, refreshToken } = loginResponse || {}
            await setToken({
              accessToken,
              refreshToken,
            })
            router.replace('/join')
          },
        },
      )
      oAuthResponse?.closePopup()
    },
    onFail: (oAuthResponse) => {
      oAuthResponse?.closePopup()
    },
  })
  return <div>PopupCallback</div>
}
