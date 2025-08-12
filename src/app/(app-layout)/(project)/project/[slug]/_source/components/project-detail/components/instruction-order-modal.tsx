/* eslint-disable react/no-unknown-property */
import React, { useLayoutEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import generatePDF from 'react-to-pdf'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { InstructionType } from '@/generated/apis/@types/data-contracts'
import { useProjectInstructionRetrieveQuery } from '@/generated/apis/Instruction/Instruction.query'
import { DownloadSimpleIcon, XIcon } from '@/generated/icons/MyIcons'

interface InstructionOrderModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InstructionOrderModal = ({
  isOpen,
  onClose,
}: InstructionOrderModalProps) => {
  const { slug } = useParams<{ slug: string }>()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const instructionRef = useRef<HTMLDivElement>(null)
  const { data: instruction } = useProjectInstructionRetrieveQuery({
    variables: {
      projectSlug: slug,
      id: 'me',
    },
  })

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return

    if (!instructionRef.current) {
      console.error('Instruction template ref not found')
      return
    }

    console.log('Element found:', instructionRef.current)
    console.log('Element size:', {
      width: instructionRef.current.offsetWidth,
      height: instructionRef.current.offsetHeight,
      scrollWidth: instructionRef.current.scrollWidth,
      scrollHeight: instructionRef.current.scrollHeight,
    })

    setIsGeneratingPDF(true)

    try {
      // PDF 생성 전에 oklch 색상 제거
      const element = instructionRef.current
      if (element) {
        // 모든 oklch CSS 변수를 hex로 변환하는 스타일 추가
        const overrideStyle = document.createElement('style')
        overrideStyle.textContent = `
            * {
              --background: #ffffff !important;
              --foreground: #000000 !important;
              --card: #ffffff !important;
              --card-foreground: #000000 !important;
              --popover: #ffffff !important;
              --popover-foreground: #000000 !important;
              --primary: #000000 !important;
              --primary-foreground: #ffffff !important;
              --secondary: #f5f5f5 !important;
              --secondary-foreground: #000000 !important;
              --muted: #f5f5f5 !important;
              --muted-foreground: #666666 !important;
              --accent: #f5f5f5 !important;
              --accent-foreground: #000000 !important;
              --destructive: #dc2626 !important;
              --border: #e5e5e5 !important;
              --input: #e5e5e5 !important;
              --ring: #b3b3b3 !important;
              --sidebar: #ffffff !important;
              --sidebar-foreground: #000000 !important;
              --sidebar-primary: #000000 !important;
              --sidebar-primary-foreground: #ffffff !important;
              --sidebar-accent: #f5f5f5 !important;
              --sidebar-accent-foreground: #000000 !important;
              --sidebar-border: #e5e5e5 !important;
              --sidebar-ring: #b3b3b3 !important;
            }
          `
        element.appendChild(overrideStyle)
      }
      // A4 landscape 크기 계산 (297mm x 210mm)
      const a4Width = 297
      const a4Height = 210

      // 컨텐츠 크기에 맞는 스케일 계산
      const contentWidth = element.scrollWidth
      const contentHeight = element.scrollHeight

      // A4 용지에 꽉 차도록 강제 스케일 계산
      // A4 landscape: 297mm x 210mm
      const a4WidthPx = 297 * 3.779527559 // mm to px (96 DPI 기준)
      const a4HeightPx = 210 * 3.779527559

      const scaleX = a4WidthPx / contentWidth
      const scaleY = a4HeightPx / contentHeight

      // A4에 꽉 차도록 더 큰 스케일 사용
      let scale = Math.max(scaleX, scaleY)

      // 최소 스케일 보장
      scale = Math.max(scale, 1.0)
      // 최대 스케일 제한
      scale = Math.min(scale, 3.0)

      console.log('Content size:', { contentWidth, contentHeight })
      console.log('Scale X:', scaleX, 'Scale Y:', scaleY)
      console.log('Final scale:', scale)
      console.log('A4 size (mm):', { a4Width, a4Height })
      console.log('Scaled content size:', {
        scaledWidth: contentWidth * scale,
        scaledHeight: contentHeight * scale,
      })

      const options = {
        filename: `작업지시서_${instruction?.style || 'unknown'}.pdf`,
        page: {
          margin: 0,
          format: 'a4',
          orientation: 'landscape' as const,
          width: '297mm',
          height: '210mm',
        },
        canvas: {
          scale: scale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          windowWidth: contentWidth,
          windowHeight: contentHeight,
          width: contentWidth,
          height: contentHeight,
        },
        overrides: {
          pdf: {
            compress: true,
            unit: 'mm' as const,
          },
        },
      }

      console.log('Starting PDF generation with options:', options)

      // 이미지들이 모두 로드될 때까지 대기
      const images = instructionRef.current.querySelectorAll('img')
      console.log('Found images:', images.length)

      if (images.length > 0) {
        await Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete) {
                  resolve(null)
                } else {
                  img.onload = () => resolve(null)
                  img.onerror = () => resolve(null)
                }
              }),
          ),
        )
        console.log('All images loaded')
      }

      await generatePDF(instructionRef, options)
      console.log('PDF generated successfully')

      // 임시 스타일 제거
      if (element) {
        const overrideStyle = element.querySelector('style')
        if (overrideStyle) {
          overrideStyle.remove()
        }
      }
    } catch (error: any) {
      console.error('PDF generation failed:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      alert(`PDF 생성에 실패했습니다: ${error.message}`)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-none sm:rounded-[12px] w-full min-w-[1280px] sm:max-h-[800px] pb-[40px] h-full overflow-x-hidden">
        <AlertDialogHeader className="flex flex-row items-center justify-between py-[12px] pl-[20px] pr-[8px] h-fit">
          <AlertDialogTitle className="typo-pre-heading-2 text-grey-10">
            작업지시서 미리보기
          </AlertDialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2"
            >
              <DownloadSimpleIcon className="size-4" />
              {isGeneratingPDF ? 'PDF 생성 중...' : 'PDF 다운로드'}
            </Button>
            <Button variant="ghost" size="fit" onClick={onClose} asChild>
              <XIcon className="size-[40px]" />
            </Button>
          </div>
        </AlertDialogHeader>

        <div className="px-[16px] p-[20px] overflow-y-auto overflow-x-hidden">
          <InstructionTemplateShell
            ref={instructionRef}
            instruction={instruction}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function usePageScale({
  pageWidthPx,
  pageHeightPx,
}: {
  pageWidthPx: number
  pageHeightPx: number
}) {
  const outerRef = useRef<HTMLDivElement | null>(null) // 모달 내부 가로폭 측정
  const contentRef = useRef<HTMLDivElement | null>(null) // 실제 내용 높이 측정
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (!outerRef.current || !contentRef.current) return

    const update = () => {
      const outerW = outerRef.current!.clientWidth
      const contentH = contentRef.current!.scrollHeight

      const fitWidth = outerW / pageWidthPx
      const fitHeight = pageHeightPx / contentH

      const s = Math.min(1, fitWidth || 1, fitHeight || 1)
      setScale(Number.isFinite(s) && s > 0 ? s : 1)
    }

    update()
    const ro1 = new ResizeObserver(update)
    const ro2 = new ResizeObserver(update)
    ro1.observe(outerRef.current)
    ro2.observe(contentRef.current)
    return () => {
      ro1.disconnect()
      ro2.disconnect()
    }
  }, [pageWidthPx, pageHeightPx])

  return { outerRef, contentRef, scale }
}

