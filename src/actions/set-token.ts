'use server'

import { cookies } from 'next/headers'

import { jwtDecode } from '@toktokhan-dev/universal'

import { COOKIE_KEYS } from '@/constants/cookie-keys'
import { JwtDecodeType } from '@/types/jwt-decode'
import { calcMaxAge } from '@/utils/middleware/calc-max-age'
import { getJwtCookieOptions } from '@/utils/middleware/get-jwt-cookie-option'

export default async function setToken({
  accessToken,
  refreshToken,
}: {
  accessToken: string
  refreshToken: string
}) {
  const decodedRefresh = jwtDecode<JwtDecodeType>(refreshToken)
  const refreshMaxAge = calcMaxAge({ exp: decodedRefresh?.exp })

  cookies().set(
    COOKIE_KEYS.AUTH.ACCESS_TOKEN,
    accessToken,
    getJwtCookieOptions(refreshMaxAge),
  )
  cookies().set(
    COOKIE_KEYS.AUTH.REFRESH_TOKEN,
    refreshToken,
    getJwtCookieOptions(refreshMaxAge),
  )
}
