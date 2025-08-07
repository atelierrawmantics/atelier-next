import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useOverlay } from '@toss/use-overlay'

import { CommonAlert } from '@/components/common-alert'
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
import { Textarea } from '@/components/ui/textarea'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { InfoFillIcon, XIcon } from '@/generated/icons/MyIcons'

import { useProjectForm } from './use-project-form'

// 폼 필드 설정
const FORM_FIELDS = [
  {
    name: 'projectName' as const,
    label: '프로젝트명',
    placeholder: '한글 2-20자',
    maxLength: 20,
    component: Input,
    isRequired: true,
  },
  {
    name: 'projectDescription' as const,
    label: '프로젝트 설명',
    placeholder: '한글 2-20자',
    maxLength: 500,
    component: Textarea,
    className: 'h-[200px]',
    isRequired: true,
  },
  {
    name: 'clientName' as const,
    label: '고객사명',
    placeholder: '한글 2-20자',
    maxLength: 20,
    component: Input,
    isRequired: false,
  },
  {
    name: 'clientDescription' as const,
    label: '고객사 설명',
    placeholder: '한글 2-20자',
    maxLength: 500,
    component: Textarea,
    className: 'h-[200px]',
    isRequired: false,
  },
] as const

// 타입 정의
interface ProjectModalData {
  headerTitle?: string
  footerText?: string
  projectName?: string
}

interface ProjectCreateModalProps {
  isOpen: boolean
  onClose: () => void
  data?: ProjectModalData
  loading?: boolean
  status: 'create' | 'update'
  onSubmit?: (data: {
    projectName: string
    projectDescription: string
    clientName?: string
    clientDescription?: string
  }) => void
  onDirtyClose?: () => void
}

export const useProjectModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const openProjectCreateModal = () => {
    setIsOpen(true)
  }

  const openProjectUpdateModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    openProjectCreateModal,
    openProjectUpdateModal,
    closeModal,
  }
}

// 프로젝트 생성/수정 모달 컴포넌트
export const ProjectCreateModal = ({
  isOpen,
  onClose,
  data,
  loading: externalLoading,
  status,
  onSubmit,
  onDirtyClose,
}: ProjectCreateModalProps) => {
  const form = useProjectForm()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
  } = form

  const { open } = useOverlay()

  const { id } = useParams<{ id: string }>()

  const { data: project } = useProjectRetrieveQuery({
    variables: {
      slug: id,
    },
    options: {
      enabled: !!id && status === 'update',
    },
  })

  const handleProjectFormSubmit = handleSubmit((formData) => {
    if (onSubmit) {
      onSubmit(formData)
    }
  })

  const handleClose = () => {
    if (isDirty) {
      if (onDirtyClose) {
        onDirtyClose()
      } else {
        open(({ isOpen, close }) => (
          <CommonAlert
            isOpen={isOpen}
            onClose={close}
            title="작성 중인 내용이 있어요!"
            description={
              '저장하지 않고 나가면 작성한 내용은 복구할 수 없습니다.\n정말 닫으시겠어요?'
            }
            confirmText="계속 작성하기"
            cancelText="닫기"
            onConfirm={close}
            onCancel={() => {
              close()
              onClose()
            }}
          />
        ))
      }
    } else {
      onClose()
    }
  }

  useEffect(() => {
    if (project && status === 'update') {
      reset({
        projectName: project.name,
        projectDescription: project.description,
        clientName: project.clientName,
        clientDescription: project.clientDescription,
      })
    }
  }, [project, status, reset])

  const isLoading = isSubmitting || externalLoading

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-none min-w-screen sm:rounded-[12px] sm:min-w-[600px] w-screen sm:max-h-[800px] h-screen">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="typo-pre-heading-2 text-grey-10">
            {data?.headerTitle}
          </AlertDialogTitle>
          <Button variant="ghost" size="fit" onClick={handleClose} asChild>
            <XIcon className="size-[40px]" />
          </Button>
        </AlertDialogHeader>

        <AlertDialogDescription className="py-[10px] px-[20px] bg-primary-1 flex gap-[6px] items-center sm:items-start border-t border-b border-border-basic-1">
          <InfoFillIcon className="size-[20px]" />
          <p className="typo-pre-body-6">
            프로젝트를 생성 시 작업지시서가 자동으로 생성되며, 이후 바로 작성을
            진행할 수 있습니다.
          </p>
        </AlertDialogDescription>

        <div className="px-[16px] py-[20px] overflow-y-auto">
          <Form {...form}>
            <form id="project-form" onSubmit={handleProjectFormSubmit}>
              <div className="flex flex-col gap-[24px]">
                {FORM_FIELDS.map((field) => {
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
                              required
                              placeholder={field.placeholder}
                              maxLength={field.maxLength}
                              className={
                                'className' in field ?
                                  field.className
                                : undefined
                              }
                              {...formField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                })}
              </div>
            </form>
          </Form>
        </div>

        <AlertDialogFooter className="p-[12px_16px_16px_16px] border-t border-border-basic-1">
          <Button
            type="submit"
            form="project-form"
            loading={isLoading}
            onClick={handleProjectFormSubmit}
          >
            {data?.footerText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
