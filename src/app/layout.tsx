import { Metadata, Viewport } from 'next'

import { Toaster } from '@/components/ui/sonner'
import { ENV } from '@/configs/env'
import { pretendard } from '@/generated/fonts/next-fonts'
import { AppProvider } from '@/providers/app-provider'

import './global.css'

// import { GoogleAnalytics } from "@next/third-parties/google";

/**
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

/**
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */

export const metadata: Metadata = {
  ...(ENV.DOMAIN && { metadataBase: new URL(ENV.DOMAIN) }),
  title: {
    default: 'Atelier – 패션 협업의 새로운 표준.',
    template: `%s | Atelier`,
  },
  description:
    'AI로 똑똑하게 작업지시서를 만들고, 생산 과정을 한눈에 관리하세요. 아이디어에서 완성까지, 당신의 디자인 여정을 매끄럽게 연결합니다.',
  applicationName: 'Atelier',
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/120.png', sizes: '120x120' },
    { rel: 'apple-touch-icon', url: '/icons/152.png', sizes: '152x152' },
    { rel: 'apple-touch-icon', url: '/icons/167.png', sizes: '167x167' },
    { rel: 'apple-touch-icon', url: '/icons/180.png', sizes: '180x180' },
    { rel: 'apple-touch-icon', url: '/icons/192.png', sizes: '192x192' },
    { rel: 'apple-touch-icon', url: '/icons/384.png', sizes: '384x384' },
    { rel: 'apple-touch-icon', url: '/icons/512.png', sizes: '512x512' },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'shortcut icon',
      url: '/favicon.ico',
    },
  ],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'ko',
    siteName: 'Atelier',
    title: {
      default: 'Atelier',
      template: `Atelier | %s`,
    },
    description:
      'AI로 똑똑하게 작업지시서를 만들고, 생산 과정을 한눈에 관리하세요. 아이디어에서 완성까지, 당신의 디자인 여정을 매끄럽게 연결합니다.',
    images: [
      {
        url: '/images/new_og.png',
        width: 600,
        height: 315,
        alt: 'Og Image Alt',
        type: 'image/png',
      },
    ],
    url: ENV.DOMAIN,
  },
  twitter: {
    card: 'summary_large_image',
    images: `/images/new_og.png`,
    title: 'Atelier',
    description:
      'AI로 똑똑하게 작업지시서를 만들고, 생산 과정을 한눈에 관리하세요. 아이디어에서 완성까지, 당신의 디자인 여정을 매끄럽게 연결합니다.',
    site: '@site',
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
}

/**
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable}`}
      suppressHydrationWarning
    >
      <head>{/* <GoogleAnalytics gaId={ENV.GA_KEY || ""} /> */}</head>
      <body>
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  )
}
