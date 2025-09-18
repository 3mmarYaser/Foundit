import { createContext } from 'react'
import { Item, ItemType } from '../domain/entities/Item'

type AppContextType = {
  items: Item[]
  loading: boolean
  activeTab: ItemType
  isSyncing: boolean
  selectTab: (tab: ItemType) => void
  addItem: (item: Item) => void
  updateItem: (item: Item) => void
  removeItem: (id: number) => void
  getItemById: (id: number) => Promise<Item | null>
  toggleResolved: (id: number) => void
  sync: (opts?: {
    tab?: ItemType
    onProgress?: (msg: string) => void
  }) => Promise<void>
  imageNameToUri: (imageName: string) => string
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export default AppContext
