import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { ProjectInfoFormDataType } from '../hooks/use-project-info-form'

// 입력 필드 컴포넌트
interface InputFieldProps {
  id: string
  label: string
  placeholder: string
  readOnly?: boolean
}

export const InputField = ({
  id,
  label,
  placeholder,
  readOnly = false,
}: InputFieldProps) => {
  const { register } = useFormContext<ProjectInfoFormDataType>()

  return (
    <div className="flex gap-[55px]">
      <Label htmlFor={id} className="w-[60px] typo-pre-caption-1 text-grey-9">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={readOnly ? '' : placeholder}
        size="md"
        variant="outline-grey"
        className="w-full"
        readOnly={readOnly}
        {...register(id as keyof ProjectInfoFormDataType)}
      />
    </div>
  )
}
