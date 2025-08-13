'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'
import { useOverlay } from '@toss/use-overlay'

import { useFormContext } from 'react-hook-form'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { TaskStatusEnumType } from '@/generated/apis/@types/data-contracts'
import {
  QUERY_KEY_TASK_API,
  useProjectTaskCreateMutation,
} from '@/generated/apis/Task/Task.query'
import { InfoFillIcon, XIcon } from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { phoneFormatter } from '@/utils/middleware/phone-formatter'

import {
  TaskFormToManagerDataType,
  TaskFormToMeDataType,
  useTaskFormToManager,
  useTaskFormToMe,
} from './use-task-form'

interface ProjectModalData {
  projectName: string
}

interface TaskCreateModalProps {
  isOpen: boolean
  onClose: () => void
  data?: ProjectModalData
  initStatus?: TaskStatusEnumType
}

const target_description = {
  me: `'나에게 할당'한 태스크에는 알림톡이 발송되지 않으며, 할당 대상은 한 번 설정하면 변경할 수 없습니다.`,
  manager:
    '담당자 할당 시 이름, 휴대폰 번호, 수신 동의가 필수이며, 알림톡은 동의한 경우에만 발송됩니다. 담당자 정보와 할당 대상은 이후 변경이 어렵습니다.',
}

