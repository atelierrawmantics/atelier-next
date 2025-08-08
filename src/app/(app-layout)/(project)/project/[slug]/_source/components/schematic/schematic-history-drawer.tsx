import { useMemo } from 'react'

import { useParams } from 'next/navigation'

import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useProjectSchematicListInfiniteQuery } from '@/generated/apis/Schematic/Schematic.query'
import { ImagesIcon } from '@/generated/icons/MyIcons'

export const SchematicHistoryDrawer = () => {
  const { id } = useParams<{ id: string }>()

  const { data } = useProjectSchematicListInfiniteQuery({
    variables: {
      projectSlug: id,
      query: {
        page_size: 5,
      },
    },
  })

  const projectSchematicList = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  )

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="ghost-primary"
          size="icon-lg"
          type="button"
          title="히스토리"
        >
          <ImagesIcon />
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
        </div>
      </DrawerContent>
    </Drawer>
  )
}
