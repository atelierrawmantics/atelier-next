import { useMemo } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'
import { EmptyView, LoadingView } from '@toktokhan-dev/react-universal'

import dayjs from 'dayjs'
import { CheckIcon, DownloadIcon } from 'lucide-react'

import { InfinityContent } from '@/components/infinite-content'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { SchematicType } from '@/generated/apis/@types/data-contracts'
import { QUERY_KEY_PROJECT_API } from '@/generated/apis/Project/Project.query'
import {
  QUERY_KEY_SCHEMATIC_API,
  useProjectSchematicDestroyMutation,
  useProjectSchematicListInfiniteQuery,
  useProjectSchematicUseCreateMutation,
} from '@/generated/apis/Schematic/Schematic.query'
import {
  ArticleIcon,
  DotsThreeIcon,
  MagicWandIcon,
  TrashIcon,
  XIcon,
} from '@/generated/icons/MyIcons'
import { useDrawerAutoClose } from '@/hooks/use-drawer-auto-close'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

export const EmptySchematicHistory = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-[12px]">
      <div className="flex flex-col items-center justify-center bg-secondary-2 size-[56px] rounded-full">
        <MagicWandIcon className="size-[28px]" />
      </div>
      <div className="text-center">
        <p className="typo-pre-body-5 text-grey-9">생성된 이미지가 없습니다.</p>
        <p className="typo-pre-body-6 text-grey-8">-</p>
      </div>
    </div>
  )
}

