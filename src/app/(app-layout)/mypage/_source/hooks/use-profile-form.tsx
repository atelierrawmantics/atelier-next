import { yupResolver } from '@hookform/resolvers/yup'

import { UseFormProps, useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  birthdaySchema,
  nameSchema,
  phoneSchema,
} from '@/constants/validation-schemas'

export type ProfileFormDataType = {
  name: string
  birthday: string
  phone: string
}

export const profileFormSchema: yup.ObjectSchema<ProfileFormDataType> =
  yup.object({
    name: nameSchema,
    birthday: birthdaySchema,
    phone: phoneSchema,
  })

export const useProfileForm = (options?: UseFormProps<ProfileFormDataType>) => {
  return useForm<ProfileFormDataType>({
    resolver: yupResolver(profileFormSchema),
    mode: 'onChange',
    ...options,
  })
}
