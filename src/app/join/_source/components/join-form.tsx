'use client'

import { useState } from 'react'

import { omit } from 'lodash-es'

import { Button } from '@/components/ui/button'
import { ClearableInput } from '@/components/ui/clearable-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { VerificationInput } from '@/components/ui/verification-input'
import {
  usePhoneVerifierConfirmCreateMutation,
  usePhoneVerifierCreateMutation,
} from '@/generated/apis/PhoneVerifier/PhoneVerifier.query'
import { useUserRegisterCreateMutation } from '@/generated/apis/User/User.query'
import { ArticleIcon } from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'

import { useJoinForm } from '../hooks/use-join-form'

export const JoinForm = () => {
  const form = useJoinForm()
  const {
    control,
    formState: { isDirty, isValid, errors },
    getValues,
    handleSubmit,
  } = form
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const hasPhoneValue = !!getValues('phone')
  const isDisabledToSendVerification =
    !hasPhoneValue || !!errors.phone || isTimerActive

  const { mutate: createPhoneVerifier } = usePhoneVerifierCreateMutation({})
  const { mutate: createPhoneVerifierConfirm } =
    usePhoneVerifierConfirmCreateMutation({})
  const { mutate: createUserRegister } = useUserRegisterCreateMutation({})

  const handleSendVerification = () => {
    createPhoneVerifier(
      {
        data: {
          phone: getValues('phone'),
        },
      },
      {
        onSuccess: () => {
          setIsVerificationSent(true)
          setIsTimerActive(true)
        },
      },
    )
  }

  const handleTimerExpired = () => {
    setIsTimerActive(false)
    toast(
      '인증 시간이 만료되었습니다. 재전송 해주세요.',
      {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      },
      'error',
    )
  }

  // 생년월일 입력 핸들러 - 숫자만 허용, 자동 하이픈 삽입
  const handleBirthdayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const inputValue = e.target.value
    const numbers = inputValue.replace(/\D/g, '')

    if (numbers.length > 8) return

    // 사용자가 입력한 값의 길이가 현재 저장된 값보다 짧으면 삭제 중
    const currentValue = e.target.defaultValue || ''
    const isDeleting = inputValue.length < currentValue.length

    if (isDeleting) {
      // 삭제 중일 때는 사용자가 입력한 값을 그대로 저장
      onChange(inputValue)
    } else {
      // 입력 중일 때는 포맷팅 적용
      let formattedValue = numbers
      if (numbers.length >= 4) {
        const year = numbers.substring(0, 4)
        const month = numbers.substring(4, 6)
        const day = numbers.substring(6, 8)

        if (numbers.length >= 6) {
          formattedValue = `${year}-${month}-${day}`
        } else if (numbers.length >= 4) {
          formattedValue = `${year}-${month}`
        }
      }

      onChange(formattedValue)
    }
  }

  // 휴대폰번호 입력 핸들러 - 숫자만 허용, 자동 하이픈 삽입
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const inputValue = e.target.value
    const numbers = inputValue.replace(/\D/g, '')

    if (numbers.length > 11) return

    // 사용자가 입력한 값의 길이가 현재 저장된 값보다 짧으면 삭제 중
    const currentValue = e.target.defaultValue || ''
    const isDeleting = inputValue.length < currentValue.length

    if (isDeleting) {
      // 삭제 중일 때는 사용자가 입력한 값을 그대로 저장
      onChange(inputValue)
    } else {
      // 입력 중일 때는 포맷팅 적용
      let formattedValue = numbers
      if (numbers.length >= 7) {
        formattedValue = `${numbers.substring(0, 3)}-${numbers.substring(3, 7)}-${numbers.substring(7)}`
      } else if (numbers.length >= 3) {
        formattedValue = `${numbers.substring(0, 3)}-${numbers.substring(3)}`
      }

      onChange(formattedValue)
    }
  }

  const handleJoinFormSubmit = handleSubmit((data) => {
    const { phone, verificationCode } = data
    createPhoneVerifierConfirm(
      {
        data: {
          phone,
          code: verificationCode,
        },
      },
      {
        onSuccess: (res) => {
          const { token } = res
          toast('인증이 완료되었습니다.', {
            action: {
              label: '닫기',
              onClick: () => {},
            },
          })
          createUserRegister({
            data: {
              phone,
              birth: '',
              phoneToken: token,
              registerToken: '',
            },
          })
        },
        onError: () => {
          toast(
            '인증번호가 일치하지 않아요.',
            {
              action: {
                label: '닫기',
                onClick: () => {},
              },
            },
            'error',
          )
        },
      },
    )

    console.log(data)
  })

  return (
    <Form {...form}>
      <div className="flex flex-col gap-[12px] max-w-[448px] w-full items-center">
        <div className="size-[56px] rounded-full bg-secondary-2 flex items-center justify-center">
          <ArticleIcon className="size-[28px]" />
        </div>
        <h1 className="typo-pre-heading-3 text-grey-9">추가 정보 입력</h1>
        <div className="flex flex-col gap-[24px] w-full items-center mt-[12px]">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <ClearableInput
                    required
                    placeholder="한글 2-20자"
                    maxLength={20}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>생년월일</FormLabel>
                <FormControl>
                  <ClearableInput
                    required
                    placeholder="YYYYMMDD"
                    maxLength={10}
                    onChange={(e) => handleBirthdayChange(e, field.onChange)}
                    {...omit(field, 'onChange')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex flex-col gap-[6px]">
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>연락처</FormLabel>
                  <div className="flex flex-row gap-[6px]">
                    <FormControl>
                      <ClearableInput
                        required
                        className="w-full"
                        placeholder="(-)없이 입력해주세요"
                        maxLength={13}
                        onChange={(e) => handlePhoneChange(e, field.onChange)}
                        {...omit(field, 'onChange')}
                      />
                    </FormControl>
                    <Button
                      variant="outline-primary"
                      className="max-w-[147px] w-full"
                      onClick={handleSendVerification}
                      disabled={isDisabledToSendVerification}
                    >
                      인증번호 전송
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isVerificationSent && (
              <FormField
                control={control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인증번호</FormLabel>
                    <FormControl>
                      <VerificationInput
                        required
                        className="max-w-[295px] w-full"
                        isTimerActive={isDisabledToSendVerification}
                        onTimerExpired={handleTimerExpired}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <Button
            variant="solid-primary"
            size="lg"
            disabled={!isDirty || !isValid}
            onClick={handleJoinFormSubmit}
          >
            회원가입
          </Button>
        </div>
      </div>
    </Form>
  )
}
