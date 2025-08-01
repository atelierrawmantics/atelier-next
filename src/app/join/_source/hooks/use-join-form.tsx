import { yupResolver } from '@hookform/resolvers/yup'

import { UseFormProps, useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  birthdaySchema,
  nameSchema,
  phoneSchema,
  verificationCodeSchema,
} from '@/constants/validation-schemas'

export type JoinFormDataType = {
  name: string
  birthday: string
  phone: string
  verificationCode: string
}

export const joinFormSchema: yup.ObjectSchema<JoinFormDataType> = yup.object({
  name: nameSchema,
  birthday: birthdaySchema,
  phone: phoneSchema,
  verificationCode: verificationCodeSchema,
})

export const useJoinForm = (options?: UseFormProps<JoinFormDataType>) => {
  return useForm<JoinFormDataType>({
    resolver: yupResolver(joinFormSchema),
    mode: 'onChange',
    ...options,
  })
}
