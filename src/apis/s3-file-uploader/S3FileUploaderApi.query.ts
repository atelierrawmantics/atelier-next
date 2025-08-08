import { useMutation } from '@tanstack/react-query'
import {
  createS3UploadFlow,
  // assertItemOf,
} from '@toktokhan-dev/universal'

import { fetchExtended } from '@/configs/fetch/fetch-extend'
import { PresignedRequestFieldChoiceEnumType } from '@/generated/apis/@types/data-contracts'
import { presignedUrlApi } from '@/generated/apis/PresignedUrl/PresignedUrl.query'
import { UseMutationParams } from '@/types/module/react-query/use-mutation-params'

import { S3FileUploaderApi } from './S3FileUploaderApi'

const s3FileUploaderApi = new S3FileUploaderApi({
  customFetch: fetchExtended,
})

/**
 * presigned url s3 Flow
 *
 * @description
 * createUploadFlow 함수는 S3 파일 업로드를 위한 플로우를 생성합니다.
 * 해당 함수는 prepareUpload 와 uploadFileToS3 두개의 함수를 받아 연속 실행하는 함수를 반환합니다.
 *
 * - prepareUpload: 파일을 업로드하기 전에 필요한 정보를 준비합니다. (주로 presigned url 을 생성하는 역할을 수행합니다.)
 * - uploadFileToS3: S3에 파일을 업로드합니다.
 *
 * 반환되는 함수는 prepareUpload 함수의 parameter type 을 input type 으로 가지며, uploadFileToS3 함수의 return type 을 반환합니다.
 *
 * @example
 * ```
 * // input
 * prepareUpload: async (number) => { someField: string };
 * uploadFileToS3: async ({ someField: string }) => stirng;
 *
 * // output
 * uploadFile : (number) => string;
 * uploadFiles: (number[]) => { fulfilled: string[], rejected: PromiseRejectedResult[] }
 * ```
 *
 */

export const { uploadFile, uploadFiles } = createS3UploadFlow({
  prepareUpload: async (
    file: File,
    fieldChoice?: PresignedRequestFieldChoiceEnumType,
  ) => {
    const { name, type } = file
    const [mime] = type.split('/')

    console.log('S3 prepareUpload 시작:', { name, type, mime, fieldChoice })

    const { fields, url } = await presignedUrlApi.presignedUrlCreate({
      data: {
        fileName: name,
        fileType: mime as 'image' | 'text' | 'audio' | 'video' | 'application',
        fieldChoice: fieldChoice || 'schematic.Schematic.image',
      },
    })

    console.log('presigned URL 생성 완료:', { url, fields })

    const formData = new FormData()
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v as string))
    formData.append('Content-Type', file.type)
    formData.append('file', file)

    console.log('FormData 준비 완료')

    return {
      url,
      formData,
      fields,
      file,
    }
  },
  uploadFileToS3: async ({ url, formData, file, fields }) => {
    console.log('S3 업로드 시작:', { url, file: file.name })
    await s3FileUploaderApi.uploadFileToS3({ url, formData })
    const resultUrl = url + (fields as any).key
    console.log('S3 업로드 완료, 결과 URL:', resultUrl)
    return resultUrl
  },
})

export const useUploadFileToS3Mutation = (
  params?: UseMutationParams<typeof uploadFile>,
) => {
  return useMutation({
    mutationFn: uploadFile,
    ...params?.options,
  })
}

export const useUploadFilesToS3Mutation = (
  params?: UseMutationParams<typeof uploadFiles>,
) => {
  return useMutation({
    mutationFn: uploadFiles,
    ...params?.options,
  })
}
