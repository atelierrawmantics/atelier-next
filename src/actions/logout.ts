'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { COOKIE_KEYS } from '@/constants/cookie-keys'

export async function logout({ redirectUrl }: { redirectUrl?: string } = {}) {
  cookies().delete(COOKIE_KEYS.AUTH.ACCESS_TOKEN)
  cookies().delete(COOKIE_KEYS.AUTH.REFRESH_TOKEN)
  redirect(redirectUrl ?? '/')
}
