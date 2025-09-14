import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AppContext from './AppContext'

import { Item, ItemType } from '../domain/entities/Item'
import { itemsRepo } from '../data/repos/itemsRepo'
import { reportItemUC } from '../domain/usecases/ReportItemUC'
import { updateItemUC } from '../domain/usecases/UpdateItemUC'
import { removeItemUC } from '../domain/usecases/RemoveItemUC'
import { toggleResolvedUC } from '../domain/usecases/ToggleResolvedUC'
import { syncService } from '../services/sync/syncService'

//

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  //
  const [activeTab, setActiveTab] = useState<ItemType>('found')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

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

  // Helper to load items for a tab (cancellation-safe)
  const loadItemsByTab = useCallback(
    async (tab: ItemType) => {
      setLoading(true)
      setError(null)

      try {
        const list = await itemsRepo.getByType(tab)
        setItems(list)
      } catch (err: any) {
        console.warn('loadItemsByTab error', err)
        setError(String(err?.message ?? err))
        setItems([]) // fallback
      } finally {
        setLoading(false)
      }
    },
    [], // repo impl is stable import
  )

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

  // --- NEW: sync function exposed to UI ---
  // Accepts optional tab to reload after sync; guarded to prevent concurrent runs
  const sync = useCallback(
    async (opts?: { tab?: ItemType; onProgress?: (msg: string) => void }) => {
      if (isSyncing || syncService.isSyncing()) return
      setIsSyncing(true)
      try {
        // run full sync (pull remote → local, then push local → remote)
        await syncService.fullSync({
          onProgress: (msg, _pct) => {
            opts?.onProgress?.(msg)
          },
        })
        // reload local items for either provided tab or current activeTab
        const tabToReload = opts?.tab ?? activeTab
        await loadItemsByTab(tabToReload)
      } catch (err) {
        console.warn('AppProvider.sync error', err)
        setError(String((err as any)?.message ?? err))
      } finally {
        setIsSyncing(false)
      }
    },
    [activeTab, isSyncing, loadItemsByTab],
  )

  // ---- Context Value ----
  const contextValue = useMemo(
    () => ({
      items,
      loading,
      activeTab,
      isSyncing,
      selectTab,
      addItem,
      updateItem,
      removeItem,
      getItemById,
      toggleResolved,
      sync,
    }),
    [
      items,
      loading,
      activeTab,
      isSyncing,
      selectTab,
      addItem,
      updateItem,
      removeItem,
      getItemById,
      toggleResolved,
      sync,
    ],
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export default AppProvider
