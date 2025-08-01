import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

import { defineCommand } from '@toktokhan-dev/cli'

export type GenTextStylesConfig = {
  input: string
  outputCss: string
}

const screens = {
  sm: '768px', // tablet
  md: '1440px', // desktop
}

function kebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function convertFontFamily(fontFamily: string) {
  // Pretendard Variable을 CSS 변수로 변환
  return fontFamily === 'Pretendard Variable' ?
      'var(--font-pretendard)'
    : fontFamily
}

function convertLineHeight(lineHeight: string | number) {
  // 퍼센트 문자열을 숫자로 변환 (예: "129.99999523162842%" -> 1.3)
  if (typeof lineHeight === 'string' && lineHeight.includes('%')) {
    return parseFloat(lineHeight.replace('%', '')) / 100
  }
  return lineHeight
}

function convertLetterSpacing(letterSpacing: string) {
  // 퍼센트를 em으로 변환 (예: "-1%" -> "-0.01em")
  if (letterSpacing === '-1%') return '-0.01em'
  if (letterSpacing === '-2%') return '-0.02em'
  return letterSpacing
}

function genCssForStyle(name: string, style: any) {
  const className = `.typo-${kebabCase(name)}`

  // fontSize 처리
  const base =
    style.fontSize?.mobile || style.fontSize?.base || style.fontSize || ''
  const tablet = style.fontSize?.tablet || ''
  const desktop = style.fontSize?.desktop || ''

  let css = `${className} {\n`

  // fontFamily 변환 및 추가
  if (style.fontFamily) {
    css += `  font-family: ${convertFontFamily(style.fontFamily)};\n`
  }

  // fontWeight 추가
  if (style.fontWeight) {
    css += `  font-weight: ${style.fontWeight};\n`
  }

  // lineHeight 변환 및 추가
  if (style.lineHeight) {
    const convertedLineHeight = convertLineHeight(style.lineHeight)
    css += `  line-height: ${convertedLineHeight};\n`
  }

  // letterSpacing 변환 및 추가
  if (style.letterSpacing) {
    const convertedLetterSpacing = convertLetterSpacing(style.letterSpacing)
    css += `  letter-spacing: ${convertedLetterSpacing};\n`
  }

  // textDecoration 추가
  if (style.textDecoration) {
    css += `  text-decoration: ${style.textDecoration};\n`
  }

  // fontSize 추가
  if (base) {
    css += `  font-size: ${base};\n`
  }

  css += `}\n`

  // 미디어쿼리 추가
  if (tablet) {
    css += `@media (min-width: ${screens.sm}) {\n  ${className} { font-size: ${tablet}; }\n}\n`
  }
  if (desktop) {
    css += `@media (min-width: ${screens.md}) {\n  ${className} { font-size: ${desktop}; }\n}\n`
  }

  return css
}

export const genTextStyles = defineCommand<
  'gen:text-styles',
  GenTextStylesConfig
>({
  name: 'gen:text-styles',
  description: 'Generate text styles from tokens.',
  default: {
    input: 'public/token.json',
    outputCss: path.resolve('src/generated', 'text-styles.css'),
  },
  cliOptions: [
    {
      name: 'outputCss',
      alias: 'ocss',
      description: 'Output path for CSS file',
      type: 'string',
    },
  ],
  run: async (config) => {
    const token = JSON.parse(readFileSync(config.input, 'utf-8'))
    const textStyles = token.textStyles || {}

    mkdirSync(path.dirname(config.outputCss), { recursive: true })

    let result = ''
    for (const [name, style] of Object.entries(textStyles)) {
      result += genCssForStyle(name, style)
    }

    writeFileSync(config.outputCss, result, 'utf-8')
    console.log('text-styles.css has been generated from token.json')
  },
})
