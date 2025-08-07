import { yupResolver } from '@hookform/resolvers/yup'

import { UseFormProps, useForm } from 'react-hook-form'
import * as yup from 'yup'

export type ProjectFormDataType = {
  projectName: string
  projectDescription: string
  clientName?: string
  clientDescription?: string
}

export const projectFormSchema: yup.ObjectSchema<ProjectFormDataType> =
  yup.object({
    projectName: yup.string().required('프로젝트 이름을 입력해 주세요').max(30),
    projectDescription: yup
      .string()
      .required('프로젝트 설명을 입력해 주세요')
      .max(500),
    clientName: yup.string().optional().max(30),
    clientDescription: yup.string().optional().max(500),
  })

export const useProjectForm = (options?: UseFormProps<ProjectFormDataType>) => {
  return useForm<ProjectFormDataType>({
    resolver: yupResolver(projectFormSchema),
    mode: 'onChange',
    ...options,
  })
}
