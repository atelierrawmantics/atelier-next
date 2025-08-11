// 테이블 헤더 컴포넌트
interface TableHeaderProps {
  headers: string[]
  columns: number
  sizeNames?: string[]
  sizeNamesIndex?: number
}

export const TableHeader = ({
  headers,
  columns,
  sizeNames,
  sizeNamesIndex,
}: TableHeaderProps) => {
  return (
    <div
      className={`grid grid-cols-${columns} gap-[4px] items-center space-y-[4px]`}
    >
      {headers.map((header, index) => (
        <div key={index} className="typo-pre-body-5 text-grey-9 text-center">
          {(
            sizeNames &&
            sizeNamesIndex !== undefined &&
            index > 0 &&
            index < headers.length - 1
          ) ?
            sizeNames[index - 1] || header
          : header}
        </div>
      ))}
    </div>
  )
}
