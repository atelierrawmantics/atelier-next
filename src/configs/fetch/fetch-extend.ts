import { ENV } from '@/configs/env'

import { fetchHelperInterceptors } from './fetch-interceptors'

export const fetchExtended = fetchHelperInterceptors({
  baseUrl: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
