import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/ui/input'

import { ProjectInfoFormDataType } from '../hooks/use-project-info-form'

// 테이블 행 컴포넌트
interface TableRowProps {
  rowIndex: number
  columns: number
  fieldName: 'sizeValues' | 'colorValues' | 'fabricValues' | 'materialValues'
  readOnly?: boolean
}

export const TableRow = ({
  rowIndex,
  columns,
  fieldName,
  readOnly = false,
}: TableRowProps) => {
  const { register } = useFormContext<ProjectInfoFormDataType>()

  return (
    <div className={`grid grid-cols-${columns} gap-[4px] space-y-[4px]`}>
      {Array.from({ length: columns }, (_, colIndex) => (
        <div key={colIndex}>
          <Input
            size="md"
            readOnly={readOnly}
            placeholder={readOnly ? '' : undefined}
            {...register(`${fieldName}.${rowIndex}.${colIndex}`)}
          />
        </div>
      ))}
    </div>
  )
}
