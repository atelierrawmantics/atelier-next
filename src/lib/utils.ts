import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 핸드폰 번호를 한국 형식으로 포맷팅합니다.
 * @param phone - 포맷팅할 전화번호 (숫자만 포함)
 * @returns 포맷팅된 전화번호 (예: 010-1234-5678)
 */
export function formatPhoneNumber(phone: string): string {
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '')

  // 길이에 따라 다른 포맷 적용
  if (numbers.length === 11) {
    // 01012345678 -> 010-1234-5678
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
  } else if (numbers.length === 10) {
    // 0101234567 -> 010-123-4567
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`
  } else if (numbers.length === 9) {
    // 010123456 -> 010-123-456
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`
  }

  // 길이가 맞지 않으면 원본 반환
  return phone
}

/**
 * 핸드폰 번호의 유효성을 검사합니다.
 * @param phone - 검사할 전화번호
 * @returns 유효한 전화번호인지 여부
 */
export function isValidPhoneNumber(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '')

  // 10자리 또는 11자리 숫자인지 확인
  if (numbers.length !== 10 && numbers.length !== 11) {
    return false
  }

  // 010, 011, 016, 017, 018, 019로 시작하는지 확인
  const validPrefixes = ['010', '011', '016', '017', '018', '019']
  const prefix = numbers.slice(0, 3)

  return validPrefixes.includes(prefix)
}
