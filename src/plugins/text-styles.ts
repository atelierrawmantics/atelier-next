import plugin from 'tailwindcss/plugin'

export default plugin(({ addUtilities, theme }) => {
  const sm = theme('screens.sm') // tablet
  const md = theme('screens.md') // desktop

  const textStyles = {
    'pre-display-1': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      fontSize: '48px', // mobile
      [`@media (min-width: ${sm})`]: { fontSize: '64px' }, // tablet
      [`@media (min-width: ${md})`]: { fontSize: '80px' }, // desktop
    },
    'pre-display-2': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      fontSize: '40px',
      [`@media (min-width: ${sm})`]: { fontSize: '48px' },
      [`@media (min-width: ${md})`]: { fontSize: '64px' },
    },
    'pre-display-3': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      fontSize: '32px',
      [`@media (min-width: ${sm})`]: { fontSize: '40px' },
      [`@media (min-width: ${md})`]: { fontSize: '48px' },
    },
    'pre-display-4': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      fontSize: '28px',
      [`@media (min-width: ${sm})`]: { fontSize: '36px' },
      [`@media (min-width: ${md})`]: { fontSize: '40px' },
    },
    'pre-heading-1': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      fontSize: '24px',
      [`@media (min-width: ${sm})`]: { fontSize: '24px' },
      [`@media (min-width: ${md})`]: { fontSize: '32px' },
    },
    'pre-heading-2': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      fontSize: '20px',
      [`@media (min-width: ${sm})`]: { fontSize: '20px' },
      [`@media (min-width: ${md})`]: { fontSize: '24px' },
    },
    'pre-heading-3': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      fontSize: '18px',
      [`@media (min-width: ${sm})`]: { fontSize: '18px' },
      [`@media (min-width: ${md})`]: { fontSize: '20px' },
    },
    'pre-heading-4': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      fontSize: '16px',
      [`@media (min-width: ${sm})`]: { fontSize: '18px' },
      [`@media (min-width: ${md})`]: { fontSize: '18px' },
    },
    'pre-heading-5': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      fontSize: '16px',
      [`@media (min-width: ${sm})`]: { fontSize: '16px' },
      [`@media (min-width: ${md})`]: { fontSize: '16px' },
    },
    'pre-body-1': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '16px',
      [`@media (min-width: ${sm})`]: { fontSize: '18px' },
      [`@media (min-width: ${md})`]: { fontSize: '18px' },
    },
    'pre-body-2': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '16px',
      [`@media (min-width: ${sm})`]: { fontSize: '18px' },
      [`@media (min-width: ${md})`]: { fontSize: '18px' },
    },
    'pre-body-3': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '16px',
      [`@media (min-width: ${sm})`]: { fontSize: '16px' },
      [`@media (min-width: ${md})`]: { fontSize: '16px' },
    },
    'pre-body-4': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '16px',
      [`@media (min-width: ${sm})`]: { fontSize: '16px' },
      [`@media (min-width: ${md})`]: { fontSize: '16px' },
    },
    'pre-body-5': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '14px',
      [`@media (min-width: ${sm})`]: { fontSize: '14px' },
      [`@media (min-width: ${md})`]: { fontSize: '14px' },
    },
    'pre-body-6': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '14px',
      [`@media (min-width: ${sm})`]: { fontSize: '14px' },
      [`@media (min-width: ${md})`]: { fontSize: '14px' },
    },
    'pre-caption-1': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '12px',
      [`@media (min-width: ${sm})`]: { fontSize: '12px' },
      [`@media (min-width: ${md})`]: { fontSize: '12px' },
    },
    'pre-caption-2': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '12px',
      [`@media (min-width: ${sm})`]: { fontSize: '12px' },
      [`@media (min-width: ${md})`]: { fontSize: '12px' },
    },
    'pre-caption-3': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '10px',
      [`@media (min-width: ${sm})`]: { fontSize: '10px' },
      [`@media (min-width: ${md})`]: { fontSize: '10px' },
    },
    'pre-caption-4': {
      fontFamily: 'var(--font-pretendard)',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '-0.02em',
      fontSize: '10px',
      [`@media (min-width: ${sm})`]: { fontSize: '10px' },
      [`@media (min-width: ${md})`]: { fontSize: '10px' },
    },
  }

  const prefix = '.typo-'

  const textWithPrefix = Object.keys(textStyles).reduce<Record<string, any>>(
    (acc, key) => {
      const prefixedKey = prefix + key
      acc[prefixedKey] = textStyles[key as keyof typeof textStyles]
      return acc
    },
    {},
  )

  addUtilities(textWithPrefix, { layer: 'utilities' })
})