export const SkeletonSchematicHistory = () => {
  return (
    <div className="flex flex-col gap-[12px]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

const DROPDOWN_MENU_CLASSNAME = {
  ITEM: 'flex gap-[10px] items-center px-[12px] py-[10px] bg-grey-0 focus:bg-secondary-2',
  TEXT: 'typo-pre-body-3 text-grey-9',
  ICON: 'text-primary-3 size-[20px]',
}

interface HistoryItemDropDownMenuProps {
  id: number
  image: string
  isDelete?: boolean
}

export const HistoryItemDropDownMenu = ({
  id,
  image,
  isDelete = true,
}: HistoryItemDropDownMenuProps) => {
  const { slug } = useParams<{ slug: string }>()
  const queryClient = useQueryClient()

  const { mutate: schematicUseCreate } = useProjectSchematicUseCreateMutation(
    {},
  )

  const { mutate: schematicDestroy } = useProjectSchematicDestroyMutation({})

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="z-1 absolute top-0 right-0">
        <Button variant="ghost" size="fit" type="button">
          <DotsThreeIcon className="bg-white size-[32px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[180px] z-100 rounded-[6px] bg-grey-0 border-border-basic-1 p-0"
        align="end"
      >
        <DropdownMenuItem
          className={cn(DROPDOWN_MENU_CLASSNAME.ITEM)}
          onClick={() =>
            schematicUseCreate(
              {
                projectSlug: slug,
                id,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: QUERY_KEY_PROJECT_API.RETRIEVE({ slug }),
                  })
                  toast('도식화 이미지를 사용했어요.', {
                    action: {
                      label: '닫기',
                      onClick: () => {},
                    },
                  })
                },
              },
            )
          }
        >
          <CheckIcon className={cn(DROPDOWN_MENU_CLASSNAME.ICON)} />
          <p className={cn(DROPDOWN_MENU_CLASSNAME.TEXT)}>도식화 사용</p>
        </DropdownMenuItem>
        <DropdownMenuItem className={cn(DROPDOWN_MENU_CLASSNAME.ITEM)}>
          <a
            href={image}
            download={image}
            className="flex gap-[10px] items-center w-full"
            target="_blank"
            rel="noreferrer"
          >
            <DownloadIcon className={cn(DROPDOWN_MENU_CLASSNAME.ICON)} />
            <p className={cn(DROPDOWN_MENU_CLASSNAME.TEXT)}>다운로드</p>
          </a>
        </DropdownMenuItem>
        {isDelete && (
          <DropdownMenuItem
            className={cn(DROPDOWN_MENU_CLASSNAME.ITEM)}
            onClick={() =>
              schematicDestroy(
                {
                  projectSlug: slug,
                  id,
                },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey:
                        QUERY_KEY_SCHEMATIC_API.PROJECT_SCHEMATIC_LIST_INFINITE(),
                    })
                    toast('도식화 이미지가 삭제되었어요.', {
                      action: {
                        label: '닫기',
                        onClick: () => {},
                      },
                    })
                  },
                },
              )
            }
          >
            <TrashIcon className={cn(DROPDOWN_MENU_CLASSNAME.ICON)} />
            <p className={cn(DROPDOWN_MENU_CLASSNAME.TEXT)}>삭제</p>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const SchematicHistoryDrawer = () => {
  const { slug } = useParams<{ slug: string }>()
  const { open, handleOpenChange, handleAnimationEnd } = useDrawerAutoClose()

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useProjectSchematicListInfiniteQuery({
      variables: {
        projectSlug: slug,
        query: {
          page_size: 5,
        },
      },
    })

  const projectSchematicList = useMemo(
    () => data?.pages.flatMap((page) => page.results).filter(Boolean) ?? [],
    [data],
  )

  // 생성일 기준으로 날짜별로 그룹화
  const groupedSchematicData = useMemo(() => {
    const grouped: Record<string, SchematicType[]> = {}

    projectSchematicList.forEach((item) => {
      if (!item) return

      const dateKey = dayjs(item.createdAt).format('YYYY/MM/DD')
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(item)
    })

    // 날짜별로 정렬 (최신 날짜가 먼저 오도록)
    return Object.entries(grouped)
      .map(([date, items]) => ({
        date,
        items: items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [projectSchematicList])

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={handleOpenChange}
      onAnimationEnd={handleAnimationEnd}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost-primary"
          size="icon-lg"
          type="button"
          title="히스토리"
        >
          <ArticleIcon className="size-[24px] text-grey-0" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-grey-0 w-full min-w-[calc(100vw-268px)] sm:min-w-[644px] !border-0">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-center justify-between h-[60px] px-[20px] py-[12px] border-b border-border-basic-1">
            <p className="typo-pre-heading-2 text-grey-10">히스토리</p>
            <DrawerClose asChild className="size-[32px]">
              <Button variant="ghost" size="fit" aria-label="close">
                <XIcon className="size-[32px] text-primary-3" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          {/* 히스토리 내용 */}
          <div className="flex-1 overflow-y-auto px-[20px] py-[24px]">
            <LoadingView
              fallback={<SkeletonSchematicHistory />}
              isLoading={isLoading}
            >
              <EmptyView
                fallback={<EmptySchematicHistory />}
                data={groupedSchematicData}
              >
                <InfinityContent
                  hasMore={hasNextPage}
                  isFetching={isFetchingNextPage}
                  onFetchMore={fetchNextPage}
                >
                  {groupedSchematicData.map((group) => (
                    <div key={group.date} className="flex flex-col gap-[12px]">
                      <p className="typo-pre-heading-3 text-grey-9">
                        {group.date}
                      </p>
                      {group.items.map(({ id, image, prompt }, idx) => (
                        <div
                          key={id}
                          className="aspect-[3/2] h-[368px] relative flex flex-col gap-[12px]"
                        >
                          <Image
                            src={image}
                            alt={prompt || '스키매틱 이미지'}
                            className={cn(
                              'w-full h-full object-cover',
                              idx !== group.items.length - 1 &&
                                'border-b pb-[12px] border-background-basic-3',
                            )}
                            fill
                            priority
                          />
                          <HistoryItemDropDownMenu id={id} image={image} />
                        </div>
                      ))}
                    </div>
                  ))}
                </InfinityContent>
              </EmptyView>
            </LoadingView>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
