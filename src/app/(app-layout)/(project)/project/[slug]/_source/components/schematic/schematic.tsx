'use client'

import { Children, useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { ArrowUpIcon, Loader2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Textarea, textareaVariants } from '@/components/ui/textarea'
import {
  QUERY_KEY_SCHEMATIC_API,
  useProjectSchematicCreateMutation,
  useProjectSchematicRetrieveQuery,
} from '@/generated/apis/Schematic/Schematic.query'
import { MagicWandFillIcon } from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

import {
  HistoryItemDropDownMenu,
  SchematicHistoryDrawer,
} from './schematic-history-drawer'

const EXAMPLE_TEXT = [
  '5:5 비율의 반팔 티셔츠 도식화',
  '하이웨스트 와이드 팬츠 정면 도식화',
  '슬림핏 블레이저(카라포함) 전면 도식화',
  '후디 집업(주머니 포함) 뒷면 도식화',
]

interface ExampleTextBoxProps {
  text: string
  order: number
}

const ExampleTextBox = ({ text, order }: ExampleTextBoxProps) => {
  return (
    <div
      className={cn(
        'h-[132px] py-[16px] pl-[12px] pr-[20px]',
        'border border-border-basic-2 rounded-[16px]',
        'bg-grey-0',
      )}
    >
      <p className="typo-pre-body-6 text-grey-7 whitespace-pre-line mt-[4px] text-left">
        {order}. {text}
      </p>
    </div>
  )
}

interface PromptFormData {
  prompt: string
}

interface PromptInputProps {
  onSubmit: (prompt: string) => void
  isPending: boolean
}

const PromptInput = ({ onSubmit, isPending }: PromptInputProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PromptFormData>({
    defaultValues: {
      prompt: '',
    },
  })

  const onSubmitForm = (data: PromptFormData) => {
    if (data.prompt.trim()) {
      onSubmit(data.prompt.trim())
      reset()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmitForm)()
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div
          className={cn(
            textareaVariants(),
            'flex items-end gap-[20px]',
            'h-[140px] p-[16px]',
            'border border-border-basic-2 rounded-[16px]',
            'bg-background-basic-1',
          )}
        >
          <Textarea
            {...register('prompt')}
            onKeyDown={handleKeyPress}
            placeholder="생성할 도식화를 입력해 주세요."
            className={cn(
              'flex-1 h-full resize-none',
              'bg-transparent outline-none',
              'typo-pre-body-6 text-grey-10',
              'placeholder:text-grey-5',
              'p-0',
              'border-none',
            )}
          />
          <div className="flex flex-col gap-[8px]">
            <SchematicHistoryDrawer />
            <Button
              type="submit"
              disabled={isPending || isSubmitting}
              variant="solid-primary"
              size="icon-lg"
              title="전송"
            >
              <ArrowUpIcon className="size-[24px]" />
            </Button>
          </div>
        </div>
        {errors.prompt && (
          <p className="mt-2 text-sm text-red-500">{errors.prompt.message}</p>
        )}
      </form>
    </div>
  )
}

export const Schematic = () => {
  const { slug } = useParams<{ slug: string }>()
  const [isPolling, setIsPolling] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const queryClient = useQueryClient()

  const {
    data,
    mutate: createSchematic,
    isPending,
  } = useProjectSchematicCreateMutation({})

  const { data: schematic, refetch } = useProjectSchematicRetrieveQuery({
    variables: {
      projectSlug: slug,
      id: data?.id ?? 0,
    },
    options: {
      enabled: !!data?.id,
    },
  })

  // 폴링 시작
  const startPolling = () => {
    setIsPolling(true)
    pollingIntervalRef.current = setInterval(() => {
      refetch()
    }, 2000) // 2초 간격
  }

  // 폴링 중지
  const stopPolling = () => {
    setIsPolling(false)
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  // 스키매틱 상태에 따른 폴링 제어
  useEffect(() => {
    if (schematic?.status === 'SUCCESS' && isPolling) {
      stopPolling()
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY_SCHEMATIC_API.PROJECT_SCHEMATIC_LIST_INFINITE(),
      })
    } else if (schematic?.status === 'PENDING' && !isPolling) {
      startPolling()
    }
  }, [schematic?.status, isPolling])

  // 컴포넌트 언마운트 시 폴링 정리
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [])

  const handlePromptSubmit = (prompt: string) => {
    createSchematic(
      {
        projectSlug: slug,
        data: {
          prompt,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY_SCHEMATIC_API.PROJECT_SCHEMATIC_LIST_INFINITE(),
          })
        },
        onError: () => {
          toast(
            '유효한 도식화 생성 요청을 해주세요.',
            {
              action: {
                label: '닫기',
                onClick: () => {},
              },
            },
            'error',
          )
        },
      },
    )
  }

  return (
    <div
      className={cn(
        'container',
        'text-center w-full h-full',
        'flex flex-1 flex-col justify-center items-center gap-[16px]',
      )}
    >
      {/* 완성된 이미지 표시 */}
      {schematic?.image && (
        <div className="flex flex-col items-center justify-center w-full h-full pt-[80px] pb-[20px]">
          <div className="relative aspect-[3/2] max-w-full w-full sm:w-auto h-auto sm:h-full">
            <Image
              src={schematic.image}
              alt="생성된 도식화"
              fill
              objectFit="cover"
              unoptimized
            />
            <HistoryItemDropDownMenu
              id={schematic.id}
              image={schematic.image}
              isDelete={false}
            />
          </div>
        </div>
      )}
      {(isPending || schematic?.status === 'PENDING') && (
        <div className="flex flex-col items-center justify-center w-full h-full pt-[80px] pb-[20px]">
          <div className="relative aspect-[3/2] h-full">
            <div className="flex items-center justify-center w-full h-full bg-secondary-1">
              <Loader2Icon className="animate-spin" />
            </div>
          </div>
        </div>
      )}
      {!isPending && !schematic?.status && (
        <div className="flex flex-col items-center justify-center w-full h-full pt-[160px] gap-[16px]">
          <div className="flex items-center justify-center size-[56px] rounded-full bg-primary-3">
            <MagicWandFillIcon />
          </div>
          <h1 className="typo-pre-heading-2 text-grey-10">
            도식화 제작 도우미
          </h1>
          <h2 className="typo-pre-body-6 text-grey-7 whitespace-pre-line mt-[4px]">
            {`패션 디자이너를 위한 키워드 기반 도식화 제작 도우미입니다.\n간단한 키워드 입력만으로도 빠르고 정확하게 도식화를 완성할 수 있도록 도와드립니다.`}
          </h2>

          <div className="grid grid-cols-4 gap-[8px] mt-[24px] w-full">
            {Children.toArray(
              EXAMPLE_TEXT.map((text, index) => (
                <ExampleTextBox order={index + 1} text={text} />
              )),
            )}
          </div>
        </div>
      )}

      <PromptInput
        onSubmit={handlePromptSubmit}
        isPending={schematic?.status === 'PENDING' || isPending}
      />
    </div>
  )
}
