import { ProfileForm } from './_source/profile-form'

export const metadata = {
  title: '마이페이지',
  description: '마이페이지',
}

export default function MyPage() {
  return (
    <div className="container w-screen h-[100dvh] flex justify-center items-center">
      <ProfileForm />
    </div>
  )
}
