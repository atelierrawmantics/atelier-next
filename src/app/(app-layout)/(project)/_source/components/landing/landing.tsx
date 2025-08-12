'use client'

import { cn } from '@/lib/utils'

import FeatureAiDiagram from './components/feature-ai-diagram'
import FeatureProjectProgress from './components/feature-project-progress'
import FeatureWorkOrder from './components/feature-work-order'
import Footer from './components/footer'
import GettingStart from './components/getting-start'
import Header from './components/header'
import HeroBanner from './components/hero-banner'
import Purpose from './components/purpose'

export const Landing = () => {
  return (
    <div className="relative w-screen">
      {/* header */}
      <header className="sticky top-0 right-0 z-50 bg-grey-0 border-b border-gray-200">
        <Header />
      </header>

      {/* content */}
      <main className={cn('w-full max-w-[1920px] mx-auto pt-[80px]')}>
        <HeroBanner />
        <Purpose />
        <FeatureWorkOrder />
        <FeatureProjectProgress />
        <FeatureAiDiagram />
        <GettingStart />
      </main>

      {/* footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
