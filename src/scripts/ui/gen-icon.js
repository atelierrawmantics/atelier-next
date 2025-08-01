const { readFileSync, readdirSync, writeFileSync } = require('fs')
const path = require('path')
const { join } = path

const {
  createObjBySelector,
  pass,
  removeStr,
  suffix,
} = require('@toktokhan-dev/universal')

const { identity } = require('lodash')
const { flow, map, replace } = require('lodash/fp')
const prettier = require('prettier')

const SVG_PATH = 'public/icons'
const OUTPUT_PATH = 'src/generated/icons'

const convertToPascalCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
      return word.toUpperCase()
    })
    .replace(/(-|_)/g, '')
    .replace(/\s+/g, '')
}

const svgContent = flow((fileName) => {
  const filePath = join(SVG_PATH, fileName)
  const fileContent = readFileSync(filePath, 'utf-8')
  return fileContent
})

const indexingSvg = flow(pass(SVG_PATH), readdirSync)
const replaceAll = (pattern, replacement) =>
  replace(new RegExp(pattern, 'g'), replacement)
console.log('indexingSvg', indexingSvg)
console.log('indexingSvg', indexingSvg)
flow(
  indexingSvg,
  map(
    flow(
      createObjBySelector({
        pathname: identity,
        iconName: flow(
          (identity) => convertToPascalCase(identity),
          removeStr('.Svg'),
          suffix('Icon'),
        ),
        svgContent: flow(
          svgContent,
          replaceAll('clip-path', 'clipPath'),
          replaceAll('stroke-width', 'strokeWidth'),
          replaceAll('stroke-linecap', 'strokeLinecap'),
          replaceAll('stroke-linejoin', 'strokeLinejoin'),
          replaceAll('fill-rule', 'fillRule'),
          replaceAll('clip-rule', 'clipRule'),
          replaceAll('xlink:href', 'xlinkHref'),
          replaceAll('xmlns:xlink', 'xmlnsXlink'),
          replaceAll('stroke-miterlimit', 'strokeMiterlimit'),
          replaceAll('fill-opacity', 'fillOpacity'),
          replaceAll('stop-color', 'stopColor'),
          replaceAll('stop-opacity', 'stopOpacity'),
          replaceAll('class', 'className'),

          replaceAll('class="[^"]*"', ''),
          replaceAll('style="[^"]*"', ''),

          replace('<svg', '<svg ref={ref}'),
          replace('>', `{...props} >`),
        ),
      }),
      flow(
        (
          obj,
        ) => `export const ${obj.iconName} = forwardRef<SVGSVGElement, IconProps>(
          function ${obj.iconName}(props, ref) {
            return (
              ${obj.svgContent.trim()}
            );
          },
        );`,
      ),
    ),
  ),

  (identity) => {
    const newFilePath = path.join(OUTPUT_PATH, 'MyIcons.tsx')
    console.log({ newFilePath })
    const content = identity.join('\n')

    const head = `import { SVGProps, forwardRef } from 'react'

    interface IconProps extends SVGProps<SVGSVGElement> {}
    `

    const fileContent = head + '\n' + content

    return writeFileSync(newFilePath, fileContent, 'utf-8')
  },
)()
