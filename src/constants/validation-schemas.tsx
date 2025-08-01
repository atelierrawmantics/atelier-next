import * as yup from 'yup'

// 공통 유효성 검사 스키마들
export const nameSchema = yup
  .string()
  .required('이름을 입력해 주세요')
  .min(2, '2자 이상 입력해 주세요')
  .max(20, '20자 이하로 입력해 주세요')
  .matches(/^[가-힣]+$/, '한글만 입력 가능합니다')

export const birthdaySchema = yup
  .string()
  .required('생년월일을 입력해 주세요')
  .matches(/^\d{4}-\d{2}-\d{2}$/, '생년월일을 올바른 형식으로 입력해 주세요')
  .test('valid-date', '올바른 생년월일을 입력해 주세요', (value) => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

    const [year, month, day] = value.split('-').map(Number)

    if (year < 1900) return false
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 31) return false

    const date = new Date(year, month - 1, day)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    )
  })

export const phoneSchema = yup
  .string()
  .required('휴대폰번호를 입력해 주세요')
  .matches(/^\d{3}-\d{3,4}-\d{4}$/, '올바른 휴대폰번호를 입력해 주세요')

export const verificationCodeSchema = yup
  .string()
  .required('인증번호를 입력해 주세요')
  .matches(/^\d{6}$/, '인증번호 6자리를 입력해 주세요')
