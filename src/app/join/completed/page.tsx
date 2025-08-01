import Link from 'next/link'

import { CheckIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const metadata = {
  title: '회원가입 완료',
  description: '회원가입 완료 페이지',
}

export default function JoinCompletedPage() {
  return (
    <div className="container w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-[12px] max-w-[448px] w-full items-center">
        <div className="flex justify-center items-center size-[64px] bg-secondary-2 rounded-full">
          <CheckIcon className="size-[32px] text-primary-3" />
        </div>
        <h1 className="typo-pre-heading-2 text-grey-9">
          회원가입이 완료 되었습니다.
        </h1>
        <p className="typo-pre-body-4 text-grey-9 whitespace-pre-line text-center">
          {
            '아뜰리에 회원이 되신 것을 환영합니다!\n프로젝트 관리에서 작업지시서 생성부터 시작해보세요.'
          }
        </p>
        <Button className="mt-[48px]">
          <Link href="/">프로젝트 관리로 이동</Link>
        </Button>
      </div>
    </div>
  )
}