export function useScaleToWidth(pageWidthPx: number) {
  const outerRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (!outerRef.current) return
    const update = () => {
      const w = outerRef.current!.clientWidth
      const s = Math.min(1, w / pageWidthPx || 1)
      setScale(Number.isFinite(s) && s > 0 ? s : 1)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(outerRef.current)
    return () => ro.disconnect()
  }, [pageWidthPx])

  return { outerRef, scale }
}

const mmToPx = (mm: number) => (mm / 25.4) * 96

export const PageFrame: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 29.71 × 21.01 cm = 297.1 × 210.1 mm (landscape)
  const W_MM = 297.1
  const H_MM = 210.1
  const W_PX = mmToPx(W_MM)
  const H_PX = mmToPx(H_MM)

  const { outerRef, contentRef, scale } = usePageScale({
    pageWidthPx: W_PX,
    pageHeightPx: H_PX,
  })

  const scaledHeight = H_PX * scale

  return (
    // 모달 래퍼: 가로 스크롤 금지, 세로만 허용
    <div
      ref={outerRef}
      className="w-full overflow-x-hidden overflow-y-visible relative"
    >
      {/* 세로 공간 예약 (레이아웃 참여) */}
      <div style={{ height: scaledHeight }} />

      {/* 실제 페이지 (레이아웃 비참여, 겹침 방지 위해 절대배치) */}
      <div
        className="absolute top-0 left-0 bg-white border border-black"
        style={{
          width: `${W_MM}mm`,
          height: `${H_MM}mm`,
          padding: '8mm',
          boxSizing: 'border-box',
          overflow: 'hidden', // 내부 스크롤 금지
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* 실제 콘텐츠 높이 측정용 래퍼 */}
        <div ref={contentRef}>{children}</div>
      </div>

      {/* 인쇄/PDF 저장 시 1:1 고정 */}
      <style jsx>{`
        @page {
          size: ${W_MM}mm ${H_MM}mm;
          margin: 0;
        }
        @media print {
          .absolute[style*='transform: scale'] {
            transform: none !important;
            width: ${W_MM}mm !important;
            height: ${H_MM}mm !important;
          }
        }
      `}</style>
    </div>
  )
}

