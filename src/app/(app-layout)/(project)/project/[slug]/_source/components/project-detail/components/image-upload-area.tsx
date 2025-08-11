import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { ShirtFoldedIcon, XIcon } from '@/generated/icons/MyIcons'

// 이미지 업로드 영역 컴포넌트
interface ImageUploadAreaProps {
  imageUrl?: string | null
  onDelete?: () => void
  icon?: React.ReactNode
  title?: string
  description?: string
  subDescription?: string
}

export const ImageUploadArea = ({
  imageUrl,
  onDelete,
  icon = <ShirtFoldedIcon className="size-[28px]" />,
  title = '도식화는 AI로 생성하거나 직접 이미지를 첨부할 수 있습니다. (최대 1개까지 등록 가능)',
  description = 'AI 도식화를 생성하려면 상단의 [AI 도식화 도우미] 탭을 이용해 주세요.',
  subDescription = '지원 형식: jpg, png',
}: ImageUploadAreaProps) => {
  return (
    <div className="w-full">
      {imageUrl ?
        <div className="w-full flex justify-center">
          <div className="flex gap-[8px] items-start justify-center">
            <div className="relative w-[400px] h-[233px] flex items-center justify-center">
              <Image
                unoptimized
                src={imageUrl}
                alt="Uploaded image"
                className="w-full h-full object-cover"
                fill
                sizes="400px"
              />
            </div>
            {onDelete && (
              <Button variant="ghost" size="fit" onClick={onDelete}>
                <XIcon className="size-[32px]" />
              </Button>
            )}
          </div>
        </div>
      : <div className="w-full flex flex-col items-center justify-center gap-[12px] py-[40px]">
          <div className="size-[56px] rounded-full bg-secondary-2 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="typo-pre-body-5 text-grey-9">{title}</p>
            <p className="typo-body-6 text-grey-8">{description}</p>
            <p className="typo-pre-caption-2 text-grey-7 mt-[8px]">
              {subDescription}
            </p>
          </div>
        </div>
      }
    </div>
  )
}
