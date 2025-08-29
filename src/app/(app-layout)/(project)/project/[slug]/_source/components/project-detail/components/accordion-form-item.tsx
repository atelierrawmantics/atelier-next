import { useParams } from 'next/navigation'

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { cn } from '@/lib/utils'

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
  isLoading?: boolean
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
  isLoading = false,
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
                <Button
                  variant="outline-grey"
                  size="sm"
                  className="w-fit"
                  disabled={isImageUploadDisabled}
                  onClick={handleImageUpload}
                >
                  <label
                    htmlFor={imageUploadId}
                    onClick={handleImageUpload}
                    className="cursor-pointer"
                  >
                    이미지 첨부
                    <input
                      id={imageUploadId}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageUpload}
                      disabled={isImageUploadDisabled}
                    />
                  </label>
                </Button>
              )}
              <Button
                variant="outline-grey"
                size="sm"
                className="w-fit"
                onClick={handleReset}
              >
                초기화
              </Button>
              <Button
                variant="outline-grey"
                size="sm"
                className="w-[41px]"
                disabled={!isDirty}
                onClick={handleSave}
                loading={isLoading}
              >
                저장
              </Button>
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
