'use client'

import { Children, useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { ArrowUpIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea, textareaVariants } from '@/components/ui/textarea'
import {
  useProjectSchematicCreateMutation,
  useProjectSchematicRetrieveQuery,
} from '@/generated/apis/Schematic/Schematic.query'
import { MagicWandIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

import { SchematicHistoryDrawer } from './schematic-history-drawer'

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

interface PromptInputProps {
  onSubmit: (prompt: string) => void
  isPending: boolean
}

const PromptInput = ({ onSubmit, isPending }: PromptInputProps) => {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim())
      setPrompt('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full">
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
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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
            onClick={handleSubmit}
            disabled={!prompt.trim() || isPending}
            variant="solid-primary"
            size="icon-lg"
            title="전송"
          >
            <ArrowUpIcon className="size-[24px]" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Schematic = () => {
  const { id } = useParams<{ id: string }>()
  const [isPolling, setIsPolling] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { data, mutate: createSchematic } = useProjectSchematicCreateMutation(
    {},
  )

  const { data: schematic, refetch } = useProjectSchematicRetrieveQuery({
    variables: {
      projectSlug: id,
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
    createSchematic({
      projectSlug: id,
      data: {
        prompt,
      },
    })
  }

  return (
    <div
      className={cn(
        'container',
        'text-center w-full',
        'flex flex-1 flex-col justify-center items-center gap-[16px]',
        schematic?.image ? 'pt-[80px]' : 'pt-[160px]',
      )}
    >
      {/* 완성된 이미지 표시 */}
      {schematic?.image ?
        <div className="relative aspect-[1536/1024] w-full max-w-[600px] h-auto">
          <Image
            src={schematic.image}
            alt="생성된 도식화"
            className="w-full h-auto"
            fill
            objectFit="cover"
            unoptimized
          />
        </div>
      : <>
          <div className="flex items-center justify-center size-[56px] rounded-full bg-primary-3">
            <MagicWandIcon />
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
        </>
      }

      <PromptInput
        onSubmit={handlePromptSubmit}
        isPending={schematic?.status === 'PENDING'}
      />
    </div>
  )
}
