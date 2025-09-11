import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AppContext from './AppContext'

import { Item, ItemType } from '../domain/entities/Item'
import { itemsRepo } from '../data/repos/itemsRepo'
import { reportItemUC } from '../domain/usecases/ReportItemUC'
import { updateItemUC } from '../domain/usecases/UpdateItemUC'
import { removeItemUC } from '../domain/usecases/RemoveItemUC'
import { toggleResolvedUC } from '../domain/usecases/ToggleResolvedUC'

//

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  //
  const [activeTab, setActiveTab] = useState<ItemType>('found')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  // ---- INIT ----
  useEffect(() => {
    const init = async () => {
      await itemsRepo.init()
      const initial = await itemsRepo.getByType(activeTab)
      setItems(initial)
      setLoading(false)
    }
    init()
  }, [])

  // ---- CRUD Actions ----
  const selectTab = useCallback(async (tab: ItemType) => {
    setActiveTab(tab)
    const filtered = await itemsRepo.getByType(tab)
    setItems(filtered)
  }, [])

  const addItem = useCallback(
    async (item: Item) => {
      const newItem = await reportItemUC(itemsRepo, item)

      if (newItem.type === activeTab) {
        setItems(current => [...current, newItem])
      }
    },
    [activeTab],
  )

  const updateItem = useCallback(async (item: Item) => {
    await updateItemUC(itemsRepo, item)

    setItems(current =>
      current.map(it => (it.id === item.id ? { ...it, ...item } : it)),
    )
  }, [])

  const removeItem = useCallback(async (id: number) => {
    await removeItemUC(itemsRepo, id)

    setItems(current => current.filter(it => it.id !== id))
  }, [])

  const getItemById = useCallback(
    async (id: number) => await itemsRepo.getById(id),
    [],
  )

  const toggleResolved = useCallback(async (id: number) => {
    await toggleResolvedUC(itemsRepo, id)

    setItems(current =>
      current.map(it =>
        it.id === id
          ? { ...it, status: it.status == 'open' ? 'resolved' : 'open' }
          : it,
      ),
    )
  }, [])

  // ---- Context Value ----
  const contextValue = useMemo(
    () => ({
      items,
      loading,
      activeTab,
      selectTab,
      addItem,
      updateItem,
      removeItem,
      getItemById,
      toggleResolved,
    }),
    [
      items,
      loading,
      activeTab,
      selectTab,
      addItem,
      updateItem,
      removeItem,
      getItemById,
      toggleResolved,
    ],
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export default AppProvider
