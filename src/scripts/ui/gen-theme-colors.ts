import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

import { defineCommand } from '@toktokhan-dev/cli'

import entries from 'lodash/fp/entries.js'
import flow from 'lodash/fp/flow.js'
import map from 'lodash/fp/map.js'
import prettier from 'prettier'

export type GenThemeColorsConfig = {
  input: string
  outputTs: string
  outputCss: string
}

const sanitizeKey = (key: string) =>
  key.replace(/[.\s]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
const getKey = (key: string) => `--${sanitizeKey(key)}`
const getConfigValue = (key: string) => `var(--${sanitizeKey(key)})`

const arrayToObj = (array: string[]) =>
  array.reduce<Record<string, string>>((obj, item) => {
    const [key, value] = item.split(':')
    const normalizedKey = sanitizeKey(key)
    obj[normalizedKey] = value
    return obj
  }, {})

const generateCss = (colors: string[], isDark = false) => {
  const colorObj = arrayToObj(colors)
  const cssContent = Object.entries(colorObj)
    .map(([key, value]) => `--${key}: ${value}`)
    .join('; ')
  return `${isDark ? '.dark' : ':root'} { ${cssContent} }\n`
}

const processTokens = (
  tokens: Record<string, any>,
  lightKey = 'light',
  darkKey = 'dark',
) => {
  return flow(
    entries,
    map(([key, value]) => ({
      lightCss: `${getKey(key)}:${value[lightKey].value};`,
      darkCss: `${getKey(key)}:${value[darkKey].value};`,
      configLight: `${sanitizeKey(key)}:${getConfigValue(key)}`,
      configDark: `${sanitizeKey(key)}:${getConfigValue(key)}`,
    })),
    (mapped) => ({
      lightCss: mapped.map((item) => item.lightCss),
      darkCss: mapped.map((item) => item.darkCss),
      configLight: mapped.map((item) => item.configLight),
      configDark: mapped.map((item) => item.configDark),
    }),
  )(tokens)
}

const processColorSchema = (colors: Record<string, any>) => {
  return flow(
    entries,
    map(([key, value]) => ({
      css: `${getKey(key)}:${value.value};`,
      config: `${sanitizeKey(key)}:${getConfigValue(key)}`,
    })),
    (mapped) => ({
      css: mapped.map((item) => item.css),
      config: mapped.map((item) => item.config),
    }),
  )(colors)
}

const createNestedObject = (flatObj: Record<string, string>) => {
  const result: Record<string, any> = {}

  Object.entries(flatObj).forEach(([key, value]) => {
    const normalizedKey = sanitizeKey(key)
    const parts = normalizedKey.split('.')
    let current = result

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = value
      } else {
        current[part] = current[part] || {}
        current = current[part]
      }
    })
  })

  return result
}

export const genThemeColors = defineCommand<
  'gen:theme-colors',
  GenThemeColorsConfig
>({
  name: 'gen:theme-colors',
  description: 'Generate Tailwind color themes from tokens.',
  default: {
    input: 'public/token.json',
    outputTs: path.resolve('src/generated', 'theme-token.ts'),
    outputCss: path.resolve('src/generated', 'theme-colors.css'),
  },
  cliOptions: [
    {
      name: 'outputTs',
      alias: 'ots',
      description: 'Output path for TypeScript file',
      type: 'string',
    },
    {
      name: 'outputCss',
      alias: 'ocss',
      description: 'Output path for CSS file',
      type: 'string',
    },
  ],
  run: async (config) => {
    const themeData = JSON.parse(readFileSync(config.input, 'utf-8'))

    mkdirSync(path.dirname(config.outputTs), { recursive: true })
    mkdirSync(path.dirname(config.outputCss), { recursive: true })

    const colorSchema = processColorSchema(themeData.colors.colorSchema)
    const semanticTokens = processTokens(themeData.colors.semanticTokens)

    const combinedColors = {
      rootCss: [...colorSchema.css, ...semanticTokens.lightCss],
      darkCss: [...semanticTokens.darkCss],
      lightCss: [...colorSchema.css],
      config: [
        ...colorSchema.config,
        ...semanticTokens.configLight,
        ...semanticTokens.configDark,
      ],
    }

    const flatTokens = arrayToObj(combinedColors.config)
    const nestedTokens = createNestedObject(flatTokens)

    const cssContent = `
      @theme {
        --color-*: initial;

        ${colorSchema.css.map((css) => css.replace('--', '--color-')).join('\n        ')}
      }

      @layer base {
        ${generateCss([...colorSchema.css, ...semanticTokens.lightCss])}
        ${generateCss(semanticTokens.darkCss, true)}
      }
    `

    const tsContent = `export const theme = ${JSON.stringify(nestedTokens, null, 2)} as const;

export type Theme = typeof theme;`

    const formattedCss = await prettier.format(cssContent, {
      parser: 'css',
      singleQuote: true,
    })

    const formattedTs = await prettier.format(tsContent, {
      parser: 'typescript',
      singleQuote: true,
    })

    writeFileSync(config.outputCss, formattedCss, 'utf-8')
    writeFileSync(config.outputTs, formattedTs, 'utf-8')
  },
})
