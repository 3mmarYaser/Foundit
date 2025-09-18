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
  removeItem: (id: string) => void
  getItemById: (id: string) => Promise<Item | null>
  toggleResolved: (id: string) => void
  sync: (opts?: {
    tab?: ItemType
    onProgress?: (msg: string) => void
  }) => Promise<void>
  imageNameToUri: (imageName: string) => string
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export default AppContext