/** 29.71 × 21.01 cm (297.1mm × 210.1mm) — 데이터 없는 틀만 */
const InstructionTemplateShell = React.forwardRef<
  HTMLDivElement,
  { instruction?: InstructionType }
>(({ instruction }, ref) => {
  const RIGHT_W = '68mm'
  const SWATCH_W = '108mm'
  const SIZE_COLS = 5

  return (
    <div className="flex w-full justify-center" ref={ref}>
      <div
        className="bg-white"
        style={{
          width: '100%',
          height: '876.9px', // 1240 / √2
          boxSizing: 'border-box',
          ['--rowH' as any]: '8mm',
          ['--headH' as any]: '8mm',
          ['--titleH' as any]: '9mm',
          ['--rightHeight' as any]: 'calc(23 * var(--rowH))',
          ['--bottomBodyH' as any]: 'calc(var(--headH) + (7 * var(--rowH)))',

          /* ▼ 헤더 통통 옵션 */
          ['--headFat' as any]: '12mm', // 년도/시즌 한 줄 높이
          ['--signLabelH' as any]: '7mm', // 결재 라벨 바 높이
          ['--signBoxH' as any]: '20mm', // 결재 빈칸 높이
          ['--titlePadV' as any]: '3mm', // 문서 타이틀 상/하 패딩
        }}
      >
        <div className="grid grid-rows-[auto_auto_1fr_auto] gap-0 h-full text-[10px]">
          {/* 1) 상단 헤더 (통통 ver.) */}
          <div className="grid grid-cols-[40mm_1fr_40mm] items-end">
            {/* 좌: 년도/시즌 */}
            <div className="border border-b-0 border-black">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: '16mm 1fr', // 라벨칸 약간 넓힘
                  gridTemplateRows: 'var(--headFat) var(--headFat)',
                }}
              >
                <div
                  className="border-b border-black px-2 bg-[#E2E1E0] flex items-center"
                  style={{ height: 'var(--headFat)' }}
                >
                  년도
                </div>
                <div
                  className="border-b border-l border-black flex items-center px-2"
                  style={{ height: 'var(--headFat)' }}
                >
                  {instruction?.year || ''}
                </div>

                <div
                  className="px-2 bg-[#E2E1E0] flex items-center"
                  style={{ height: 'var(--headFat)' }}
                >
                  시즌
                </div>
                <div
                  className="border-l border-black flex items-center px-2"
                  style={{ height: 'var(--headFat)' }}
                >
                  {instruction?.season || ''}
                </div>
              </div>
            </div>

            {/* 중앙 타이틀 */}
            <div className="flex items-center justify-center">
              <h1
                className="font-semibold tracking-[0.02em] text-center"
                style={{
                  fontSize: '24px', // 24 → 30
                  paddingTop: 'var(--titlePadV)',
                  paddingBottom: 'var(--titlePadV)',
                  lineHeight: 1.2,
                }}
              >
                작업지시서
              </h1>
            </div>

            {/* 우: 결재칸 */}
            <div className="justify-self-end border border-b-0 border-black">
              <div className="grid grid-cols-4">
                {['담당', '팀장', '실장', '대표'].map((h) => (
                  <div
                    key={h}
                    className="border-l first:border-l-0 border-black"
                  >
                    {/* 라벨 바 높이 업 */}
                    <div
                      className="bg-[#E2E1E0] text-center border-b border-black flex items-center justify-center"
                      style={{ height: 'var(--signLabelH)' }}
                    >
                      {h}
                    </div>
                    {/* 빈칸 높이 업 */}
                    <div style={{ height: 'var(--signBoxH)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2) 상단 바 (헤더와 본문 사이 숨 좀 쉬게) */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `calc(100% - ${RIGHT_W}) ${RIGHT_W}`,
            }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: '22mm 1fr 22mm 1fr 18mm 1fr 18mm 22mm',
              }}
            >
              <div className="bg-[#E2E1E0] px-2 border-t border-b-0 border-l border-black">
                Style #
              </div>
              <div className="border-t border-b-0 border-l border-black">
                {instruction?.style || ''}
              </div>
              <div className="bg-[#E2E1E0] px-2 border-t border-b-0 border-l border-black">
                품명
              </div>
              <div className="border-t border-b-0 border-l border-black">
                {instruction?.variant || ''}
              </div>
              <div className="bg-[#E2E1E0] px-2 border-t border-b-0 border-l border-black">
                ITEM
              </div>
              <div className="border-t border-b-0 border-l border-black">
                {instruction?.item || ''}
              </div>
              <div className="bg-[#E2E1E0] px-2 border-t border-b-0 border-l border-black">
                차수
              </div>
              <div className="border-t border-b-0 border-l border-r border-black">
                {instruction?.generation || ''}
              </div>
            </div>

            <div className="border-t border-r border-b-0 border-black px-2 bg-[#E2E1E0] text-center font-medium">
              SIZE SPEC (CM)
            </div>
          </div>

          {/* 3) 본문: 좌 도식 | 우 SIZE/COLOR/TOTAL */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `calc(100% - ${RIGHT_W}) ${RIGHT_W}`,
            }}
          >
            {/* 좌 도식 */}
            <div className="border border-black relative">
              <Image
                src={instruction?.schematic?.image || ''}
                alt="schematic"
                fill
              />
            </div>
            {/* 우 패널 */}
            <div className="border-t border-r border-b border-black">
              {/* SIZE 헤더 */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `18mm repeat(${SIZE_COLS}, 1fr) 12mm`,
                }}
              >
                <div className="bg-[#E2E1E0] border-b border-r border-black px-2 text-center font-medium">
                  PART
                </div>
                {Array.from({ length: SIZE_COLS }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#E2E1E0] border-b border-r border-black px-2"
                  >
                    {instruction?.sizeNames?.[i] || ''}
                  </div>
                ))}
                <div className="bg-[#E2E1E0] border-b border-black px-2 text-center font-medium">
                  편차
                </div>
              </div>
              {/* SIZE 15행 */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `18mm repeat(${SIZE_COLS}, 1fr) 12mm`,
                }}
              >
                {Array.from({ length: 15 }).map((_, r) => (
                  <React.Fragment key={r}>
                    <div
                      className="border-b border-r border-black bg-[#E2E1E0]"
                      style={{ height: 'var(--rowH)' }}
                    >
                      {instruction?.sizeValues?.[r]?.[0] || ''}
                    </div>
                    {Array.from({ length: 5 }).map((__, c) => (
                      <div
                        key={c}
                        className="border-b border-r border-black"
                        style={{ height: 'var(--rowH)' }}
                      >
                        {instruction?.sizeValues?.[r]?.[c + 1] || ''}
                      </div>
                    ))}
                    <div
                      className="border-b border-black"
                      style={{ height: 'var(--rowH)' }}
                    >
                      {instruction?.sizeValues?.[r]?.[6] || ''}
                    </div>
                  </React.Fragment>
                ))}
              </div>
              {/* COLOR/SIZE */}
              {/* COLOR / SIZE (2단 헤더) */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `18mm repeat(${SIZE_COLS}, 1fr) 12mm`,
                  gridTemplateRows: `var(--headH) var(--headH)`,
                }}
              >
                {/* COLOR: 좌측, 세로 2칸 병합 */}
                <div
                  className="bg-[#E2E1E0] border-b border-r border-black px-2 font-medium row-span-2 flex items-center"
                  style={{ gridRow: '1 / span 2' }}
                >
                  COLOR
                </div>

                {/* SIZE: 상단, 사이즈 칼럼 전체 병합 */}
                <div
                  className="bg-[#E2E1E0] border-b border-r border-black px-2 text-center font-medium"
                  style={{ gridColumn: `2 / span ${SIZE_COLS}` }}
                >
                  SIZE
                </div>

                {/* 수량: 우측, 세로 2칸 병합 */}
                <div
                  className="bg-[#E2E1E0] border-b border-black px-2 text-center font-medium row-span-2 flex items-center justify-center"
                  style={{ gridRow: '1 / span 0' }}
                >
                  수량
                </div>

                {/* 2행: 사이즈 개별 라벨 */}
                {Array.from({ length: SIZE_COLS }).map((_, i) => (
                  <div
                    key={i}
                    className="border-b border-r border-black text-center flex items-center justify-center"
                  >
                    {instruction?.sizeNames?.[i] || ''}
                  </div>
                ))}
              </div>
              {/* COLOR 7행 */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `18mm repeat(${SIZE_COLS}, 1fr) 12mm`,
                }}
              >
                {Array.from({ length: 7 }).map((_, r) => (
                  <React.Fragment key={r}>
                    <div
                      className="border-b border-r border-black bg-[#E2E1E0]"
                      style={{ height: 'var(--rowH)' }}
                    >
                      {instruction?.colorValues?.[r]?.[0] || ''}
                    </div>
                    {Array.from({ length: SIZE_COLS }).map((__, c) => (
                      <div
                        key={c}
                        className="border-b border-r border-black"
                        style={{ height: 'var(--rowH)' }}
                      >
                        {instruction?.colorValues?.[r]?.[c + 1] || ''}
                      </div>
                    ))}
                    <div
                      className="border-b border-black"
                      style={{ height: 'var(--rowH)' }}
                    >
                      {instruction?.colorValues?.[r]?.[6] || ''}
                    </div>
                  </React.Fragment>
                ))}
              </div>
              {/* TOTAL */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `18mm repeat(${SIZE_COLS}, 1fr) 12mm`,
                }}
              >
                <div className="bg-[#E2E1E0] border-t-0 border-r border-black px-2 font-medium">
                  TOTAL
                </div>
                {Array.from({ length: SIZE_COLS }).map((_, i) => (
                  <div key={i} className="border-t-0  border-r border-black" />
                ))}
                <div className="border-t-0 border-black" />
              </div>
            </div>
          </div>

          {/* 4) 하단 3분할 */}
          <div
            className="grid items-start"
            style={{
              gridTemplateColumns: `${SWATCH_W} calc(100% - ${SWATCH_W} - ${RIGHT_W}) ${RIGHT_W}`,
            }}
          >
            {/* 타이틀행 */}
            <div className="border-t-0 py-[4px] border-l  border-b border-black bg-[#E2E1E0] flex items-center justify-center">
              SWATCH
            </div>
            <div className="border-t-0 py-[4px] border-l border-b border-r border-black bg-[#E2E1E0] flex items-center justify-center">
              원단상세정보
            </div>
            <div className="border-t-0 py-[4px] border-r border-b border-black bg-[#E2E1E0] flex items-center justify-center">
              부자재
            </div>

            {/* 본문행 */}
            {/* SWATCH */}
            <div
              className="border-l border-b border-black box-border"
              style={{ height: 'var(--bottomBodyH)', padding: '2mm' }}
            >
              <div className="grid grid-cols-3 grid-rows-2 gap-[2mm] h-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full h-full relative">
                    {instruction?.swatchSet?.[i]?.image && (
                      <Image
                        src={instruction.swatchSet[i].image}
                        alt={`swatch ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 원단상세정보 표 (중앙) — 좌/우 외곽 보더는 래퍼가 담당 */}
            <div
              className="border-l border-r border-b border-black box-border"
              style={{ height: 'var(--bottomBodyH)' }}
            >
              <table
                className="w-full h-full table-fixed text-[10px] table-tight tight-no-last-bottom tight-no-outer-left tight-no-outer-right"
                style={{ borderCollapse: 'collapse', borderSpacing: 0 }}
              >
                <colgroup>
                  <col style={{ width: '18mm' }} />
                  <col />
                  <col style={{ width: '20mm' }} />
                  <col style={{ width: '24mm' }} />
                  <col style={{ width: '20mm' }} />
                  <col style={{ width: '20mm' }} />
                </colgroup>
                <thead>
                  <tr>
                    {['구분', '원단명', '칼라', '혼용율', '규격', '요척'].map(
                      (h) => (
                        <th
                          key={h}
                          className="p-0 text-center border-black"
                          style={{
                            height: 'var(--headH)',
                            lineHeight: 'var(--headH)',
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, r) => (
                    <tr key={r}>
                      {Array.from({ length: 6 }).map((__, c) => (
                        <td
                          key={c}
                          className="p-0 border-black"
                          style={{
                            height: 'var(--rowH)',
                            lineHeight: 'var(--rowH)',
                          }}
                        >
                          {instruction?.fabricValues?.[r]?.[c] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 부자재 표 (우측) — 우측 외곽 보더는 래퍼가 담당 */}
            <div
              className="border-b border-black box-border"
              style={{ height: 'var(--bottomBodyH)' }}
            >
              <table
                className="w-full h-full table-fixed text-[10px] table-tight tight-no-last-bottom tight-no-outer-left tight-no-outer-right"
                style={{ borderCollapse: 'collapse', borderSpacing: 0 }}
              >
                <colgroup>
                  <col style={{ width: '36%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '12%' }} />
                </colgroup>
                <thead>
                  <tr className="border-r border-black">
                    {['자재명', '규격', '칼라', '사용부위', '요척'].map((h) => (
                      <th
                        key={h}
                        className="p-0 text-center border-black"
                        style={{
                          height: 'var(--headH)',
                          lineHeight: 'var(--headH)',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, r) => (
                    <tr key={r}>
                      {Array.from({ length: 6 }).map((__, c) => (
                        <td
                          key={c}
                          className="p-0 border-black"
                          style={{
                            height: 'var(--rowH)',
                            lineHeight: 'var(--rowH)',
                          }}
                        >
                          {instruction?.materialValues?.[r]?.[c] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tight table & seam fixes */}
        <style jsx>{`
          @page {
            size: 297.1mm 210.1mm;
            margin: 0;
          }

          /* 표를 완전 타이트하게 */
          .table-tight {
            border-collapse: collapse;
            border-spacing: 0;
          }
          .table-tight th,
          .table-tight td {
            padding: 0;
            border: 1px solid #000;
            vertical-align: middle;
          }

          /* thead–tbody는 한 줄 보더만 보이게 */
          .table-tight thead th {
            border-top-width: 0;
          }
          .table-tight tbody tr:first-child td {
            border-top-width: 0;
          }

          /* 마지막 행 하단 보더 제거 → 래퍼의 border-b만 남김(하단 이중선 제거) */
          .tight-no-last-bottom tbody tr:last-child td {
            border-bottom-width: 0;
          }

          /* 중앙표는 좌/우 외곽 보더 제거(외곽은 래퍼가 그림) */
          .tight-no-outer-left th:first-child,
          .tight-no-outer-left td:first-child {
            border-left-width: 0;
          }
          .tight-no-outer-right th:last-child,
          .tight-no-outer-right td:last-child {
            border-right-width: 0;
          }
        `}</style>
      </div>
    </div>
  )
})

InstructionTemplateShell.displayName = 'InstructionTemplateShell'

export default InstructionTemplateShell
