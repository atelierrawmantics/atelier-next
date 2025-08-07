import { cookies } from 'next/headers'

import { COOKIE_KEYS } from '@/constants/cookie-keys'

import { AppContent } from './_source/components/app-content'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const accessToken = cookies().get(COOKIE_KEYS.AUTH.ACCESS_TOKEN)?.value
  const refreshToken = cookies().get(COOKIE_KEYS.AUTH.REFRESH_TOKEN)?.value
  const isLoggedIn = !!accessToken && !!refreshToken

  return isLoggedIn ? <AppContent>{children}</AppContent> : <>{children}</>
}
