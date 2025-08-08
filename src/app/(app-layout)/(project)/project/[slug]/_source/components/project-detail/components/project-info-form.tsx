'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useProjectInstructionPartialUpdateMutation,
  useProjectInstructionRetrieveQuery,
} from '@/generated/apis/Instruction/Instruction.query'
import { useProjectRetrieveQuery } from '@/generated/apis/Project/Project.query'
import { ShirtFoldedIcon, SwatchesIcon, XIcon } from '@/generated/icons/MyIcons'
import { cn } from '@/lib/utils'

import { useProjectInfoForm } from '../hooks/use-project-info-form'

// 상수 정의
const BUTTON_STYLES =
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer'

// 재사용 가능한 아코디언 아이템 컴포넌트
interface AccordionFormItemProps {
  value: string
  title: string
  children: React.ReactNode
  onReset: () => void
  onSave: () => void
  hasImageUpload?: boolean
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void
  imageUploadId?: string
  isLastItem?: boolean
  isDirty?: boolean
  maxImageCount?: number
  currentImageCount?: number
}

const AccordionFormItem = ({
  value,
  title,
  children,
  onReset,
  onSave,
  hasImageUpload = false,
  onImageUpload,
  imageUploadId,
  isLastItem = false,
  isDirty = false,
  maxImageCount,
  currentImageCount = 0,
}: AccordionFormItemProps) => {
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReset()
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave()
  }

  const handleImageUpload = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const isImageUploadDisabled = Boolean(
    maxImageCount && currentImageCount >= maxImageCount,
  )

  return (
    <AccordionItem value={value} className="rounded-t-[6px]">
      <AccordionTrigger
        className={`h-[62px] typo-pre-body-5 text-grey-10 rounded-t-[6px] ${
          isLastItem ? 'data-[state=closed]:rounded-b-[6px]' : ''
        }`}
      >
        <div className="w-full flex justify-between items-center">
          <p>{title}</p>
          <div className="flex gap-[6px]" onClick={(e) => e.stopPropagation()}>
            {hasImageUpload && (
              <div
                className={cn(
                  BUTTON_STYLES,
                  isImageUploadDisabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                <label
                  htmlFor={imageUploadId}
                  onClick={handleImageUpload}
                  className={cn(
                    'cursor-pointer',
                    isImageUploadDisabled && 'cursor-not-allowed',
                  )}
                >
                  이미지 첨부
                  <input
                    id={imageUploadId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageUpload}
                    disabled={isImageUploadDisabled}
                  />
                </label>
              </div>
            )}
            <div
              className={cn(
                BUTTON_STYLES,
                !isDirty && 'opacity-50 cursor-not-allowed',
              )}
              onClick={isDirty ? handleReset : undefined}
            >
              초기화
            </div>
            <div className={BUTTON_STYLES} onClick={handleSave}>
              저장
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={cn(
          isLastItem ? 'data-[state=open]:rounded-b-[6px]' : '',
          'p-[20px]',
        )}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

// 이미지 업로드 영역 컴포넌트
interface ImageUploadAreaProps {
  imageFile?: File | null
  onDelete?: () => void
}

const ImageUploadArea = ({ imageFile, onDelete }: ImageUploadAreaProps) => {
  return (
    <div className="w-full">
      {imageFile ?
        <div className="w-full flex justify-center">
          <div className="relative w-[400px] h-[233px] flex items-center justify-center overflow-hidden">
            <Image
              unoptimized
              src={URL.createObjectURL(imageFile)}
              alt="Uploaded image"
              className="w-full h-full object-cover"
              fill
            />
            {onDelete && (
              <Button
                variant="ghost"
                size="fit"
                onClick={onDelete}
                className="absolute top-0 right-0"
              >
                <XIcon className="size-[32px]" />
              </Button>
            )}
          </div>
        </div>
      : <div className="w-full flex flex-col items-center justify-center gap-[12px] py-[40px]">
          <div className="size-[56px] rounded-full bg-secondary-2 flex items-center justify-center">
            <ShirtFoldedIcon className="size-[28px]" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="typo-pre-body-5 text-grey-9">
              도식화는 AI로 생성하거나 직접 이미지를 첨부할 수 있습니다. (최대
              1개까지 등록 가능)
            </p>
            <p className="typo-body-6 text-grey-8">
              AI 도식화를 생성하려면 상단의 [AI 도식화 도우미] 탭을 이용해
              주세요.
            </p>
            <p className="typo-pre-caption-2 text-grey-7 mt-[8px]">
              지원 형식: jpg, png
            </p>
          </div>
        </div>
      }
    </div>
  )
}

// 입력 필드 컴포넌트
interface InputFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

interface InputGridProps {
  fields: InputFieldProps[]
}

const InputGrid = ({ fields }: InputGridProps) => {
  return (
    <div className={`flex flex-col gap-[8px]`}>
      {fields.map((field) => (
        <div key={field.id} className="flex gap-[55px]">
          <Label
            htmlFor={field.id}
            className="w-[60px] typo-pre-caption-1 text-grey-9"
          >
            {field.label}
          </Label>
          <Input
            id={field.id}
            placeholder={field.placeholder}
            size="md"
            variant="outline-grey"
            className="w-full"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}

// 재사용 가능한 테이블 컴포넌트
interface TableRowProps {
  part?: string
  sizes?: string[]
  deviation?: string
  onPartChange?: (value: string) => void
  onSizeChange?: (index: number, value: string) => void
  onDeviationChange?: (value: string) => void
}

const TableRow = ({
  part,
  sizes = [],
  deviation,
  onPartChange,
  onSizeChange,
  onDeviationChange,
}: TableRowProps) => {
  return (
    <div className="grid grid-cols-7 gap-[4px] space-y-[4px]">
      <div>
        <Input
          size="md"
          value={part || ''}
          onChange={(e) => onPartChange?.(e.target.value)}
        />
      </div>
      {sizes.map((size, index) => (
        <div key={index}>
          <Input
            size="md"
            value={size}
            onChange={(e) => onSizeChange?.(index, e.target.value)}
          />
        </div>
      ))}
      <div>
        <Input
          size="md"
          value={deviation || ''}
          onChange={(e) => onDeviationChange?.(e.target.value)}
        />
      </div>
    </div>
  )
}

// 컬러 테이블 컴포넌트
interface ColorTableRowProps {
  color?: string
  sizes?: { xs: string; s: string; m: string; l: string; xl: string }
  quantity?: string
  onColorChange?: (value: string) => void
  onSizeChange?: (size: 'xs' | 's' | 'm' | 'l' | 'xl', value: string) => void
  onQuantityChange?: (value: string) => void
}

const ColorTableRow = ({
  color,
  sizes = { xs: '', s: '', m: '', l: '', xl: '' },
  quantity,
  onColorChange,
  onSizeChange,
  onQuantityChange,
}: ColorTableRowProps) => {
  return (
    <div className="grid grid-cols-7 gap-[4px] space-y-[4px]">
      <Input
        size="md"
        value={color || ''}
        onChange={(e) => onColorChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={sizes.xs}
        onChange={(e) => onSizeChange?.('xs', e.target.value)}
      />
      <Input
        size="md"
        value={sizes.s}
        onChange={(e) => onSizeChange?.('s', e.target.value)}
      />
      <Input
        size="md"
        value={sizes.m}
        onChange={(e) => onSizeChange?.('m', e.target.value)}
      />
      <Input
        size="md"
        value={sizes.l}
        onChange={(e) => onSizeChange?.('l', e.target.value)}
      />
      <Input
        size="md"
        value={sizes.xl}
        onChange={(e) => onSizeChange?.('xl', e.target.value)}
      />
      <Input
        size="md"
        value={quantity || ''}
        onChange={(e) => onQuantityChange?.(e.target.value)}
      />
    </div>
  )
}

// 원단 테이블 컴포넌트
interface FabricTableRowProps {
  category?: string
  fabricName?: string
  color?: string
  blendRatio?: string
  standard?: string
  consumption?: string
  onCategoryChange?: (value: string) => void
  onFabricNameChange?: (value: string) => void
  onColorChange?: (value: string) => void
  onBlendRatioChange?: (value: string) => void
  onStandardChange?: (value: string) => void
  onConsumptionChange?: (value: string) => void
}

const FabricTableRow = ({
  category,
  fabricName,
  color,
  blendRatio,
  standard,
  consumption,
  onCategoryChange,
  onFabricNameChange,
  onColorChange,
  onBlendRatioChange,
  onStandardChange,
  onConsumptionChange,
}: FabricTableRowProps) => {
  return (
    <div className="grid grid-cols-6 gap-[4px] space-y-[4px]">
      <Input
        size="md"
        value={category || ''}
        onChange={(e) => onCategoryChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={fabricName || ''}
        onChange={(e) => onFabricNameChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={color || ''}
        onChange={(e) => onColorChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={blendRatio || ''}
        onChange={(e) => onBlendRatioChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={standard || ''}
        onChange={(e) => onStandardChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={consumption || ''}
        onChange={(e) => onConsumptionChange?.(e.target.value)}
      />
    </div>
  )
}

// 부자재 테이블 컴포넌트
interface AccessoryTableRowProps {
  materialName?: string
  standard?: string
  color?: string
  usageArea?: string
  consumption?: string
  onMaterialNameChange?: (value: string) => void
  onStandardChange?: (value: string) => void
  onColorChange?: (value: string) => void
  onUsageAreaChange?: (value: string) => void
  onConsumptionChange?: (value: string) => void
}

const AccessoryTableRow = ({
  materialName,
  standard,
  color,
  usageArea,
  consumption,
  onMaterialNameChange,
  onStandardChange,
  onColorChange,
  onUsageAreaChange,
  onConsumptionChange,
}: AccessoryTableRowProps) => {
  return (
    <div className="grid grid-cols-5 gap-[4px] space-y-[4px]">
      <Input
        size="md"
        value={materialName || ''}
        onChange={(e) => onMaterialNameChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={standard || ''}
        onChange={(e) => onStandardChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={color || ''}
        onChange={(e) => onColorChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={usageArea || ''}
        onChange={(e) => onUsageAreaChange?.(e.target.value)}
      />
      <Input
        size="md"
        value={consumption || ''}
        onChange={(e) => onConsumptionChange?.(e.target.value)}
      />
    </div>
  )
}

export const ProjectInfoForm = () => {
  const form = useProjectInfoForm()
  const { watch, setValue, reset } = form

  const { slug } = useParams<{ slug: string }>()
  const { data: projectData } = useProjectRetrieveQuery({
    variables: {
      slug,
    },
    options: {
      enabled: !!slug,
    },
  })

  const { data: instructionData } = useProjectInstructionRetrieveQuery({
    variables: {
      projectSlug: slug,
      id: 'me',
    },
    options: {
      enabled: !!slug,
    },
  })

  const { mutate: updateInstruction } =
    useProjectInstructionPartialUpdateMutation({})

  console.log({ instructionData })

  // instructionData가 로드되면 폼을 리셋
  useEffect(() => {
    if (instructionData) {
      const apiFormData = transformApiToFormData(instructionData)
      reset(apiFormData)
    }
  }, [instructionData, reset])

  // 순수 함수: 배열 생성
  const createEmptyArray = (rows: number, cols: number) => {
    return Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(''))
  }

  // 각 섹션별 isDirty 상태 계산
  const isSeasonStyleDirty = () => {
    const values = watch([
      'year',
      'season',
      'style',
      'variant',
      'item',
      'generation',
    ])
    return values.some((value) => value && value.trim() !== '')
  }

  const isSchematicDirty = () => {
    return Boolean(watch('schematic'))
  }

  const isSizeSpecDirty = () => {
    const sizeValues = watch('sizeValues') || []
    const sizeNames = watch('sizeNames')?.[0] || []

    // sizeValues에서 값이 있는지 확인 (Part, 편차 제외한 중간 5개 컬럼)
    const hasSizeValues = sizeValues.some((row) =>
      row.slice(1, 6).some((cell) => cell && cell.trim() !== ''),
    )

    // sizeNames에서 값이 있는지 확인 (Part, 편차 제외한 중간 5개 컬럼)
    const hasSizeNames = sizeNames
      .slice(1, 6)
      .some((name) => name && name.trim() !== '')

    return hasSizeValues || hasSizeNames
  }

  const isStyleColorDirty = () => {
    const colorValues = watch('colorValues') || []
    return colorValues.some((row) =>
      row.some((cell) => cell && cell.trim() !== ''),
    )
  }

  const isFabricDirty = () => {
    const fabricValues = watch('fabricValues') || []
    return fabricValues.some((row) =>
      row.some((cell) => cell && cell.trim() !== ''),
    )
  }

  const isAccessoryDirty = () => {
    const materialValues = watch('materialValues') || []
    return materialValues.some((row) =>
      row.some((cell) => cell && cell.trim() !== ''),
    )
  }

  const isSwatchDirty = () => {
    return (watch('swatchSet') || []).length > 0
  }

  // 공통 배열 변경 핸들러 생성 함수
  const createArrayChangeHandler = (
    fieldName: 'fabricValues' | 'materialValues' | 'sizeValues' | 'colorValues',
    rowIndex: number,
    colIndex: number,
  ) => {
    return (value: string) => {
      const currentValues = watch(fieldName) || []
      const newValues = [...currentValues]
      if (!newValues[rowIndex]) {
        const colCount =
          fieldName === 'fabricValues' ? 6
          : fieldName === 'materialValues' ? 5
          : 7
        newValues[rowIndex] = Array(colCount).fill('')
      }
      newValues[rowIndex][colIndex] = value
      setValue(fieldName, newValues)
    }
  }

  // 이미지 업로드 핸들러들
  const handleSchematicUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('schematic', file)
    }
    // 파일 입력 리셋
    event.target.value = ''
  }

  const handleSwatchUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const currentSwatchSet = watch('swatchSet') || []
    if (files.length > 0 && currentSwatchSet.length < 6) {
      setValue('swatchSet', [
        ...currentSwatchSet,
        ...files.slice(0, 6 - currentSwatchSet.length),
      ])
    }
    // 파일 입력 리셋
    event.target.value = ''
  }

  // 개별 섹션 저장 핸들러들
  const createSaveHandler = (sectionName: string, dataExtractor: () => any) => {
    return () => {
      const currentFormData = watch() // 현재 폼의 모든 데이터
      const sectionData = dataExtractor() // 해당 섹션의 데이터
      console.log(`${sectionName} 저장:`, sectionData)

      // 실제 데이터가 있는지 확인하는 함수
      const hasActualData = (data: any): boolean => {
        if (typeof data === 'string') {
          return data.trim() !== ''
        }
        if (Array.isArray(data)) {
          return data.some((item) => hasActualData(item))
        }
        return false
      }

      // 현재 폼 데이터에서 실제 입력된 데이터가 있는지 확인
      const hasUserInput =
        hasActualData(currentFormData.year) ||
        hasActualData(currentFormData.season) ||
        hasActualData(currentFormData.style) ||
        hasActualData(currentFormData.variant) ||
        hasActualData(currentFormData.item) ||
        hasActualData(currentFormData.generation) ||
        hasActualData(currentFormData.sizeValues) ||
        hasActualData(currentFormData.colorValues) ||
        hasActualData(currentFormData.fabricValues) ||
        hasActualData(currentFormData.materialValues)

      // 실제 데이터가 없으면 API 호출하지 않음
      if (!hasUserInput) {
        console.log('저장할 데이터가 없습니다.')
        return
      }

      // 현재 폼 데이터를 그대로 API에 전송
      const updateData = transformFormToApiData(currentFormData)

      updateInstruction({
        projectSlug: slug,
        id: 'me',
        data: updateData,
      })
    }
  }

  const handleSeasonStyleSave = createSaveHandler(
    '시즌 및 스타일 정보',
    () => ({
      year: watch('year'),
      season: watch('season'),
      style: watch('style'),
      variant: watch('variant'),
      item: watch('item'),
      generation: watch('generation'),
    }),
  )

  const handleSchematicSave = createSaveHandler('도식화 이미지', () => ({
    schematic: watch('schematic'),
  }))

  const handleSizeSpecSave = createSaveHandler('사이즈 스펙', () => {
    const data = watch()
    const sizeNames = data.sizeNames?.[0] || []
    const actualSizeNames = sizeNames.slice(1, 6) // UI용 제목 제외
    return {
      sizeNames: actualSizeNames,
      sizeValues: data.sizeValues,
    }
  })

  const handleStyleColorSave = createSaveHandler('스타일 컬러', () => {
    const data = watch()
    const sizeNames = data.sizeNames?.[1] || []
    const actualSizeNames = sizeNames.slice(1, 6) // UI용 제목 제외
    return {
      sizeNames: actualSizeNames,
      colorValues: data.colorValues,
    }
  })

  const handleFabricSave = createSaveHandler('원단 상세 정보', () => {
    const data = watch()
    return {
      sizeNames: data.sizeNames?.[2] || [],
      fabricValues: data.fabricValues,
    }
  })

  const handleAccessorySave = createSaveHandler('부자재 정보', () => {
    const data = watch()
    return {
      sizeNames: data.sizeNames?.[3] || [],
      materialValues: data.materialValues,
    }
  })

  const handleSwatchSave = createSaveHandler('SWATCH', () => ({
    swatchSet: watch('swatchSet'),
  }))

  const handleSeasonStyleReset = () => {
    setValue('year', '')
    setValue('season', '')
    setValue('style', '')
    setValue('variant', '')
    setValue('item', '')
    setValue('generation', '')
  }

  const handleSchematicReset = () => setValue('schematic', null)

  const handleSizeSpecReset = () => {
    setValue('sizeValues', createEmptyArray(15, 7))
    // sizeNames의 첫 번째 배열도 초기화 (Part, 편차 제외)
    const currentSizeNames = watch('sizeNames') || []
    const newSizeNames = [...currentSizeNames]
    if (newSizeNames[0]) {
      newSizeNames[0] = ['', '', '', '', ''] // Part, 편차 제외한 5개 사이즈네임만
      setValue('sizeNames', newSizeNames)
    }
  }

  const handleStyleColorReset = () =>
    setValue('colorValues', createEmptyArray(5, 7))

  const handleFabricReset = () =>
    setValue('fabricValues', createEmptyArray(6, 6))

  const handleAccessoryReset = () =>
    setValue('materialValues', createEmptyArray(5, 5))

  const handleSwatchReset = () => setValue('swatchSet', [])

  // 입력 필드 데이터 정의
  const seasonStyleFields: InputFieldProps[] = [
    {
      id: 'year',
      label: '년도',
      placeholder: '년도를 입력해 주세요',
      value: watch('year') || '',
      onChange: (value) => setValue('year', value),
    },
    {
      id: 'season',
      label: '시즌',
      placeholder: '시즌명을 입력해 주세요',
      value: watch('season') || '',
      onChange: (value) => setValue('season', value),
    },
    {
      id: 'style',
      label: '스타일',
      placeholder: '스타일을 입력해 주세요',
      value: watch('style') || '',
      onChange: (value) => setValue('style', value),
    },
    {
      id: 'variant',
      label: '품명',
      placeholder: '품명을 입력해 주세요',
      value: watch('variant') || '',
      onChange: (value) => setValue('variant', value),
    },
    {
      id: 'item',
      label: '아이템',
      placeholder: '아이템을 입력해 주세요',
      value: watch('item') || '',
      onChange: (value) => setValue('item', value),
    },
    {
      id: 'generation',
      label: '차수',
      placeholder: '차수를 입력해 주세요',
      value: watch('generation') || '',
      onChange: (value) => setValue('generation', value),
    },
  ]

  // API 데이터를 폼 데이터로 변환하는 함수
  const transformApiToFormData = (instructionData: any) => {
    if (!instructionData)
      return {
        year: '',
        season: '',
        style: '',
        variant: '',
        item: '',
        generation: '',
        schematic: null,
        sizeNames: [[], [], [], [], []],
        sizeValues: Array(15)
          .fill(null)
          .map(() => Array(7).fill('')),
        colorValues: Array(6)
          .fill(null)
          .map(() => Array(7).fill('')),
        fabricValues: Array(6)
          .fill(null)
          .map(() => Array(6).fill('')),
        materialValues: Array(6)
          .fill(null)
          .map(() => Array(5).fill('')),
        swatchSet: [],
      }

    // sizeNames 변환: [["1"], ["2"], [], ["4"], ["5"]] → [["1", "2", "", "4", "5"], [], [], [], []]
    const transformSizeNames = (apiSizeNames: any[]) => {
      if (!Array.isArray(apiSizeNames) || apiSizeNames.length === 0) {
        return [[], [], [], [], []]
      }

      const formSizeNames: any[][] = [[], [], [], [], []]
      formSizeNames[0] = ['', '', '', '', '']

      apiSizeNames.forEach((sizeNameArray, index) => {
        if (
          Array.isArray(sizeNameArray) &&
          sizeNameArray.length > 0 &&
          index < 5
        ) {
          formSizeNames[0][index] = sizeNameArray[0] || ''
        }
      })

      return formSizeNames
    }

    return {
      year: instructionData.year || '',
      season: instructionData.season || '',
      style: instructionData.style || '',
      variant: instructionData.variant || '',
      item: instructionData.item || '',
      generation: instructionData.generation || '',
      schematic: null,
      sizeNames: transformSizeNames(instructionData.sizeNames),
      sizeValues: instructionData.sizeValues,
      colorValues: instructionData.colorValues,
      fabricValues: instructionData.fabricValues,
      materialValues: instructionData.materialValues,
      swatchSet: [],
    }
  }

  // 폼 데이터를 API 데이터로 변환하는 함수
  const transformFormToApiData = (currentFormData: any) => {
    // sizeNames 변환: [["1", "2", "", "4", "5"], [], [], [], []] → [["1"], ["2"], [], ["4"], ["5"]]
    const transformSizeNames = (formSizeNames: any[]) => {
      if (!Array.isArray(formSizeNames) || formSizeNames.length === 0) {
        return [[], [], [], [], []]
      }

      const firstArray = formSizeNames[0]
      if (!Array.isArray(firstArray)) {
        return [[], [], [], [], []]
      }

      const result = []
      for (let i = 0; i < 5; i++) {
        const value = firstArray[i]
        if (value && value !== null && value !== undefined && value !== '') {
          result.push([value])
        } else {
          result.push([])
        }
      }

      return result
    }

    return {
      year: currentFormData.year || '',
      season: currentFormData.season || '',
      style: currentFormData.style || '',
      variant: currentFormData.variant || '',
      item: currentFormData.item || '',
      generation: currentFormData.generation || '',
      schematic: null,
      sizeNames: transformSizeNames(currentFormData.sizeNames),
      sizeValues: currentFormData.sizeValues,
      colorValues: currentFormData.colorValues,
      fabricValues: currentFormData.fabricValues,
      materialValues: currentFormData.materialValues,
      swatchSet: [],
    }
  }

  return (
    <Form {...form}>
      <div className="max-w-full md:max-w-[859px] w-full pb-[80px]">
        <Accordion
          type="single"
          collapsible
          className="w-full rounded-[6px] border-l border-r border-border-basic-1 border-b"
          defaultValue="season-style"
        >
          {/* 시즌 및 스타일 정보 섹션 */}
          <AccordionFormItem
            value="season-style"
            title="시즌 및 스타일 정보"
            onReset={handleSeasonStyleReset}
            onSave={handleSeasonStyleSave}
            isDirty={isSeasonStyleDirty()}
          >
            <InputGrid fields={seasonStyleFields} />
          </AccordionFormItem>

          {/* 도식화 이미지 섹션 */}
          <AccordionFormItem
            value="schematic"
            title="도식화 이미지"
            onReset={handleSchematicReset}
            onSave={handleSchematicSave}
            hasImageUpload={true}
            onImageUpload={handleSchematicUpload}
            imageUploadId="schematic-upload"
            isDirty={isSchematicDirty()}
            maxImageCount={1}
            currentImageCount={watch('schematic') ? 1 : 0}
          >
            <ImageUploadArea
              imageFile={watch('schematic')}
              onDelete={() => setValue('schematic', null)}
            />
          </AccordionFormItem>

          {/* 사이즈 스펙 섹션 */}
          <AccordionFormItem
            value="size-spec"
            title="사이즈 스펙 (SIZE SPEC)"
            onReset={handleSizeSpecReset}
            onSave={handleSizeSpecSave}
            isDirty={isSizeSpecDirty()}
          >
            {/* 헤더 */}
            <div className="grid grid-cols-7 gap-[4px] items-center space-y-[4px]">
              <div className="typo-pre-body-5 text-grey-9 text-center">
                Part
              </div>
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index}>
                  <Input
                    placeholder="사이즈 입력"
                    size="md"
                    variant="outline-grey"
                    value={watch('sizeNames')?.[0]?.[index] || ''}
                    onChange={(e) => {
                      const sizeNames = watch('sizeNames') || []
                      const newSizeNames = [...sizeNames]
                      if (!newSizeNames[0]) newSizeNames[0] = Array(5).fill('')
                      newSizeNames[0][index] = e.target.value
                      setValue('sizeNames', newSizeNames)
                    }}
                  />
                </div>
              ))}
              <div className="typo-pre-body-5 text-grey-9 text-center">
                편차
              </div>
            </div>
            {/* 데이터 행들 */}
            {(watch('sizeValues') || Array(15).fill(Array(7).fill(''))).map(
              (row, index) => (
                <TableRow
                  key={index}
                  part={row[0]}
                  sizes={row.slice(1, 6)}
                  deviation={row[6]}
                  onPartChange={createArrayChangeHandler(
                    'sizeValues',
                    index,
                    0,
                  )}
                  onSizeChange={(sizeIndex, value) => {
                    createArrayChangeHandler(
                      'sizeValues',
                      index,
                      sizeIndex + 1,
                    )(value)
                  }}
                  onDeviationChange={createArrayChangeHandler(
                    'sizeValues',
                    index,
                    6,
                  )}
                />
              ),
            )}
          </AccordionFormItem>

          {/* 스타일 컬러 섹션 */}
          <AccordionFormItem
            value="style-color"
            title="스타일 컬러 (STYLE COLOR)"
            onReset={handleStyleColorReset}
            onSave={handleStyleColorSave}
            isDirty={isStyleColorDirty()}
          >
            {/* 헤더 */}
            <div className="grid grid-cols-7 gap-[4px] items-center text-center typo-pre-body-5 text-grey-9">
              <div>Color</div>
              <div>XS</div>
              <div>S</div>
              <div>M</div>
              <div>L</div>
              <div>XL</div>
              <div>수량</div>
            </div>
            {/* 데이터 행들 */}
            {(watch('colorValues') || Array(5).fill(Array(7).fill(''))).map(
              (row, index) => (
                <ColorTableRow
                  key={index}
                  color={row[0]}
                  sizes={{
                    xs: row[1],
                    s: row[2],
                    m: row[3],
                    l: row[4],
                    xl: row[5],
                  }}
                  quantity={row[6]}
                  onColorChange={createArrayChangeHandler(
                    'colorValues',
                    index,
                    0,
                  )}
                  onSizeChange={(size, value) => {
                    const sizeIndex = { xs: 1, s: 2, m: 3, l: 4, xl: 5 }[size]
                    createArrayChangeHandler(
                      'colorValues',
                      index,
                      sizeIndex,
                    )(value)
                  }}
                  onQuantityChange={createArrayChangeHandler(
                    'colorValues',
                    index,
                    6,
                  )}
                />
              ),
            )}
          </AccordionFormItem>

          {/* 원단 상세 정보 섹션 */}
          <AccordionFormItem
            value="fabric-details"
            title="원단 상세 정보"
            onReset={handleFabricReset}
            onSave={handleFabricSave}
            isDirty={isFabricDirty()}
          >
            {/* 헤더 */}
            <div className="grid grid-cols-6 gap-[4px] space-y-[4px]">
              {['구분', '원단명', '컬러', '혼용율', '규격', '요척'].map(
                (header, index) => (
                  <div
                    key={index}
                    className="typo-pre-body-5 text-grey-9 text-center"
                  >
                    {header}
                  </div>
                ),
              )}
            </div>
            {/* 데이터 행들 */}
            {(watch('fabricValues') || Array(6).fill(Array(6).fill(''))).map(
              (row, index) => (
                <FabricTableRow
                  key={index}
                  category={row[0]}
                  fabricName={row[1]}
                  color={row[2]}
                  blendRatio={row[3]}
                  standard={row[4]}
                  consumption={row[5]}
                  onCategoryChange={createArrayChangeHandler(
                    'fabricValues',
                    index,
                    0,
                  )}
                  onFabricNameChange={createArrayChangeHandler(
                    'fabricValues',
                    index,
                    1,
                  )}
                  onColorChange={createArrayChangeHandler(
                    'fabricValues',
                    index,
                    2,
                  )}
                  onBlendRatioChange={createArrayChangeHandler(
                    'fabricValues',
                    index,
                    3,
                  )}
                  onStandardChange={createArrayChangeHandler(
                    'fabricValues',
                    index,
                    4,
                  )}
                  onConsumptionChange={createArrayChangeHandler(
                    'fabricValues',
                    index,
                    5,
                  )}
                />
              ),
            )}
          </AccordionFormItem>

          {/* 부자재 정보 섹션 */}
          <AccordionFormItem
            value="accessory-info"
            title="부자재 정보"
            onReset={handleAccessoryReset}
            onSave={handleAccessorySave}
            isDirty={isAccessoryDirty()}
          >
            {/* 헤더 */}
            <div className="grid grid-cols-5 gap-[4px] space-y-[4px]">
              {['자재명', '규격', '컬러', '사용부위', '요척'].map(
                (header, index) => (
                  <div
                    key={index}
                    className="typo-pre-body-5 text-grey-9 text-center"
                  >
                    {header}
                  </div>
                ),
              )}
            </div>
            {/* 데이터 행들 */}
            {(watch('materialValues') || Array(5).fill(Array(5).fill(''))).map(
              (row, index) => (
                <AccessoryTableRow
                  key={index}
                  materialName={row[0]}
                  standard={row[1]}
                  color={row[2]}
                  usageArea={row[3]}
                  consumption={row[4]}
                  onMaterialNameChange={createArrayChangeHandler(
                    'materialValues',
                    index,
                    0,
                  )}
                  onStandardChange={createArrayChangeHandler(
                    'materialValues',
                    index,
                    1,
                  )}
                  onColorChange={createArrayChangeHandler(
                    'materialValues',
                    index,
                    2,
                  )}
                  onUsageAreaChange={createArrayChangeHandler(
                    'materialValues',
                    index,
                    3,
                  )}
                  onConsumptionChange={createArrayChangeHandler(
                    'materialValues',
                    index,
                    4,
                  )}
                />
              ),
            )}
          </AccordionFormItem>

          {/* SWATCH 섹션 */}
          <AccordionFormItem
            value="swatch"
            title="SWATCH"
            onReset={handleSwatchReset}
            onSave={handleSwatchSave}
            hasImageUpload={true}
            onImageUpload={handleSwatchUpload}
            imageUploadId="swatch-upload"
            isLastItem={true}
            isDirty={isSwatchDirty()}
            maxImageCount={6}
            currentImageCount={(watch('swatchSet') || []).length}
          >
            {(watch('swatchSet') || []).length > 0 ?
              <div className="grid grid-cols-6 space-x-[8px] py-[20px] px-[36px]">
                {(watch('swatchSet') || []).map((file, index) => (
                  <div key={index} className="relative w-[100px] h-[100px]">
                    <Image
                      unoptimized
                      src={URL.createObjectURL(file)}
                      alt={`Swatch ${index + 1}`}
                      className="w-full h-full object-cover"
                      fill
                    />
                    <Button
                      variant="ghost"
                      size="fit"
                      onClick={() => {
                        const currentSwatchSet = watch('swatchSet') || []
                        const newSwatchSet = currentSwatchSet.filter(
                          (_, i) => i !== index,
                        )
                        setValue('swatchSet', newSwatchSet)
                      }}
                      className="absolute top-0 right-0 p-0 w-[20px] h-[20px] min-w-0"
                    >
                      <XIcon className="size-[16px]" />
                    </Button>
                  </div>
                ))}
              </div>
            : <div className="w-full flex flex-col items-center justify-center gap-[12px] py-[40px]">
                <div className="size-[56px] rounded-full bg-secondary-2 flex items-center justify-center">
                  <SwatchesIcon className="size-[28px]" />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="typo-pre-body-5 text-grey-9">
                    스와치 이미지를 첨부해 주세요. (최대 6개까지 등록 가능)
                  </p>
                  <p className="typo-pre-caption-2 text-grey-7 mt-[8px]">
                    지원 형식: jpg, png
                  </p>
                </div>
              </div>
            }
          </AccordionFormItem>
        </Accordion>
      </div>
    </Form>
  )
}
