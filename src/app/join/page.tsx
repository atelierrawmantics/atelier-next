import { JoinForm } from './_source/components/join-form'

export const metadata = {
  title: '회원가입',
  description: '회원가입 페이지',
}

export default function JoinPage() {
  return (
    <div className="container w-screen h-screen flex justify-center items-center">
      <JoinForm />
    </div>
  )
}
