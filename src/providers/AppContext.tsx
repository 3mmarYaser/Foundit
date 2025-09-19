import { createContext, RefObject } from 'react'
import { Item } from '../domain/entities/Item'
import { ActiveTab } from '../types/Tab'

type AppContextType = {
  items: Item[]
  loading: boolean
  activeTab: RefObject<ActiveTab>
  isSyncing: boolean
  selectTab: (tab: ActiveTab) => void
  addItem: (item: Item) => void
  updateItem: (item: Item) => void
  removeItem: (id: string) => void
  getItemById: (id: string) => Promise<Item | null>
  toggleResolved: (id: string) => void
  sync: (tab: ActiveTab, onProgress?: (msg: string) => void) => Promise<void>
  imageNameToUri: (imageName: string) => string
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export default AppContext
