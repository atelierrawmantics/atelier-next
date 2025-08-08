import { yupResolver } from '@hookform/resolvers/yup'

import { UseFormProps, useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  TaskStatusEnumType,
  TaskStatusEnumTypeMap,
} from '@/generated/apis/@types/data-contracts'

export type TaskFormToMeDataType = {
  name: string
  description: string
  memo?: string
  status: TaskStatusEnumType
}

export type TaskFormToManagerDataType = {
  managerName: string
  managerPhone: string
  name: string
  description: string
  isAlarm: boolean
  status: TaskStatusEnumType
}

export const taskFormToMeSchema: yup.ObjectSchema<TaskFormToMeDataType> =
  yup.object({
    name: yup.string().required('태스크 이름을 입력해 주세요').max(30),
    description: yup.string().required('태스크 설명을 입력해 주세요').max(500),
    memo: yup.string().max(500),
    status: yup
      .string()
      .oneOf(Object.keys(TaskStatusEnumTypeMap) as [TaskStatusEnumType])
      .required(),
  })

export const taskFormToManagerSchema: yup.ObjectSchema<TaskFormToManagerDataType> =
  yup.object({
    name: yup.string().required('태스크 이름을 입력해 주세요').max(30),
    managerName: yup.string().required('태스크 담당자를 입력해 주세요'),
    managerPhone: yup
      .string()
      .required('태스크 담당자 휴대폰 번호를 입력해 주세요'),
    description: yup.string().required('태스크 설명을 입력해 주세요').max(500),
    isAlarm: yup.boolean().required('태스크 알림 수신 여부를 선택해 주세요'),
    status: yup
      .string()
      .oneOf(Object.keys(TaskStatusEnumTypeMap) as [TaskStatusEnumType])
      .required('태스크 상태를 입력해 주세요'),
  })

export const useTaskFormToMe = (
  options?: UseFormProps<TaskFormToMeDataType>,
) => {
  return useForm<TaskFormToMeDataType>({
    resolver: yupResolver(taskFormToMeSchema),
    mode: 'onChange',
    ...options,
  })
}

export const useTaskFormToManager = (
  options?: UseFormProps<TaskFormToManagerDataType>,
) => {
  return useForm<TaskFormToManagerDataType>({
    resolver: yupResolver(taskFormToManagerSchema),
    mode: 'onChange',
    ...options,
  })
}
