'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useOverlay } from '@toss/use-overlay'

import { omit } from 'lodash-es'
import { useFormContext } from 'react-hook-form'

import { CommonAlert } from '@/components/common-alert'
import {
  AlertDialog,
  AlertDialogContent,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TaskStatusEnumType } from '@/generated/apis/@types/data-contracts'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import {
  QUERY_KEY_TASK_API,
  useProjectTaskDestroyMutation,
  useProjectTaskPartialUpdateMutation,
  useProjectTaskRetrieveQuery,
} from '@/generated/apis/Task/Task.query'
import { InfoFillIcon, XIcon } from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'
import { cn, formatPhoneNumber } from '@/lib/utils'
import { phoneFormatter } from '@/utils/middleware/phone-formatter'

import {
  TaskFormToManagerDataType,
  TaskFormToMeDataType,
  useTaskFormToManager,
  useTaskFormToMe,
} from '../../../../hooks/use-task-form'
import { TaskStatusBadge } from '../components/task-status-badge'

interface ProjectModalData {
  projectName: string
  taskSlug: string
  status: TaskStatusEnumType
}

interface TaskCreateModalProps {
  isOpen: boolean
  onClose: () => void
  data: ProjectModalData
}

const TaskCreateModal = ({ isOpen, onClose, data }: TaskCreateModalProps) => {
  const qc = useQueryClient()

  const { open } = useOverlay()

  const { slug } = useParams<{ slug: string }>()
  const taskSlug = data.taskSlug

  const { data: task } = useProjectTaskRetrieveQuery({
    variables: {
      projectSlug: slug,
      slug: taskSlug,
    },
  })

  const { data: projectData } = useProjectRetrieveQuery({
    variables: {
      slug: slug,
    },
    options: {
      enabled: !!slug,
    },
  })
  const { isOwned, isShared } = projectData || {}
  const isReadOnly = !isOwned && isShared

  const { mutate: updateTask, isPending: isUpdating } =
    useProjectTaskPartialUpdateMutation({
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
            '태스크 수정에 실패했어요.',
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

  const { mutate: deleteTask, isPending: isDeleting } =
    useProjectTaskDestroyMutation({
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
            '태스크 삭제에 실패했어요.',
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

  const [isEditing, setIsEditing] = useState(false)

  const formToMe = useTaskFormToMe()
  const formToManager = useTaskFormToManager()

  const {
    handleSubmit: handleSubmitToMe,
    reset: resetToMe,
    formState: { isValid: isValidToMe, isDirty: isDirtyToMe },
  } = formToMe

  const {
    handleSubmit: handleSubmitToManager,
    reset: resetToManager,
    formState: { isValid: isValidToManager, isDirty: isDirtyToManager },
  } = formToManager

  const target = task?.managerName && task?.managerPhone ? 'manager' : 'me'
  const isDirty = target === 'me' ? isDirtyToMe : isDirtyToManager
  const isValid = target === 'me' ? isValidToMe : isValidToManager

  const handleSubmit = (
    data: TaskFormToMeDataType | TaskFormToManagerDataType,
  ) => {
    updateTask({
      projectSlug: slug,
      slug: taskSlug,
      data,
    })
  }

  const handleDelete = () => {
    open(({ isOpen, close }) => (
      <CommonAlert
        isOpen={isOpen}
        onClose={close}
        title="태스크를 삭제하시겠어요?"
        description={
          '삭제한 태스크는 다시 복구할 수 없어요.\n정말 삭제하시겠어요?'
        }
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {
          deleteTask({
            projectSlug: slug,
            slug: taskSlug,
          })
        }}
        onCancel={close}
        loading={isDeleting}
      />
    ))
  }

  useEffect(() => {
    if (task) {
      target === 'me' ?
        resetToMe(task)
      : resetToManager({
          ...task,
          managerPhone: formatPhoneNumber(task.managerPhone),
        })
    }
  }, [task, resetToMe, resetToManager, target])

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col rounded-none min-w-screen sm:rounded-[12px] sm:min-w-[600px] w-screen sm:max-h-[800px] h-full">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <div className="flex gap-2">
            <AlertDialogTitle className="typo-pre-heading-2 text-grey-10">
              {data?.projectName}
            </AlertDialogTitle>
            <TaskStatusBadge status={data?.status} hasDot={false} />
          </div>
          <Button variant="ghost" size="fit" onClick={onClose} asChild>
            <XIcon className="size-[40px]" />
          </Button>
        </AlertDialogHeader>

        <div className="flex flex-col flex-1 px-[16px] py-[20px] overflow-y-auto">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex flex-col gap-2">
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
              >
                <div className="flex items-center gap-[12px]">
                  <RadioGroupItem
                    value="me"
                    id="me"
                    checked={target === 'me'}
                    disabled
                  />
                  <Label htmlFor="me">나에게 할당</Label>
                </div>
                <div className="flex items-center gap-[12px]">
                  <RadioGroupItem
                    value="manager"
                    id="manager"
                    checked={target === 'manager'}
                    disabled
                  />
                  <Label htmlFor="manager">담당자에게 할당</Label>
                </div>
              </RadioGroup>
            </div>

            {isEditing && (
              <AlertDialogDescription className="py-[10px] px-[20px] bg-primary-1 flex gap-[6px] items-center sm:items-start">
                <InfoFillIcon className="min-w-[20px] size-[20px] text-primary-3" />
                <p className="typo-pre-body-6">
                  이미 지정된 할당 대상은 변경할 수 없습니다.
                </p>
              </AlertDialogDescription>
            )}
          </div>

          {target === 'me' ?
            <Form {...formToMe}>
              <form id="task-form-to-me">
                <TaskFormToMe isEditing={isEditing} />
              </form>
            </Form>
          : <Form {...formToManager}>
              <form id="task-form-to-manager">
                <TaskFormToManager isEditing={isEditing} />
              </form>
            </Form>
          }
        </div>

        <AlertDialogFooter className="flex flex-row p-[12px_16px_16px_16px] border-t border-border-basic-1">
          {!isEditing && !isReadOnly && (
            <>
              <Button
                variant="solid-grey"
                size="lg"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                삭제
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(true)
                }}
              >
                수정
              </Button>
            </>
          )}
          {isReadOnly && (
            <Button type="button" onClick={onClose}>
              확인
            </Button>
          )}

          {isEditing && (
            <Button
              form={
                target === 'me' ? 'task-form-to-me' : 'task-form-to-manager'
              }
              disabled={!isValid || !isDirty}
              loading={isUpdating}
              onClick={() => {
                if (target === 'me') {
                  handleSubmitToMe(handleSubmit)()
                } else {
                  handleSubmitToManager(handleSubmit)()
                }
              }}
            >
              수정 완료
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// 훅 타입 정의
interface OpenProjectCreateModalParams {
  data: ProjectModalData
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

export const useTaskDetailModal = () => {
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

const TaskFormToMe = ({ isEditing }: { isEditing: boolean }) => {
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
                    readOnly={!isEditing}
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

const TaskFormToManager = ({ isEditing }: { isEditing: boolean }) => {
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
                  readOnly={!isEditing}
                  value={field.value}
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
                  readOnly={!isEditing}
                  maxLength={13}
                  onChange={(e) => {
                    setValue(
                      'managerPhone',
                      formatPhoneNumber(e.target.value),
                      {
                        shouldValidate: true,
                      },
                    )
                    phoneFormatter(e, field.onChange)
                  }}
                  {...omit(field, 'onChange')}
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
            <div className="flex gap-[4px] items-center">
              <FormLabel aria-required={true}>제3자 알림톡 수신 동의</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoFillIcon className="min-w-[20px] size-[20px] text-grey-5" />
                </TooltipTrigger>
                <TooltipContent className="w-[268px] py-[4px] px-[8px]">
                  <p className="typo-pre-body-6 text-grey-0 whitespace-pre-line">
                    {
                      '담당자에게 업무 관련 알림톡이 발송되며,\n수신에 동의하지 않을 경우 알림톡 전송이\n제한됩니다. 정확한 업무 전달을 위해 반드시\n담당자의 사전 동의를 받고 선택해주세요.'
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <FormControl>
              <RadioGroup
                defaultValue="me"
                className="flex gap-[32px] py-[13px]"
              >
                <div className="flex items-center gap-[12px]">
                  <RadioGroupItem
                    value="true"
                    id="agree"
                    checked={field.value === true}
                    disabled
                  />
                  <Label htmlFor="agree">동의</Label>
                </div>
                <div className="flex items-center gap-[12px]">
                  <RadioGroupItem
                    value="false"
                    id="disagree"
                    checked={field.value === false}
                    disabled
                  />
                  <Label htmlFor="disagree">동의하지 않음</Label>
                </div>
              </RadioGroup>
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
                readOnly={!isEditing}
                value={field.value}
                onChange={(e) => {
                  setValue('name', e.target.value, {
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
                readOnly={!isEditing}
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
