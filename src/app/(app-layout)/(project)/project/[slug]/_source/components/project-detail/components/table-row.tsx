import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/ui/input'

import { ProjectInfoFormDataType } from '../hooks/use-project-info-form'

// 테이블 행 컴포넌트
interface TableRowProps {
  rowIndex: number
  columns: number
  fieldName: 'sizeValues' | 'colorValues' | 'fabricValues' | 'materialValues'
  readOnly?: boolean
  maxLength?: number
  type?: 'number' | 'text'
  getInputType?: (rowIndex: number, colIndex: number) => 'number' | 'text'
  getMaxLength?: (rowIndex: number, colIndex: number) => number | undefined
}

export const TableRow = ({
  rowIndex,
  columns,
  fieldName,
  readOnly = false,
  maxLength,
  type = 'text',
  getInputType,
  getMaxLength,
}: TableRowProps) => {
  const { register } = useFormContext<ProjectInfoFormDataType>()

  return (
    <div className={`grid grid-cols-${columns} gap-[4px] space-y-[4px]`}>
      {Array.from({ length: columns }, (_, colIndex) => {
        const inputType = getInputType ? getInputType(rowIndex, colIndex) : type
        const inputMaxLength =
          getMaxLength ? getMaxLength(rowIndex, colIndex) : maxLength

        const { onChange, ...rest } = register(
          `${fieldName}.${rowIndex}.${colIndex}`,
        )

        return (
          <div key={colIndex}>
            <Input
              size="md"
              readOnly={readOnly}
              placeholder={readOnly ? '' : undefined}
              maxLength={inputMaxLength}
              type={inputType}
              min={inputType === 'number' ? 0 : undefined}
              max={inputType === 'number' ? 999999 : undefined}
              onChange={(e) => {
                if (inputType === 'number') {
                  let value = e.target.value.replace(/[^0-9]/g, '')
                  if (inputMaxLength && value.length > inputMaxLength) {
                    value = value.slice(0, inputMaxLength)
                  }
                  e.target.value = value
                }
                onChange(e)
              }}
              {...rest}
            />
          </div>
        )
      })}
    </div>
  )
}
