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
    default: 'Atelier',
    template: `%s | Atelier`,
  },
  description: '디지털프로덕트의 TOKTOK한 경험',
  applicationName: 'Atelier',
  keywords: ['Atelier', '디지털프로덕트의 TOKTOK한 경험', '...'],
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
    description: '디지털프로덕트의 TOKTOK한 경험',
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
    description: '디지털프로덕트의 TOKTOK한 경험',
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
