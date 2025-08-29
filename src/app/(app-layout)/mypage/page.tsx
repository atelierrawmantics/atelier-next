import { ProfileForm } from './_source/profile-form'

export const metadata = {
  title: '마이페이지',
  description: '마이페이지',
}

export default function MyPage() {
  return (
    <div className="w-full h-full overflow-auto">
      <div className="container w-full h-fit flex flex-col items-center">
        <ProfileForm />
      </div>
    </div>
  )
}
