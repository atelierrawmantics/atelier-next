'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'
import { useOverlay } from '@toss/use-overlay'

import dayjs from 'dayjs'
import { omit } from 'lodash'

import { logout } from '@/actions/logout'
import { CommonAlert } from '@/components/common-alert'
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
import {
  QUERY_KEY_USER_API,
  useUserDestroyMutation,
  useUserRetrieveQuery,
  useUserUpdateMutation,
} from '@/generated/apis/User/User.query'
import { UserIcon } from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'
import { formatPhoneNumber } from '@/lib/utils'

import { useProfileForm } from './hooks/use-profile-form'

export const ProfileForm = () => {
  const form = useProfileForm({})
  const {
    control,
    formState: { isDirty, isValid, isSubmitting },
    handleSubmit,
    reset,
  } = form

  const router = useRouter()
  const queryClient = useQueryClient()
  const { open } = useOverlay()

  const { data: userData } = useUserRetrieveQuery({
    variables: {
      id: 'me',
    },
  })

  const { mutate: updateUser, isPending: isPendingUpdateUser } =
    useUserUpdateMutation({})

  const { mutate: deleteUser, isPending: isPendingDeleteUser } =
    useUserDestroyMutation({
      options: {
        onSuccess: () => {
          //FIXME: 회원탈퇴 후 로그아웃 처리
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY_USER_API.RETRIEVE({ id: 'me' }),
          })
        },
      },
    })

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
      const formattedValue = formatPhoneNumber(numbers)
      onChange(formattedValue)
    }
  }

  const handleJoinFormSubmit = handleSubmit((data) => {
    const { name, birthday } = data
    updateUser(
      {
        id: 'me',
        data: {
          name,
          birth: birthday.replace(/-/g, ''),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY_USER_API.RETRIEVE({ id: 'me' }),
          })
          toast('프로필이 수정되었어요.', {
            action: {
              label: '닫기',
              onClick: () => {},
            },
          })
        },
      },
    )
  })

  const handleWithdrawal = () => {
    open(({ isOpen, close }) => (
      <CommonAlert
        isOpen={isOpen}
        onClose={close}
        loading={isPendingDeleteUser}
        title="정말 탈퇴하시겠어요?"
        description={
          '회원탈퇴 시, 모든 정보가 삭제되며, 복구할 수 없습니다.\n그래도 탈퇴하시겠어요?'
        }
        confirmText="탈퇴하기"
        onConfirm={() => {
          deleteUser(
            {
              id: 'me',
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: QUERY_KEY_USER_API.RETRIEVE({ id: 'me' }),
                })
                close()
                toast('그동안 아뜰리에 서비스를 이용해 주셔서 감사합니다.', {
                  action: {
                    label: '닫기',
                    onClick: () => {},
                  },
                })
                queryClient.clear()
                logout()
              },
              onError: () => {
                close()
              },
            },
          )
        }}
      />
    ))
  }

  useEffect(() => {
    const { name, birth, phone } = userData || {}

    reset({
      name: name || '',
      birthday: birth ? dayjs(birth).format('YYYY-MM-DD') : '',
      phone: phone ? formatPhoneNumber(phone) : '',
    })
  }, [userData])

  return (
    <Form {...form}>
      <div className="flex flex-col max-w-[448px] w-full items-center gap-[16px]">
        <div className="flex flex-col gap-[12px] w-full items-center bg-grey-0 p-[40px] rounded-[12px]">
          <div className="size-[56px] rounded-full bg-secondary-3 flex items-center justify-center">
            <UserIcon className="size-[32px]" />
          </div>
          <h1 className="typo-pre-body-3 text-grey-9">프로필 관리</h1>
          <div className="flex flex-col gap-[24px] w-full items-center mt-[12px]">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <ClearableInput required maxLength={20} {...field} />
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
                          readOnly
                          className="w-full"
                          maxLength={13}
                          onChange={(e) => handlePhoneChange(e, field.onChange)}
                          {...omit(field, 'onChange')}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="typo-pre-caption-2 text-grey-7">
                연락처 변경은 관리자에게 문의해주세요. (1544-1234)
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="solid-primary"
          size="lg"
          disabled={!isDirty || !isValid}
          loading={isPendingUpdateUser || isSubmitting}
          onClick={handleJoinFormSubmit}
        >
          프로필 수정
        </Button>
        <div className="w-full flex justify-end mt-[16px]">
          <Button
            variant="ghost"
            size="fit"
            className="underline text-grey-7 typo-pre-body-6"
            onClick={handleWithdrawal}
          >
            회원탈퇴
          </Button>
        </div>
      </div>
    </Form>
  )
}
