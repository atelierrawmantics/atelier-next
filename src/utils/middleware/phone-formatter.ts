import { formatPhoneNumber } from '@/lib/utils'

export const phoneFormatter = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void,
) => {
  const inputValue = e.target.value
  const numbers = inputValue.replace(/\D/g, '')

  if (numbers.length > 11) return

  // 사용자가 입력한 값의 길이가 현재 저장된 값보다 짧으면 삭제 중
  const currentValue = e.target.defaultValue || ''
  const isDeleting = inputValue.length < currentValue.length

  if (isDeleting) {
    // 삭제 중일 때는 사용자가 입력한 값을 그대로 저장
    onChange(inputValue)
  } else {
    // 입력 중일 때는 포맷팅 적용
    const formattedValue = formatPhoneNumber(numbers)
    onChange(formattedValue)
  }
}
