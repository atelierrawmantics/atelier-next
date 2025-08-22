'use client'

import React, { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'
import {
  EmptyView,
  LoadingView,
  fileToBase64,
} from '@toktokhan-dev/react-universal'

import { useWatch } from 'react-hook-form'
import { ClassNameValue } from 'tailwind-merge'

import {
  useUploadFileToS3Mutation,
  useUploadFilesToS3Mutation,
} from '@/apis/s3-file-uploader/S3FileUploaderApi.query'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  QUERY_KEY_INSTRUCTION_API,
  useProjectInstructionPartialUpdateMutation,
  useProjectInstructionRetrieveQuery,
} from '@/generated/apis/Instruction/Instruction.query'
import {
  QUERY_KEY_PROJECT_API,
  useProjectRetrieveQuery,
} from '@/generated/apis/Project/Project.query'
import { SwatchesIcon, XIcon } from '@/generated/icons/MyIcons'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

import { useProjectInfoForm } from '../hooks/use-project-info-form'
import { AccordionFormItem } from './accordion-form-item'
import { ImageUploadArea } from './image-upload-area'
import { InputField } from './input-field'
import { ProjectInfoFormSkeleton } from './project-info-form-skeleton'
import { TableHeader } from './table-header'
import { TableRow } from './table-row'

// 섹션별 설정
const SECTION_CONFIGS = {
  'season-style': {
    title: '시즌 및 스타일 정보',
    fields: [
      {
        name: 'year',
        label: '년도',
        placeholder: '년도를 입력해 주세요',
        maxLength: 4,
      },
      {
        name: 'season',
        label: '시즌',
        placeholder: '시즌명을 입력해 주세요',
        maxLength: 14,
      },
      {
        name: 'style',
        label: '스타일',
        placeholder: '스타일을 입력해 주세요',
        maxLength: 43,
      },
      {
        name: 'variant',
        label: '품명',
        placeholder: '품명을 입력해 주세요',
        maxLength: 43,
      },
      {
        name: 'item',
        label: '아이템',
        placeholder: '아이템을 입력해 주세요',
        maxLength: 43,
      },
      {
        name: 'generation',
        label: '차수',
        placeholder: '차수를 입력해 주세요',
        maxLength: 14,
      },
    ],
  },
  schematic: {
    title: '도식화 이미지',
    hasImageUpload: true,
    maxImageCount: 1,
  },
  'size-spec': {
    title: '사이즈 스펙 (SIZE SPEC)',
    tableConfig: {
      columns: 7,
      rows: 15,
      headers: ['Part', '', '', '', '', '', '편차'] as string[],
    },
  },
  'style-color': {
    title: '스타일 컬러 (STYLE COLOR)',
    tableConfig: {
      columns: 7,
      rows: 7,
      headers: ['Color', '', '', '', '', '', '수량'] as string[],
    },
  },
  'fabric-details': {
    title: '원단 상세 정보',
    tableConfig: {
      columns: 6,
      rows: 6,
      headers: ['구분', '원단명', '컬러', '혼용율', '규격', '요척'] as string[],
    },
  },
  'accessory-info': {
    title: '부자재 정보',
    tableConfig: {
      columns: 5,
      rows: 6,
      headers: ['자재명', '규격', '컬러', '사용부위', '요척'] as string[],
    },
  },
  swatch: {
    title: 'SWATCH',
    hasImageUpload: true,
    maxImageCount: 6,
  },
} as const
const createEmptyArray = (rows: number, cols: number) => {
  return Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(''))
}
interface ProjectInfoFormProps {
  className?: ClassNameValue
}

