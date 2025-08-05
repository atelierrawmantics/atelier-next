import { useOverlay } from '@toss/use-overlay'

import {
  AlertDialog,
  AlertDialogAction,
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
import { InfoFillIcon, XIcon } from '@/generated/icons/MyIcons'

import { useProjectForm } from './use-proejct-form'

// 타입 정의
interface ProjectModalData {
  projectName: string
}

interface ProjectCreateModalProps {
  isOpen: boolean
  onClose: () => void
  data?: ProjectModalData
  onSubmit: (slug?: string) => void
}

// 폼 필드 설정
const FORM_FIELDS = [
  {
    name: 'projectName' as const,
    label: '프로젝트명',
    placeholder: '한글 2-20자',
    maxLength: 20,
    component: Input,
  },
  {
    name: 'projectDescription' as const,
    label: '프로젝트 설명',
    placeholder: '한글 2-20자',
    maxLength: 500,
    component: Textarea,
    className: 'h-[200px]',
  },
  {
    name: 'clientName' as const,
    label: '고객사명',
    placeholder: '한글 2-20자',
    maxLength: 20,
    component: Input,
  },
  {
    name: 'clientDescription' as const,
    label: '고객사 설명',
    placeholder: '한글 2-20자',
    maxLength: 500,
    component: Textarea,
    className: 'h-[200px]',
  },
] as const

// 프로젝트 생성 모달 컴포넌트
const ProjectCreateModal = ({
  isOpen,
  onClose,
  data,
  onSubmit,
}: ProjectCreateModalProps) => {
  const form = useProjectForm()
  const { control } = form

  const handleFormSubmit = () => {
    onSubmit()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-none min-w-screen sm:rounded-[12px] sm:min-w-[600px] w-screen sm:max-h-[800px] h-screen">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="typo-pre-heading-2 text-grey-10">
            {data?.projectName}
          </AlertDialogTitle>
          <Button variant="ghost" size="fit" onClick={onClose} asChild>
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
            <form
              id="project-form"
              onSubmit={form.handleSubmit(handleFormSubmit)}
            >
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
                          <FormLabel aria-required>{field.label}</FormLabel>
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
          <AlertDialogAction type="submit" form="project-form">
            {data?.projectName}
          </AlertDialogAction>
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

export const useProjectModal = () => {
  const { open } = useOverlay()

  const openProjectCreateModal = ({
    data,
    onClose,
  }: OpenProjectCreateModalParams) => {
    open(({ isOpen, close }) => (
      <ProjectCreateModal
        isOpen={isOpen}
        onClose={close}
        data={data}
        onSubmit={onClose}
      />
    ))
  }

  return {
    openProjectCreateModal,
  }
}
