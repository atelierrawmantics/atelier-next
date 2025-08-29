import { ExternalToast, toast as sonnerToast } from 'sonner'

import { CheckCircleFillIcon, XCircleFillIcon } from '@/generated/icons/MyIcons'

const STATUS_ICONS = {
  success: <CheckCircleFillIcon className="size-[24px]" />,
  error: <XCircleFillIcon className="size-[24px]" />,
} as const

export const toast = (
  message: string,
  options?: ExternalToast,
  type: 'success' | 'error' = 'success',
) => {
  const icon = type ? STATUS_ICONS[type] : 'success'

  sonnerToast(message, {
    action: options?.action,
    position: options?.position || 'bottom-center',
    duration: 20000000,
    icon: options?.icon || icon,
    style: options?.style || {
      width: '399px',
      height: '48px',
      borderRadius: '8px',
      backgroundColor: 'var(--grey-transparent-6)',
      color: 'var(--grey-0)',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '22.4px',
      letterSpacing: '-0.28px',
      gap: '8px',
      border: 'unset',
    },
    actionButtonStyle: options?.actionButtonStyle || {
      padding: 0,
      backgroundColor: 'transparent',
      color: 'var(--grey-0)',
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '22.4px',
      letterSpacing: '-0.28px',
    },
    description: options?.description,
    dismissible: options?.dismissible,
    unstyled: options?.unstyled,
    className: options?.className,
    closeButton: options?.closeButton,
    id: options?.id,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  })
}
