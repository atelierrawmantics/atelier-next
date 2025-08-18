import React, { useLayoutEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import ReactDOM from 'react-dom/client'
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
import { XIcon } from '@/generated/icons/MyIcons'

interface InstructionOrderModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InstructionOrderModal = ({
  isOpen,
  onClose,
}: InstructionOrderModalProps) => {
  const { slug } = useParams<{ slug: string }>()
  const instructionRef = useRef<HTMLDivElement>(null)

  const { data: instruction } = useProjectInstructionRetrieveQuery({
    variables: {
      projectSlug: slug,
      id: 'me',
    },
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-none sm:rounded-[12px] w-full min-w-[calc(100%-80px)] md:min-w-[1280px] sm:max-h-[800px] pb-[40px] h-full">
        <AlertDialogHeader className="flex flex-row items-center justify-between py-[12px] pl-[20px] pr-[8px] h-fit border-b border-border-basic-1">
          <AlertDialogTitle className="typo-pre-heading-2 text-grey-10">
            작업지시서 미리보기
          </AlertDialogTitle>

          <Button variant="ghost" size="fit" onClick={onClose} asChild>
            <XIcon className="size-[40px]" />
          </Button>
        </AlertDialogHeader>

        <div className="px-[16px] p-[20px] overflow-y-auto overflow-x-auto">
          <InstructionTemplateShell
            ref={instructionRef}
            instruction={instruction}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// 모달 없이 PDF 다운로드하는 함수
export const downloadInstructionPDF = async ({
  instruction,
  projectName,
}: {
  instruction: InstructionType
  projectName: string
}): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // 임시 div 생성
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.width = '100%'
      tempDiv.style.height = '100%'
      tempDiv.style.overflow = 'auto'
      tempDiv.style.zIndex = '9999'
      tempDiv.style.height = '842px'
      tempDiv.style.width = '1328px'
      document.body.appendChild(tempDiv)

      // useRef와 동일한 방식으로 ref 객체 생성
      const tempRef = { current: null as HTMLDivElement | null }

      // 실제 모달과 동일한 환경에서 InstructionTemplateShell 렌더링
      const root = ReactDOM.createRoot(tempDiv)
      root.render(
        <div className="px-[16px] p-[20px] overflow-y-auto overflow-x-auto">
          <InstructionTemplateShell
            instruction={instruction}
            ref={(ref) => {
              if (ref) {
                tempRef.current = ref
                // 컴포넌트가 마운트된 후 실제 모달의 handleDownloadPDF 로직 실행
                setTimeout(async () => {
                  try {
                    const element = tempRef.current
                    if (!element) {
                      resolve(false)
                      return
                    }

                    console.log('Element found:', element)
                    console.log('Element size:', {
                      width: element.offsetWidth,
                      height: element.offsetHeight,
                      scrollWidth: element.scrollWidth,
                      scrollHeight: element.scrollHeight,
                    })

                    // 실제 모달의 handleDownloadPDF 로직과 동일하게 실행
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

                    const contentWidth = element.scrollWidth
                    const contentHeight = element.scrollHeight

                    // 실제 모달과 동일한 PDF 옵션 사용
                    const options = {
                      filename: `${projectName}_작업지시서.pdf`,
                      page: {
                        margin: 10,
                        format: 'a4',
                        orientation: 'landscape' as const,
                      },
                      canvas: {
                        scale: 1.0,
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

                    console.log(
                      'Starting PDF generation with options:',
                      options,
                    )

                    // 이미지들이 모두 로드될 때까지 대기
                    const images = element.querySelectorAll('img')
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

                    await generatePDF(tempRef, options)
                    console.log('PDF generated successfully')

                    // 임시 스타일 제거
                    if (element) {
                      const overrideStyle = element.querySelector('style')
                      if (overrideStyle) {
                        overrideStyle.remove()
                      }
                    }

                    // 임시 요소 정리
                    root.unmount()
                    document.body.removeChild(tempDiv)

                    // 성공 상태 리턴
                    resolve(true)
                  } catch (error: any) {
                    console.error('PDF generation failed:', error)
                    alert('PDF 생성에 실패했습니다: ' + error.message)

                    // 임시 요소 정리
                    root.unmount()
                    document.body.removeChild(tempDiv)

                    // 실패 상태 리턴
                    resolve(false)
                  }
                }, 100)
              } else {
                resolve(false)
              }
            }}
          />
        </div>,
      )
    } catch (error: any) {
      console.error('PDF generation failed:', error)
      alert('PDF 생성에 실패했습니다: ' + error.message)
      resolve(false)
    }
  })
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

export const PageFrame = ({ children }: { children: React.ReactNode }) => {
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
    </div>
  )
}

/** 29.71 × 21.01 cm (297.1mm × 210.1mm) — 데이터 없는 틀만 */
const InstructionTemplateShell = React.forwardRef<
  HTMLDivElement,
  { instruction?: InstructionType }
>(({ instruction }, ref) => {
  const RIGHT_W = '80mm'
  const SWATCH_W = '130mm'
  const SIZE_COLS = 5

  return (
    <div className="flex w-full h-full justify-center" ref={ref}>
      <div
        className="bg-white"
        style={{
          width: '100%', // A4 가로 크기
          height: '842px', // A4 세로 크기
          boxSizing: 'border-box',
          ['--rowH' as any]: '5.76mm', // 138mm ÷ 27행 = 5.11mm
          ['--headH' as any]: '4.79mm', // 헤더도 같은 높이
          ['--titleH' as any]: '7mm', // 타이틀 높이
          ['--rightHeight' as any]: '145mm', // 우측 패널 높이 138mm로 고정
          ['--bottomBodyH' as any]: 'calc(var(--headH) + (7 * var(--rowH)))',
          ['--schematicHeight' as any]: '145mm', // 스키마틱도 138mm로 맞춤

          /* ▼ 헤더 통통 옵션 */
          ['--headFat' as any]: '10mm', // 년도/시즌 한 줄 높이 줄임
          ['--signLabelH' as any]: '5mm', // 결재 라벨 바 높이 줄임
          ['--signBoxH' as any]: '15mm', // 결재 빈칸 높이 줄임
          ['--titlePadV' as any]: '2mm', // 문서 타이틀 상/하 패딩 줄임
          ['--infoHeaderH' as any]: '6mm', // Style#, 품명, ITEM, 차수 헤더 높이
        }}
      >
        <div className="grid grid-rows-[auto_auto_1fr_auto] gap-0 h-full text-[10px]">
          {/* 1) 상단 헤더 (통통 ver.) */}
          <div className="grid grid-cols-[40mm_1fr_40mm] items-center">
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
                  className="border-b border-black font-bold px-[2px] bg-[#E2E1E0] flex items-center justify-center"
                  style={{ height: 'var(--headFat)' }}
                >
                  년도
                </div>
                <div
                  className="border-b border-l border-black flex items-center px-[2px]"
                  style={{ height: 'var(--headFat)' }}
                >
                  {instruction?.year || ''}
                </div>

                <div
                  className="font-bold px-[2px] bg-[#E2E1E0] flex items-center justify-center"
                  style={{ height: 'var(--headFat)' }}
                >
                  시즌
                </div>
                <div
                  className="border-l border-black flex items-center px-[2px]"
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
              <div
                className="grid grid-cols-4"
                style={{ gridTemplateColumns: 'repeat(4, 14mm)' }}
              >
                {['담당', '팀장', '실장', '대표'].map((h) => (
                  <div
                    key={h}
                    className="border-l first:border-l-0 border-black"
                  >
                    {/* 라벨 바 높이 업 */}
                    <div
                      className="bg-[#E2E1E0] font-bold text-center border-b border-black flex items-center justify-center"
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
                gridTemplateColumns: '16.3mm 1fr 9.5mm 1fr 10mm 1fr 9.5mm 22mm',
              }}
            >
              <div
                className="bg-[#E2E1E0] font-bold px-[2px] border-t border-b-0 border-l border-black flex items-center justify-center"
                style={{ height: 'var(--infoHeaderH)' }}
              >
                Style #
              </div>
              <div
                className="border-t border-b-0 border-l border-black flex items-center px-[2px]"
                style={{ height: 'var(--infoHeaderH)' }}
              >
                {instruction?.style || ''}
              </div>
              <div
                className="bg-[#E2E1E0] font-bold px-[2px] border-t border-b-0 border-l border-black flex items-center justify-center"
                style={{ height: 'var(--infoHeaderH)' }}
              >
                품명
              </div>
              <div
                className="border-t border-b-0 border-l border-black flex items-center px-[2px]"
                style={{ height: 'var(--infoHeaderH)' }}
              >
                {instruction?.variant || ''}
              </div>
              <div
                className="bg-[#E2E1E0] font-bold px-[2px] border-t border-b-0 border-l border-black flex items-center justify-center"
                style={{ height: 'var(--infoHeaderH)' }}
              >
                ITEM
              </div>
              <div
                className="border-t border-b-0 border-l border-black flex items-center px-[2px]"
                style={{ height: 'var(--infoHeaderH)' }}
              >
                {instruction?.item || ''}
              </div>
              <div
                className="bg-[#E2E1E0] font-bold px-[2px] border-t border-b-0 border-l border-black flex items-center justify-center"
                style={{ height: 'var(--infoHeaderH)' }}
              >
                차수
              </div>
              <div
                className="border-t border-b-0 border-l border-r border-black flex items-center px-[2px]"
                style={{ height: 'var(--infoHeaderH)' }}
              >
                {instruction?.generation || ''}
              </div>
            </div>

            <div
              className="border-t border-r border-b-0 border-black px-[2px] bg-[#E2E1E0] text-center font-bold flex items-center justify-center"
              style={{ height: 'var(--infoHeaderH)' }}
            >
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
            <div
              className="border border-black relative"
              style={{ height: 'var(--schematicHeight)' }}
            >
              <div className="relative aspect-[3/2] max-w-full w-full h-full">
                {instruction?.schematic?.image && (
                  <Image
                    src={instruction.schematic.image}
                    alt="schematic"
                    fill
                    style={{ objectPosition: 'center' }}
                    sizes="20vw"
                    priority
                  />
                )}
              </div>
            </div>
            {/* 우 패널 */}
            <div
              className="border-t border-r border-b border-black"
              style={{ height: 'var(--rightHeight)' }}
            >
              {/* SIZE 헤더 */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `14mm repeat(${SIZE_COLS}, 1fr) 14mm`,
                }}
              >
                <div className="bg-[#E2E1E0] border-b border-r border-black px-[2px] text-center font-bold">
                  PART
                </div>
                {Array.from({ length: SIZE_COLS }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#E2E1E0] border-b border-r border-black text-center"
                  >
                    {instruction?.sizeNames?.[i] || ''}
                  </div>
                ))}
                <div className="bg-[#E2E1E0] border-b border-black px-[2px] text-center font-bold">
                  편차
                </div>
              </div>
              {/* SIZE 15행 */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `14mm repeat(${SIZE_COLS}, 1fr) 14mm`,
                }}
              >
                {Array.from({ length: 15 }).map((_, r) => (
                  <React.Fragment key={r}>
                    <div
                      className="border-b border-r border-black bg-[#E2E1E0] text-center"
                      style={{
                        height: 'var(--rowH)',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {instruction?.sizeValues?.[r]?.[0] || ''}
                    </div>
                    {Array.from({ length: 5 }).map((__, c) => (
                      <div
                        key={c}
                        className="border-b border-r border-black text-center"
                        style={{
                          height: 'var(--rowH)',
                          letterSpacing: '-0.5px',
                        }}
                      >
                        {instruction?.sizeValues?.[r]?.[c + 1] || ''}
                      </div>
                    ))}
                    <div
                      className="border-b border-black text-center"
                      style={{
                        height: 'var(--rowH)',
                        letterSpacing: '-0.5px',
                      }}
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
                  gridTemplateColumns: `14mm repeat(${SIZE_COLS}, 1fr) 14mm`,
                  gridTemplateRows: `var(--headH) var(--headH)`,
                }}
              >
                {/* COLOR: 좌측, 세로 2칸 병합 */}
                <div
                  className="bg-[#E2E1E0]  border-b border-r border-black px-[2px] font-bold flex items-center justify-center"
                  style={{ gridRow: '1 / span 2' }}
                >
                  COLOR
                </div>

                {/* SIZE: 상단, 사이즈 칼럼 전체 병합 */}
                <div
                  className="bg-[#E2E1E0] border-b border-r border-black px-[2px] text-center font-bold"
                  style={{ gridColumn: `2 / span ${SIZE_COLS}` }}
                >
                  SIZE
                </div>

                {/* 수량: 우측, 세로 2칸 병합 */}
                <div
                  className="bg-[#E2E1E0] border-b border-black px-[2px] text-center font-bold row-span-2 flex items-center justify-center"
                  style={{ gridRow: '1 / span 0' }}
                >
                  수량
                </div>

                {/* 2행: 사이즈 개별 라벨 */}
                {Array.from({ length: SIZE_COLS }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#E2E1E0] border-b border-r border-black text-center flex items-center justify-center px-[2px]"
                  >
                    {instruction?.sizeNames?.[i] || ''}
                  </div>
                ))}
              </div>
              {/* COLOR 7행 */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `14mm repeat(${SIZE_COLS}, 1fr) 14mm`,
                }}
              >
                {Array.from({ length: 7 }).map((_, r) => (
                  <React.Fragment key={r}>
                    <div
                      className="border-b border-r border-black bg-[#E2E1E0] text-center"
                      style={{
                        height: 'var(--rowH)',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {instruction?.colorValues?.[r]?.[0] || ''}
                    </div>
                    {Array.from({ length: SIZE_COLS }).map((__, c) => (
                      <div
                        key={c}
                        className="border-b border-r border-black text-center"
                        style={{
                          height: 'var(--rowH)',
                          letterSpacing: '-0.5px',
                        }}
                      >
                        {instruction?.colorValues?.[r]?.[c + 1] || ''}
                      </div>
                    ))}
                    <div
                      className="border-b border-black text-center"
                      style={{
                        height: 'var(--rowH)',
                        letterSpacing: '-0.5px',
                      }}
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
                  gridTemplateColumns: `14mm repeat(${SIZE_COLS}, 1fr) 14mm`,
                }}
              >
                <div className="bg-[#E2E1E0] border-t-0 border-r border-black px-[2px] text-center font-bold">
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
            <div className="border-t-0 py-[4px] border-l font-bold  border-b border-black bg-[#E2E1E0] flex items-center justify-center text-center">
              SWATCH
            </div>
            <div className="border-t-0 py-[4px] border-l font-bold border-b border-r border-black bg-[#E2E1E0] flex items-center justify-center text-center">
              원단상세정보
            </div>
            <div className="border-t-0 py-[4px] border-r font-bold border-b border-black bg-[#E2E1E0] flex items-center justify-center text-center">
              부자재
            </div>

            {/* 본문행 */}
            {/* SWATCH */}
            <div
              className="border-l border-b border-black box-border"
              style={{ height: 'var(--bottomBodyH)' }}
            >
              <div className="flex flex-wrap gap-[4px] h-full items-center py-[4px] pl-[4px]">
                {instruction?.swatchSet?.map((swatch) => (
                  <div
                    key={swatch.id}
                    className="relative aspect-square"
                    style={{
                      width: `calc(100% / ${instruction?.swatchSet?.length} - 4px)`,
                    }}
                  >
                    <Image
                      src={swatch.image}
                      alt={`swatch ${swatch.id}`}
                      fill
                      sizes="20vw"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 원단상세정보 표 (중앙) — 좌/우 외곽 보더는 래퍼가 담당 */}
            <div
              className="border-l border-black box-border"
              style={{ height: 'var(--bottomBodyH)' }}
            >
              <table
                className="w-full h-full table-fixed text-[10px]"
                style={{ borderCollapse: 'collapse', borderSpacing: 0 }}
              >
                <colgroup>
                  <col style={{ width: '14mm' }} />
                  <col style={{ width: '22mm' }} />
                  <col style={{ width: '14mm' }} />
                  <col style={{ width: '22mm' }} />
                  <col style={{ width: '14mm' }} />
                  <col style={{ width: '14mm' }} />
                </colgroup>
                <thead>
                  <tr>
                    {['구분', '원단명', '칼라', '혼용율', '규격', '요척'].map(
                      (h) => (
                        <th
                          key={h}
                          className="bg-[#E2E1E0] p-0 text-center border-black border-r border-b"
                          style={{
                            height: 'var(--headH)',
                            lineHeight: '1',
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
                          className="p-0 border-black border-r border-b"
                          style={{
                            height: 'var(--rowH)',
                            lineHeight: 'var(--rowH)',
                            letterSpacing: '-0.5px',
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
              className="border-black box-border"
              style={{ height: 'var(--bottomBodyH)' }}
            >
              <table
                className="w-full h-full table-fixed text-[10px] border-r"
                style={{ borderCollapse: 'collapse', borderSpacing: 0 }}
              >
                <colgroup>
                  <col style={{ width: '26%' }} />
                  <col style={{ width: '17%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '27%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <thead>
                  <tr>
                    {['자재명', '규격', '칼라', '사용부위', '요척'].map((h) => (
                      <th
                        key={h}
                        className="bg-[#E2E1E0] p-0 text-center border-black border-r border-b last:border-r-0"
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
                          className="p-0 border-black border-r border-b last:border-r-0"
                          style={{
                            height: 'var(--rowH)',
                            lineHeight: 'var(--rowH)',
                            letterSpacing: '-0.5px',
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
      </div>
    </div>
  )
})

InstructionTemplateShell.displayName = 'InstructionTemplateShell'

export default InstructionTemplateShell
