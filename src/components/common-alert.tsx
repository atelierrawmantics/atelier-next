import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { Button } from './ui/button'

interface CommonAlertProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export function CommonAlert({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
  loading = false,
}: CommonAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[343px] px-[16px] pt-[32px] pb-[16px] gap-[24px]">
        <AlertDialogHeader className="gap-[6px] p-0 text-center">
          <AlertDialogTitle className="typo-pre-heading-4 text-grey-10">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="typo-pre-body-6 text-grey-5 whitespace-pre-line">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="p-0">
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <Button onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
