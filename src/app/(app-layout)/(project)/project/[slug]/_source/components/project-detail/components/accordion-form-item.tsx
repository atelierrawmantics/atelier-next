import { useParams } from 'next/navigation'

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { cn } from '@/lib/utils'

const BUTTON_STYLES =
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer'

// 재사용 가능한 아코디언 아이템 컴포넌트
interface AccordionFormItemProps {
  value: string
  title: string
  children: React.ReactNode
  onReset: () => void
  onSave: () => void
  hasImageUpload?: boolean
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void
  imageUploadId?: string
  isLastItem?: boolean
  isFirstItem?: boolean
  isDirty?: boolean
  maxImageCount?: number
  currentImageCount?: number
}

export const AccordionFormItem = ({
  value,
  title,
  children,
  onReset,
  onSave,
  hasImageUpload = false,
  onImageUpload,
  imageUploadId,
  isLastItem = false,
  isFirstItem = false,
  isDirty = false,
  maxImageCount,
  currentImageCount = 0,
}: AccordionFormItemProps) => {
  const { slug } = useParams<{ slug: string }>()
  const { data: projectData } = useProjectRetrieveQuery({
    variables: {
      slug,
    },
    options: {
      enabled: !!slug,
    },
  })

  const { isShared, isOwned } = projectData || {}
  const isReadOnly = isShared && !isOwned
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReset()
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave()
  }

  const handleImageUpload = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const isImageUploadDisabled = Boolean(
    maxImageCount && currentImageCount >= maxImageCount,
  )

  return (
    <AccordionItem
      value={value}
      className={cn(isFirstItem ? 'rounded-t-[6px]' : '', 'w-full')}
    >
      <AccordionTrigger
        className={cn(
          'h-[62px] typo-pre-body-5 text-grey-10',
          isFirstItem ? 'rounded-t-[6px]' : '',
          isLastItem ? 'data-[state=closed]:rounded-b-[6px]' : '',
        )}
      >
        <div className="w-full flex justify-between items-center">
          <p>{title}</p>
          {!isReadOnly && (
            <div
              className="flex gap-[6px]"
              onClick={(e) => e.stopPropagation()}
            >
              {hasImageUpload && (
                <div
                  className={cn(
                    BUTTON_STYLES,
                    isImageUploadDisabled && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <label
                    htmlFor={imageUploadId}
                    onClick={handleImageUpload}
                    className={cn(
                      'cursor-pointer',
                      isImageUploadDisabled && 'cursor-not-allowed',
                    )}
                  >
                    이미지 첨부
                    <input
                      id={imageUploadId}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageUpload}
                      readOnly={isImageUploadDisabled}
                    />
                  </label>
                </div>
              )}
              <div
                className={cn(
                  BUTTON_STYLES,
                  !isDirty && 'opacity-50 cursor-not-allowed',
                )}
                onClick={isDirty ? handleReset : undefined}
              >
                초기화
              </div>
              <div className={BUTTON_STYLES} onClick={handleSave}>
                저장
              </div>
            </div>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={cn(
          isLastItem ? 'data-[state=open]:rounded-b-[6px]' : '',
          'p-[20px]',
        )}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
