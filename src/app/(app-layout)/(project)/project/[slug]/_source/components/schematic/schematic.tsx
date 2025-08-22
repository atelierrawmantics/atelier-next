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
import { SchematicMo } from './schematic-mo'

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
    <div className="w-full mt-[16px]">
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
            disabled={isPending || isSubmitting}
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

  // UI 상태 결정을 위한 변수들
  const isLoading = isPending || schematic?.status === 'PENDING'
  const hasSuccessImage = schematic?.status === 'SUCCESS' && schematic?.image
  const showDefaultUI = !isLoading && !hasSuccessImage

  return (
    <>
      <div
        className={cn(
          'container',
          'text-center w-full min-h-full',
          'flex-1 flex-col items-center justify-center',
          'hidden sm:flex',
          'pt-[8.5%]',
        )}
      >
        {/* 1. 로딩 UI: mutate 요청 중이고 폴링이 pending 상태일 때 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-end w-full h-full pb-[20px] pt-[80px]">
            <div className="relative aspect-[3/2] max-w-full w-full sm:w-auto h-auto sm:h-full">
              <div className="flex items-center justify-center w-full h-full bg-secondary-1">
                <Loader2Icon className="animate-spin" />
              </div>
            </div>
          </div>
        )}

        {/* 2. 이미지 UI: 상태가 success이고 이미지가 있을 때 */}
        {hasSuccessImage && (
          <div className="flex flex-col items-center justify-end w-full h-full pb-[20px] pt-[80px]">
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

        {/* 3. 기본 UI: 최초에 어떤 요청도 발생하지 않았을 때 */}
        {showDefaultUI && (
          <div className="flex flex-col justify-end items-center w-full h-full gap-[16px]">
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

        <PromptInput onSubmit={handlePromptSubmit} isPending={isLoading} />
      </div>
      <SchematicMo className="flex sm:hidden" />
    </>
  )
}
