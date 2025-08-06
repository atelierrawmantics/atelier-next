import { RootConfig } from '@toktokhan-dev/cli'
import { commit } from '@toktokhan-dev/cli-plugin-commit'
import { genApi } from '@toktokhan-dev/cli-plugin-gen-api-react-query'
import { genImg } from '@toktokhan-dev/cli-plugin-gen-img'

import { genTextStyles } from '@/scripts/ui/gen-text-styles'
import { genThemeColors } from '@/scripts/ui/gen-theme-colors'

const config: RootConfig<{
  plugins: [
    typeof genImg,
    typeof genApi,
    typeof commit,
    typeof genThemeColors,
    typeof genTextStyles,
  ]
}> = {
  plugins: [genImg, genApi, commit, genThemeColors, genTextStyles],
  'gen:img': {
    input: 'public/images',
    oneDepth: true,
    basePath: '/images',
  },
  'gen:api': {
    swaggerSchemaUrl: 'https://api.atelierfashion.co.kr/openapi.json/',
    httpClientType: 'fetch',
    instancePath: '@/configs/fetch/fetch-extend',
    paginationSets: [
      {
        keywords: ['offset', 'limit'],
        nextKey: 'offset',
        getNextPage: (param) => {
          const { pagination, apiInstanceName, functionName } = param
          const { nextKey } = pagination
          return `({ pageParam = params?.variables?.query?.offset || 0 }) => {
             return ${apiInstanceName}.${functionName}({
              ...params?.variables,
              query: { ...params?.variables?.query, ${nextKey}: pageParam },
            });
          }`
        },
        getNextPageParam: `(lastPage, allPages) => {
          if (!lastPage.isNext) return null;
          const fetchedLength = allPages?.length || 0;
          const offset = params?.variables?.query?.offset || 0;
          const limit = params?.variables?.query?.limit || 0;

          return offset + fetchedLength * limit;
        }`,
      },
      {
        keywords: ['cursor'],
        nextKey: 'cursor',
        /**
         * @type undefined | string | (param: {apiInstanceName: string; functionName: string, pagination: { keywords: string[], nextKey: string }}) => string
         */
        getNextPage: (param) => {
          const { pagination, apiInstanceName, functionName } = param
          const { nextKey } = pagination
          const query = `pageParam ? { ...params?.variables?.query, ${nextKey}: pageParam } :  { ...params?.variables?.query }`
          return `({ pageParam }: { pageParam: any }) => {
             return ${apiInstanceName}.${functionName}({
              ...params?.variables,
              query: ${query},
            });
          }`
        },
        /**
         * @type undefined | string | (param: {apiInstanceName: string; functionName: string, pagination: { keywords: string[], nextKey: string }}) => string
         */
        getNextPageParam: () => `(lastPage) => {
          return lastPage.cursor;
        }`,
      },
    ],
  },
  'gen:theme-colors': {
    input: 'public/token.json',
    outputCss: 'src/generated/theme-colors.css',
    outputTs: 'src/generated/theme-token.ts',
  },
  'gen:text-styles': {
    input: 'public/token.json',
    outputCss: 'src/generated/text-styles.css',
  },
}
export default config
