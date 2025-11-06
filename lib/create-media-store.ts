import { create } from "zustand"

import type { PlayerStore } from "@/hooks/limeplay/use-player"
import { createPlayerStore } from "@/hooks/limeplay/use-player"

export type TypeMediaStore = PlayerStore & {}

export interface CreateMediaStoreProps {
  debug?: boolean
}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
