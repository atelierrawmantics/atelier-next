import { yupResolver } from '@hookform/resolvers/yup'

import { UseFormProps, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { PatchedInstructionRequestType } from '@/generated/apis/@types/data-contracts'

// 폼 데이터 타입 정의
export type ProjectInfoFormDataType = PatchedInstructionRequestType

// 유효성 검사 스키마
export const projectInfoFormSchema = yup.object({
  year: yup.string().optional().max(4, '년도는 4자리까지 입력 가능합니다'),
  season: yup.string().optional().max(100, '시즌은 100자까지 입력 가능합니다'),
  style: yup.string().optional().max(100, '스타일은 100자까지 입력 가능합니다'),
  variant: yup.string().optional().max(100, '품명은 100자까지 입력 가능합니다'),
  item: yup.string().optional().max(100, '아이템은 100자까지 입력 가능합니다'),
  generation: yup
    .string()
    .optional()
    .max(100, '차수는 100자까지 입력 가능합니다'),
  schematic: yup
    .object({
      image: yup
        .string()
        .required('이미지를 선택해주세요')
        .min(1, '이미지를 선택해주세요'),
    })
    .nullable()
    .optional(),
  sizeNames: yup
    .array()
    .of(yup.string().required('값을 입력해주세요'))
    .optional(),
  sizeValues: yup
    .array()
    .of(yup.array().of(yup.string().required('값을 입력해주세요')).required())
    .optional(),
  colorValues: yup
    .array()
    .of(yup.array().of(yup.string().required('값을 입력해주세요')).required())
    .optional(),
  fabricValues: yup
    .array()
    .of(yup.array().of(yup.string().required('값을 입력해주세요')).required())
    .optional(),
  materialValues: yup
    .array()
    .of(yup.array().of(yup.string().required('값을 입력해주세요')).required())
    .optional(),
  swatchSet: yup
    .array()
    .of(
      yup.object({
        id: yup.number().nullable().default(null),
        image: yup
          .string()
          .required('이미지를 선택해주세요')
          .min(1, '이미지를 선택해주세요'),
      }),
    )
    .optional(),
})

// 폼 훅
export const useProjectInfoForm = (
  options?: UseFormProps<ProjectInfoFormDataType>,
) => {
  return useForm<ProjectInfoFormDataType>({
    resolver: yupResolver(projectInfoFormSchema),
    mode: 'onChange',
    ...options,
  })
}