export const ProjectInfoForm = ({ className }: ProjectInfoFormProps) => {
  const form = useProjectInfoForm()
  const { watch, setValue, reset } = form

  // 파일 상태를 별도로 관리
  const [schematicFile, setSchematicFile] = useState<File | null>(null)
  const [swatchFiles, setSwatchFiles] = useState<File[]>([])
  // 삭제된 스와치 ID들을 추적
  const [deletedSwatchIds, setDeletedSwatchIds] = useState<number[]>([])

  // 초기 데이터를 저장할 상태 추가
  const [initialData, setInitialData] = useState<any>(null)

  const queryClient = useQueryClient()

  const { slug } = useParams<{ slug: string }>()
  const { data: projectData, isLoading: isProjectLoading } =
    useProjectRetrieveQuery({
      variables: {
        slug,
      },
      options: {
        enabled: !!slug,
      },
    })

  const { isShared, isOwned } = projectData || {}
  const isReadOnly = isShared && !isOwned

  const { data: instructionData, isLoading: isInstructionLoading } =
    useProjectInstructionRetrieveQuery({
      variables: {
        projectSlug: slug,
        id: 'me',
      },
      options: {
        enabled: !!slug,
      },
    })

  const { mutateAsync: uploadFiles } = useUploadFilesToS3Mutation({})
  const { mutateAsync: uploadFile } = useUploadFileToS3Mutation({})

  const { mutateAsync: updateInstruction } =
    useProjectInstructionPartialUpdateMutation({})

  // 로딩 상태 계산
  const isLoading = isProjectLoading || isInstructionLoading

  // useWatch로 필요한 값들만 구독
  const year = useWatch({ control: form.control, name: 'year' })
  const season = useWatch({ control: form.control, name: 'season' })
  const style = useWatch({ control: form.control, name: 'style' })
  const variant = useWatch({ control: form.control, name: 'variant' })
  const item = useWatch({ control: form.control, name: 'item' })
  const generation = useWatch({ control: form.control, name: 'generation' })
  const schematic = useWatch({ control: form.control, name: 'schematic' })
  const sizeNames = useWatch({ control: form.control, name: 'sizeNames' })
  const sizeValues = useWatch({ control: form.control, name: 'sizeValues' })
  const colorValues = useWatch({ control: form.control, name: 'colorValues' })
  const fabricValues = useWatch({ control: form.control, name: 'fabricValues' })
  const materialValues = useWatch({
    control: form.control,
    name: 'materialValues',
  })
  const swatchSet = useWatch({ control: form.control, name: 'swatchSet' })

  // 각 섹션별 isDirty 상태 계산 - 초기 데이터와 비교
  const isSeasonStyleDirty = useMemo(() => {
    if (!initialData) return false

    const initial = {
      year: initialData.year || '',
      season: initialData.season || '',
      style: initialData.style || '',
      variant: initialData.variant || '',
      item: initialData.item || '',
      generation: initialData.generation || '',
    }

    const current = {
      year: year || '',
      season: season || '',
      style: style || '',
      variant: variant || '',
      item: item || '',
      generation: generation || '',
    }

    return JSON.stringify(initial) !== JSON.stringify(current)
  }, [year, season, style, variant, item, generation, initialData])

  const isSchematicDirty = useMemo(() => {
    if (!initialData) return false

    const initialSchematic = initialData.schematic
    const currentSchematic = schematic

    // 둘 다 null이거나 undefined면 변경 없음
    if (!initialSchematic && !currentSchematic) return false

    // 하나만 null이면 변경 있음
    if (!initialSchematic || !currentSchematic) return true

    // 둘 다 객체이고 image 속성이 있으면 비교
    if (initialSchematic.image && currentSchematic.image) {
      return initialSchematic.image !== currentSchematic.image
    }

    return false
  }, [schematic, initialData])

  const isSizeSpecDirty = useMemo(() => {
    if (!initialData) return false

    const initialSizeNames = initialData.sizeNames || []
    const initialSizeValues = initialData.sizeValues || []

    const currentSizeNames = sizeNames || []
    const currentSizeValues = sizeValues || []

    return (
      JSON.stringify(initialSizeNames) !== JSON.stringify(currentSizeNames) ||
      JSON.stringify(initialSizeValues) !== JSON.stringify(currentSizeValues)
    )
  }, [sizeValues, sizeNames, initialData])

  const isStyleColorDirty = useMemo(() => {
    if (!initialData) return false

    const initialColorValues = initialData.colorValues || []
    const currentColorValues = colorValues || []

    return (
      JSON.stringify(initialColorValues) !== JSON.stringify(currentColorValues)
    )
  }, [colorValues, initialData])

  const isFabricDirty = useMemo(() => {
    if (!initialData) return false

    const initialFabricValues = initialData.fabricValues || []
    const currentFabricValues = fabricValues || []

    return (
      JSON.stringify(initialFabricValues) !==
      JSON.stringify(currentFabricValues)
    )
  }, [fabricValues, initialData])

  const isAccessoryDirty = useMemo(() => {
    if (!initialData) return false

    const initialMaterialValues = initialData.materialValues || []
    const currentMaterialValues = materialValues || []

    return (
      JSON.stringify(initialMaterialValues) !==
      JSON.stringify(currentMaterialValues)
    )
  }, [materialValues, initialData])

  const isSwatchDirty = useMemo(() => {
    if (!initialData) return false

    const initialSwatchSet = initialData.swatchSet || []
    const currentSwatchSet = swatchSet || []

    // 삭제된 항목이 있으면 변경된 것으로 간주
    if (deletedSwatchIds.length > 0) return true

    // 새로 추가된 파일이 있으면 변경된 것으로 간주
    if (swatchFiles.length > 0) return true

    // 기존 항목들의 개수가 다르면 변경된 것으로 간주
    if (initialSwatchSet.length !== currentSwatchSet.length) return true

    // 각 항목의 이미지 URL을 비교
    const initialImages = initialSwatchSet.map((item: any) => item.image).sort()
    const currentImages = currentSwatchSet.map((item: any) => item.image).sort()

    return JSON.stringify(initialImages) !== JSON.stringify(currentImages)
  }, [swatchSet, initialData, deletedSwatchIds, swatchFiles])

  // 이미지 업로드 핸들러들
  const handleSchematicUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const base64String = await fileToBase64(file)
        setValue('schematic', { image: base64String as string })
        setSchematicFile(file)
      } catch (error) {
        console.error('도식화 이미지 base64 변환 실패:', error)
      }
    }
    event.target.value = ''
  }

  const handleSwatchUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || [])
    const currentSwatchSet = watch('swatchSet') || []

    if (files.length > 0 && currentSwatchSet.length < 6) {
      const filesToUpload = files.slice(0, 6 - currentSwatchSet.length)

      try {
        const base64Promises = filesToUpload.map((file: File) =>
          fileToBase64(file),
        )
        const base64Strings = await Promise.all(base64Promises)

        const newSwatchItems = base64Strings.map((base64String) => ({
          id: null,
          image: base64String as string,
        }))

        setValue('swatchSet', [...currentSwatchSet, ...newSwatchItems])
        setSwatchFiles([...swatchFiles, ...filesToUpload])
      } catch (error) {
        console.error('스와치 이미지 base64 변환 실패:', error)
      }
    }
    event.target.value = ''
  }

  // 데이터 추출 함수들
  const extractSeasonStyleData = () => ({
    year,
    season,
    style,
    variant,
    item,
    generation,
  })

  const extractSchematicData = async (): Promise<Record<string, unknown>> => {
    let uploadedSchematic = schematic

    if (schematicFile instanceof File) {
      try {
        const uploadResult = await uploadFile(schematicFile)
        uploadedSchematic = { image: uploadResult }
      } catch (e) {
        console.error('도식화 이미지 업로드 중 오류 발생:', e)
        return { schematic: uploadedSchematic }
      }
    }

    // schematic이 null이거나 undefined이거나 빈 객체이면 null 반환
    if (
      !uploadedSchematic ||
      (typeof uploadedSchematic === 'object' &&
        uploadedSchematic !== null &&
        (!uploadedSchematic.image || uploadedSchematic.image === ''))
    ) {
      return {
        schematic: null,
      }
    }

    // base64가 아닌 실제 URL만 보내기
    const schematicUrl =
      (
        typeof uploadedSchematic === 'object' &&
        uploadedSchematic &&
        'image' in uploadedSchematic &&
        typeof uploadedSchematic.image === 'string' &&
        uploadedSchematic.image.startsWith('data:')
      ) ?
        null
      : uploadedSchematic

    return {
      schematic: schematicUrl ?? null,
    }
  }

  const extractSizeSpecData = () => ({
    sizeNames,
    sizeValues,
  })

  const extractStyleColorData = () => ({
    colorValues,
  })

  const extractFabricData = () => ({
    fabricValues,
  })

  const extractAccessoryData = () => ({
    materialValues,
  })

  const extractSwatchData = async (): Promise<Record<string, unknown>> => {
    const currentSwatchSet = swatchSet || []
    let updatedSwatchSet = [...currentSwatchSet]

    // 새로 업로드된 파일들만 S3에 업로드
    if (swatchFiles.length > 0) {
      try {
        const uploadResults = await uploadFiles(swatchFiles)
        const uploadedUrls = uploadResults.fulfilled

        // 새로 업로드된 파일들을 URL로 교체
        const newSwatchItems = uploadedUrls.map((url) => ({
          id: null, // 새로 생성되는 항목
          image: url,
        }))

        // 기존 항목들 중 base64가 아닌 것들만 유지하고, 새 항목들 추가
        const existingItems = currentSwatchSet.filter(
          (item) => !item.image.startsWith('data:'), // base64가 아닌 기존 항목들만 유지
        )

        updatedSwatchSet = [...existingItems, ...newSwatchItems]
      } catch (e) {
        console.error('스와치 이미지 업로드 중 오류 발생:', e)
        return { swatchSet: updatedSwatchSet }
      }
    }

    // ID 기반 로직: 기존 항목들은 유지, 새 항목들은 생성, 삭제된 항목들은 제외
    const swatchSetToSend = updatedSwatchSet
      .filter((item) => {
        // 삭제된 ID가 있으면 제외
        if (item.id && deletedSwatchIds.includes(item.id)) {
          return false
        }
        return true
      })
      .map((item) => ({
        id: item.id, // 기존 ID 유지 또는 null (새 항목)
        image: item.image,
      }))

    return {
      swatchSet: swatchSetToSend,
    }
  }

  // 공통 저장 핸들러 생성 함수
  const createSaveHandler = (
    sectionName: string,
    dataExtractor: () =>
      | Record<string, unknown>
      | Promise<Record<string, unknown>>,
  ) => {
    return async () => {
      const sectionData = await dataExtractor()

      try {
        await updateInstruction({
          projectSlug: slug,
          id: 'me',
          data: sectionData,
        })
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY_INSTRUCTION_API.PROJECT_INSTRUCTION_RETRIEVE({
            projectSlug: slug,
            id: 'me',
          }),
        })
        toast(sectionName + '이(가) 저장되었어요.', {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        })
      } catch {
        toast(
          sectionName + ' 저장에 실패했어요.',
          {
            action: {
              label: '닫기',
              onClick: () => {},
            },
          },
          'error',
        )
      }
    }
  }

  // 각 섹션별 저장 핸들러
  const handleSeasonStyleSave = createSaveHandler(
    '시즌 및 스타일 정보',
    extractSeasonStyleData,
  )

  const handleSchematicSave = async () => {
    const sectionData = await extractSchematicData()

    try {
      await updateInstruction({
        projectSlug: slug,
        id: 'me',
        data: sectionData,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY_INSTRUCTION_API.PROJECT_INSTRUCTION_RETRIEVE({
          projectSlug: slug,
          id: 'me',
        }),
      })

      // 도식화 이미지 저장 후 파일 상태 초기화
      setSchematicFile(null)

      toast('도식화 이미지이(가) 저장되었어요.', {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })
    } catch {
      toast(
        '도식화 이미지 저장에 실패했어요.',
        {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        },
        'error',
      )
    }
  }

  const handleSizeSpecSave = createSaveHandler(
    '사이즈 스펙',
    extractSizeSpecData,
  )

  const handleStyleColorSave = createSaveHandler(
    '스타일 컬러',
    extractStyleColorData,
  )

  const handleFabricSave = createSaveHandler(
    '원단 상세 정보',
    extractFabricData,
  )

  const handleAccessorySave = createSaveHandler(
    '부자재 정보',
    extractAccessoryData,
  )

  const handleSwatchSave = async () => {
    const sectionData = await extractSwatchData()

    try {
      await updateInstruction({
        projectSlug: slug,
        id: 'me',
        data: sectionData,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY_INSTRUCTION_API.PROJECT_INSTRUCTION_RETRIEVE({
          projectSlug: slug,
          id: 'me',
        }),
      })

      // 스와치 저장 후 상태 초기화
      setSwatchFiles([])
      setDeletedSwatchIds([])

      toast('SWATCH이(가) 저장되었어요.', {
        action: {
          label: '닫기',
          onClick: () => {},
        },
      })
    } catch {
      toast(
        'SWATCH 저장에 실패했어요.',
        {
          action: {
            label: '닫기',
            onClick: () => {},
          },
        },
        'error',
      )
    }
  }

  // 각 섹션별 리셋 핸들러
  const handleSeasonStyleReset = () => {
    setValue('year', '')
    setValue('season', '')
    setValue('style', '')
    setValue('variant', '')
    setValue('item', '')
    setValue('generation', '')
  }

  const handleSchematicReset = () => {
    setValue('schematic', null)
    setSchematicFile(null)
  }

  const handleSizeSpecReset = () => {
    setValue('sizeValues', createEmptyArray(15, 7))
    setValue('sizeNames', ['', '', '', '', ''])
  }

  const handleStyleColorReset = () =>
    setValue('colorValues', createEmptyArray(7, 7))

  const handleFabricReset = () =>
    setValue('fabricValues', createEmptyArray(6, 6))

  const handleAccessoryReset = () =>
    setValue('materialValues', createEmptyArray(6, 5))

  const handleSwatchReset = () => {
    setValue('swatchSet', [])
    setSwatchFiles([])
    setDeletedSwatchIds([])
  }

  useEffect(() => {
    if (instructionData) {
      reset(instructionData)
      // 초기 데이터 저장
      setInitialData(instructionData)
    }
  }, [instructionData, reset])

  return (
    <LoadingView isLoading={isLoading} fallback={<ProjectInfoFormSkeleton />}>
      <Form {...form}>
        <div className={cn('max-w-full md:max-w-[859px] w-full', className)}>
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-[6px] border-l border-r border-border-basic-1 border-b"
            defaultValue="season-style"
          >
            {/* 시즌 및 스타일 정보 섹션 */}
            <AccordionFormItem
              value="season-style"
              title={SECTION_CONFIGS['season-style'].title}
              onReset={handleSeasonStyleReset}
              onSave={handleSeasonStyleSave}
              isDirty={isSeasonStyleDirty}
              isFirstItem={true}
            >
              <div className="flex flex-col gap-[8px]">
                {SECTION_CONFIGS['season-style'].fields.map((field) => (
                  <InputField
                    key={field.name}
                    id={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    readOnly={isReadOnly}
                    maxLength={field.maxLength}
                  />
                ))}
              </div>
            </AccordionFormItem>

            {/* 도식화 이미지 섹션 */}
            <AccordionFormItem
              value="schematic"
              title={SECTION_CONFIGS.schematic.title}
              onReset={handleSchematicReset}
              onSave={handleSchematicSave}
              hasImageUpload={SECTION_CONFIGS.schematic.hasImageUpload}
              onImageUpload={handleSchematicUpload}
              imageUploadId="schematic-upload"
              isDirty={isSchematicDirty}
              maxImageCount={SECTION_CONFIGS.schematic.maxImageCount}
              currentImageCount={schematic ? 1 : 0}
            >
              <ImageUploadArea
                imageUrl={schematic ? schematic.image : null}
                onDelete={
                  isReadOnly ? undefined : (
                    () => {
                      setValue('schematic', null)
                      setSchematicFile(null)
                    }
                  )
                }
              />
            </AccordionFormItem>

            {/* 사이즈 스펙 섹션 */}
            <AccordionFormItem
              value="size-spec"
              title={SECTION_CONFIGS['size-spec'].title}
              onReset={handleSizeSpecReset}
              onSave={handleSizeSpecSave}
              isDirty={isSizeSpecDirty}
            >
              {/* 헤더 */}
              <div className="grid grid-cols-7 gap-[4px] items-center space-y-[4px]">
                <div className="typo-pre-body-5 text-grey-9 text-center">
                  Part
                </div>
                {Array.from({ length: 5 }, (_, index: number) => (
                  <div key={index}>
                    <Input
                      placeholder={isReadOnly ? '' : '사이즈 입력'}
                      size="md"
                      variant="outline-grey"
                      readOnly={isReadOnly}
                      maxLength={4}
                      value={sizeNames?.[index] || ''}
                      onChange={(e) => {
                        const currentSizeNames = sizeNames || []
                        const newSizeNames = [...currentSizeNames]
                        newSizeNames[index] = e.target.value
                        setValue('sizeNames', newSizeNames)
                      }}
                    />
                  </div>
                ))}
                <div className="typo-pre-body-5 text-grey-9 text-center">
                  편차
                </div>
              </div>
              {Array.from(
                { length: SECTION_CONFIGS['size-spec'].tableConfig.rows },
                (_, index) => (
                  <TableRow
                    key={index}
                    rowIndex={index}
                    columns={SECTION_CONFIGS['size-spec'].tableConfig.columns}
                    fieldName="sizeValues"
                    readOnly={isReadOnly}
                    getInputType={(_, colIndex) => {
                      const totalColumns =
                        SECTION_CONFIGS['size-spec'].tableConfig.columns
                      // 첫 번째 컬럼(colIndex === 0)과 마지막 컬럼(colIndex === totalColumns - 1)은 텍스트 타입
                      if (colIndex === 0 || colIndex === totalColumns - 1) {
                        return 'text'
                      }
                      // 나머지는 넘버 타입
                      return 'number'
                    }}
                    getMaxLength={(_, colIndex) => {
                      const totalColumns =
                        SECTION_CONFIGS['size-spec'].tableConfig.columns
                      if (colIndex === 0 || colIndex === totalColumns - 1) {
                        return 6
                      } else {
                        return 7
                      }
                    }}
                  />
                ),
              )}
            </AccordionFormItem>

            {/* 스타일 컬러 섹션 */}
            <AccordionFormItem
              value="style-color"
              title={SECTION_CONFIGS['style-color'].title}
              onReset={handleStyleColorReset}
              onSave={handleStyleColorSave}
              isDirty={isStyleColorDirty}
            >
              <TableHeader
                headers={SECTION_CONFIGS['style-color'].tableConfig.headers}
                className="grid-cols-7"
                sizeNames={sizeNames}
                sizeNamesIndex={0}
              />
              {Array.from(
                { length: SECTION_CONFIGS['style-color'].tableConfig.rows },
                (_, index) => (
                  <TableRow
                    key={index}
                    rowIndex={index}
                    columns={SECTION_CONFIGS['style-color'].tableConfig.columns}
                    fieldName="colorValues"
                    readOnly={isReadOnly}
                    getInputType={(_, colIndex) => {
                      if (colIndex === 0) {
                        return 'text'
                      }
                      return 'number'
                    }}
                    getMaxLength={(_, colIndex) => {
                      const totalColumns =
                        SECTION_CONFIGS['style-color'].tableConfig.columns
                      if (colIndex === 0) {
                        return 6
                      } else if (colIndex === totalColumns - 1) {
                        return 8
                      } else {
                        return 6
                      }
                    }}
                  />
                ),
              )}
            </AccordionFormItem>

            {/* 원단 상세 정보 섹션 */}
            <AccordionFormItem
              value="fabric-details"
              title={SECTION_CONFIGS['fabric-details'].title}
              onReset={handleFabricReset}
              onSave={handleFabricSave}
              isDirty={isFabricDirty}
            >
              <TableHeader
                headers={SECTION_CONFIGS['fabric-details'].tableConfig.headers}
                className="grid-cols-6"
              />
              {Array.from(
                { length: SECTION_CONFIGS['fabric-details'].tableConfig.rows },
                (_, index) => (
                  <TableRow
                    key={index}
                    rowIndex={index}
                    columns={
                      SECTION_CONFIGS['fabric-details'].tableConfig.columns
                    }
                    fieldName="fabricValues"
                    readOnly={isReadOnly}
                    getMaxLength={(_, colIndex) => {
                      if (colIndex === 0 || colIndex === 2) {
                        return 7
                      } else {
                        return 11
                      }
                    }}
                  />
                ),
              )}
            </AccordionFormItem>

            {/* 부자재 정보 섹션 */}
            <AccordionFormItem
              value="accessory-info"
              title={SECTION_CONFIGS['accessory-info'].title}
              onReset={handleAccessoryReset}
              onSave={handleAccessorySave}
              isDirty={isAccessoryDirty}
            >
              <TableHeader
                headers={SECTION_CONFIGS['accessory-info'].tableConfig.headers}
                className="grid-cols-5"
              />
              {Array.from(
                { length: SECTION_CONFIGS['accessory-info'].tableConfig.rows },
                (_, index) => (
                  <TableRow
                    key={index}
                    rowIndex={index}
                    columns={
                      SECTION_CONFIGS['accessory-info'].tableConfig.columns
                    }
                    fieldName="materialValues"
                    readOnly={isReadOnly}
                    getMaxLength={(_, colIndex) => {
                      if (colIndex === 0 || colIndex === 3) {
                        return 9
                      } else if (colIndex === 1) {
                        return 6
                      } else {
                        return 5
                      }
                    }}
                  />
                ),
              )}
            </AccordionFormItem>

            {/* SWATCH 섹션 */}
            <AccordionFormItem
              value="swatch"
              title={SECTION_CONFIGS.swatch.title}
              onReset={handleSwatchReset}
              onSave={handleSwatchSave}
              hasImageUpload={SECTION_CONFIGS.swatch.hasImageUpload}
              onImageUpload={handleSwatchUpload}
              imageUploadId="swatch-upload"
              isLastItem={true}
              isDirty={isSwatchDirty}
              maxImageCount={SECTION_CONFIGS.swatch.maxImageCount}
              currentImageCount={(swatchSet || []).length}
            >
              <EmptyView
                data={swatchSet}
                fallback={
                  <ImageUploadArea
                    icon={<SwatchesIcon className="size-[28px]" />}
                    title="스와치 이미지를 첨부해 주세요. (최대 6개까지 등록 가능)"
                    description=""
                    subDescription="지원 형식: jpg, png"
                  />
                }
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-[8px] py-[20px] px-[36px] w-full">
                  {(swatchSet || []).map((swatchItem, index: number) => (
                    <div key={index} className="flex gap-[8px] w-[132px]">
                      <div className="relative aspect-square w-[100px] h-[100px]">
                        <Image
                          unoptimized
                          src={swatchItem.image}
                          alt={`Swatch ${index + 1}`}
                          className="w-full h-full object-cover"
                          fill
                        />
                      </div>
                      {!isReadOnly && (
                        <Button
                          variant="ghost"
                          size="fit"
                          onClick={() => {
                            const currentSwatchSet = watch('swatchSet') || []

                            // 기존 ID가 있는 경우 삭제 목록에 추가
                            if (swatchItem.id !== null) {
                              setDeletedSwatchIds((prev: number[]) => [
                                ...prev,
                                swatchItem.id!,
                              ])
                            }

                            // 새로 추가된 파일인 경우 파일 목록에서도 제거
                            const newSwatchFiles = swatchFiles.filter(
                              (_: File, i: number) => i !== index,
                            )

                            const newSwatchSet = currentSwatchSet.filter(
                              (_: any, i: number) => i !== index,
                            )

                            setValue('swatchSet', newSwatchSet)
                            setSwatchFiles(newSwatchFiles)
                          }}
                          className="size-[24px]"
                        >
                          <XIcon className="size-[16px]" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </EmptyView>
            </AccordionFormItem>
          </Accordion>
        </div>
      </Form>
    </LoadingView>
  )
}
