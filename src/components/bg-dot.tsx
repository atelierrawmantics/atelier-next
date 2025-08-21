import { MY_IMAGES } from '@/generated/path/images'

export const BgDot = () => {
  return (
    <div
      className="fixed top-0 w-screen h-screen z-[-1] bg-accent-deepgrey2"
      style={{
        backgroundImage: `url(${MY_IMAGES.DOT.src})`,
        backgroundPosition: '100% 75%',
      }}
    />
  )
}