const TaskCreateModal = ({
  isOpen,
  onClose,
  data,
  initStatus = 'pending',
}: TaskCreateModalProps) => {
  const qc = useQueryClient()

  const { slug } = useParams<{ slug: string }>()

  const { mutate: createTask } = useProjectTaskCreateMutation({
    options: {
      onSuccess: () => {
        onClose()
        qc.invalidateQueries({
          queryKey: QUERY_KEY_TASK_API.PROJECT_TASK_LIST({
            projectSlug: slug,
          }),
        })
      },
      onError: () => {
        toast(
          '태스크 생성에 실패했어요.',
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
  })

  const [target, setTarget] = useState<'me' | 'manager'>('me')

  const formToMe = useTaskFormToMe()
  const formToManager = useTaskFormToManager()

  const {
    handleSubmit: handleSubmitToMe,
    formState: { isValid: isValidToMe },
    setValue: setValueToMe,
  } = formToMe

  const {
    handleSubmit: handleSubmitToManager,
    formState: { isValid: isValidToManager },
    setValue: setValueToManager,
  } = formToManager

  const handleSubmitToMeData = (data: TaskFormToMeDataType) => {
    console.log('TaskFormToMe data:', data)
    createTask({
      projectSlug: slug,
      data: {
        ...data,
        managerName: '',
        managerPhone: '',
        isAlarm: false,
        memo: '',
      },
    })
  }

  const handleSubmitToManagerData = (data: TaskFormToManagerDataType) => {
    const { managerPhone } = data
    createTask({
      projectSlug: slug,
      data: {
        ...data,
        managerPhone: managerPhone.replace(/-/g, ''),
        memo: '',
      },
    })
  }

  useEffect(() => {
    if (initStatus) {
      setValueToManager('status', initStatus)
      setValueToMe('status', initStatus)
    }
  }, [initStatus, setValueToManager, setValueToMe])

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col rounded-none min-w-screen sm:rounded-[12px] sm:min-w-[600px] w-screen sm:max-h-[800px] h-full">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="typo-pre-heading-2 text-grey-10">
            {data?.projectName}
          </AlertDialogTitle>
          <Button variant="ghost" size="fit" onClick={onClose} asChild>
            <XIcon className="size-[40px]" />
          </Button>
        </AlertDialogHeader>

        <div className="flex flex-col flex-1 px-[16px] py-[20px] overflow-y-auto">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex flex-col gap-[6px]">
              <Label
                className={cn(
                  'after:content-["*"] after:text-accent-red2 after:-ml-0.5',
                )}
              >
                할당 대상 선택
              </Label>
              <RadioGroup
                defaultValue="me"
                className="flex gap-[32px] py-[13px]"
                onValueChange={(value) => setTarget(value as 'me' | 'manager')}
              >
                <div className="flex items-center gap-[12px]">
                  <RadioGroupItem
                    value="me"
                    id="me"
                    checked={target === 'me'}
                    onChange={() => setTarget('me')}
                  />
                  <Label htmlFor="me">나에게 할당</Label>
                </div>
                <div className="flex items-center gap-[12px]">
                  <RadioGroupItem
                    value="manager"
                    id="manager"
                    checked={target === 'manager'}
                    onChange={() => setTarget('manager')}
                  />
                  <Label htmlFor="manager">담당자에게 할당</Label>
                </div>
              </RadioGroup>
            </div>

            <AlertDialogDescription className="py-[10px] px-[20px] bg-primary-1 flex gap-[6px] items-center sm:items-start">
              <InfoFillIcon className="min-w-[20px] size-[20px] text-primary-3" />
              <p className="typo-pre-body-6">{target_description[target]}</p>
            </AlertDialogDescription>
          </div>

          {target === 'me' ?
            <Form {...formToMe}>
              <form id="task-form-to-me">
                <TaskFormToMe />
              </form>
            </Form>
          : <Form {...formToManager}>
              <form id="task-form-to-manager">
                <TaskFormToManager />
              </form>
            </Form>
          }
        </div>

        <AlertDialogFooter className="p-[12px_16px_16px_16px] border-t border-border-basic-1">
          <Button
            form={target === 'me' ? 'task-form-to-me' : 'task-form-to-manager'}
            disabled={target === 'me' ? !isValidToMe : !isValidToManager}
            type="button"
            onClick={() => {
              if (target === 'me') {
                handleSubmitToMe(handleSubmitToMeData)()
              } else {
                handleSubmitToManager(handleSubmitToManagerData)()
              }
            }}
          >
            태스크 생성
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// 훅 타입 정의
interface OpenProjectCreateModalParams {
  data?: ProjectModalData
  onClose: (slug?: string) => void
}

const FORM_FIELDS_TO_ME = [
  {
    name: 'name' as const,
    label: '태스크명',
    placeholder: '태스크명을 입력해 주세요 (최대 30자)',
    component: Input,
    isRequired: true,
    maxLength: 30,
  },
  {
    name: 'description' as const,
    label: '태스크 설명',
    placeholder: '태스크에 대한 설명을 입력해 주세요 (최대 500자)',
    component: Textarea,
    isRequired: true,
    maxLength: 500,
    size: 'lg',
    variant: 'outline-grey',
    className: 'min-h-[200px] resize-none',
  },
  {
    name: 'memo' as const,
    label: '메모',
    placeholder:
      '필요 시 업무 관련 커뮤니케이션 용도로 자유롭게 입력해 주세요. (최대 500자)',
    component: Textarea,
    isRequired: false,
    maxLength: 500,
    size: 'lg' as const,
    variant: 'outline-grey' as const,
    className: 'min-h-[200px] resize-none' as const,
  },
] as const

export const useTaskModal = () => {
  const { open } = useOverlay()

  const openTaskCreateModal = ({ data }: OpenProjectCreateModalParams) => {
    open(({ isOpen, close }) => (
      <TaskCreateModal isOpen={isOpen} onClose={close} data={data} />
    ))
  }

  return {
    openTaskCreateModal,
  }
}

const TaskFormToMe = () => {
  const { control, setValue } = useFormContext()

  return (
    <div className="flex flex-col gap-[24px]">
      {FORM_FIELDS_TO_ME.map((field) => {
        const Component = field.component
        return (
          <FormField
            key={field.name}
            control={control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel aria-required={field.isRequired}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Component
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    size={'size' in field ? field.size : undefined}
                    variant={'variant' in field ? field.variant : undefined}
                    className={
                      'className' in field ? field.className : undefined
                    }
                    value={formField.value}
                    onChange={(e) => {
                      setValue(field.name, e.target.value)
                      formField.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      })}
    </div>
  )
}

const TaskFormToManager = () => {
  const { control, setValue } = useFormContext()

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex gap-[12px]">
        <FormField
          control={control}
          name="managerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required={true}>담당자 이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="담당자 이름을 입력하세요"
                  value={field.value}
                  maxLength={30}
                  onChange={(e) => {
                    setValue('managerName', e.target.value, {
                      shouldValidate: true,
                    })
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="managerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required={true}>담당자 휴대폰 번호</FormLabel>
              <FormControl>
                <Input
                  placeholder="휴대폰 번호를 입력하세요"
                  value={field.value}
                  maxLength={13}
                  onChange={(e) => {
                    setValue('managerPhone', e.target.value, {
                      shouldValidate: true,
                    })
                    phoneFormatter(e, field.onChange)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="isAlarm"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required={true}>제3자 알림톡 수신 동의</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center  h-12">
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="isAlarm"
                    value="true"
                    id="agree"
                    checked={field.value === true}
                    onChange={(e) => {
                      setValue('isAlarm', e.target.value === 'true', {
                        shouldValidate: true,
                      })
                      field.onChange(e.target.value === 'true')
                    }}
                  />
                  <label htmlFor="agree">동의</label>
                </div>
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="isAlarm"
                    value="false"
                    id="disagree"
                    checked={field.value === false}
                    onChange={(e) => {
                      setValue('isAlarm', e.target.value === 'true', {
                        shouldValidate: true,
                      })
                      field.onChange(e.target.value === 'true')
                    }}
                  />
                  <label htmlFor="disagree">동의하지 않음</label>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required={true}>태스크명</FormLabel>
            <FormControl>
              <Input
                placeholder="태스크명을 입력하세요"
                value={field.value}
                onChange={(e) => {
                  setValue('name', e.target.value, {
                    shouldValidate: true,
                  })
                  field.onChange(e)
                }}
                maxLength={30}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required={true}>태스크 설명</FormLabel>
            <FormControl>
              <Textarea
                maxLength={500}
                size="lg"
                variant="outline-grey"
                className="min-h-[200px] resize-none"
                placeholder="담당자 이메일을 입력하세요"
                value={field.value}
                onChange={(e) => {
                  setValue('description', e.target.value, {
                    shouldValidate: true,
                  })
                  field.onChange(e)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
