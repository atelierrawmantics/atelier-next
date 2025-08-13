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
    projectName: yup.string().required('프로젝트 이름을 입력해 주세요'),
    projectDescription: yup.string().required('프로젝트 설명을 입력해 주세요'),
    clientName: yup.string().optional(),
    clientDescription: yup.string().optional(),
  })

export const useProjectForm = (options?: UseFormProps<ProjectFormDataType>) => {
  return useForm<ProjectFormDataType>({
    resolver: yupResolver(projectFormSchema),
    mode: 'onChange',
    ...options,
  })
}
