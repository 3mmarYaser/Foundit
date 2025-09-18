import { Item, ItemType } from '../../domain/entities/Item'
import { ItemRepoInterface } from '../../domain/repos/ItemRepoInterface'
import { saveToCache } from '../../services/storage/cache/cache.service'
import { getExtFromUri, uriToArrayBuffer } from '../../services/storage/helper'
import { itemsSQLiteDS } from '../sources/local/itemsSQLiteDS'
import { itemsFirebaseDS } from '../sources/remote/itemsFirebaseDS'
import { supaStorageDS } from '../sources/remote/supaStorageDS'

export const itemsRepo: ItemRepoInterface = {
  async init() {
    await itemsSQLiteDS.init()
  },

  async getAll() {
    return itemsSQLiteDS.getAll()
  },

  async getById(id: number) {
    return itemsSQLiteDS.getById(id)
  },

  async getByType(type: ItemType) {
    return itemsSQLiteDS.getByType(type)
  },

  async add(item: Omit<Item, 'id'>) {
    // Cache image first
    const buffer = await uriToArrayBuffer(item.photo_uri)
    const imageName = `${Date.now()}.${getExtFromUri(item.photo_uri)}`

    await saveToCache(imageName, buffer)

    // insert locally
    const saved = await itemsSQLiteDS.add({ ...item, photo_uri: imageName })

    // try remote sync but don't block on failure
    try {
      // 1. Upload image if exists
      await supaStorageDS.uploadImage(imageName, buffer)
      await itemsFirebaseDS.upsert(saved)
    } catch (err) {
      console.error('Remote upsert failed (add):', err)
    }

    return saved
  },

  async update(item) {
    await itemsSQLiteDS.update(item)

    try {
      await itemsFirebaseDS.upsert(item)
    } catch (err) {
      console.error('Remote upsert failed (update):', err)
    }
  },

  async upsert(item) {
    await itemsSQLiteDS.upsert(item)

    try {
      await itemsFirebaseDS.upsert(item)
    } catch (err) {
      console.error('Remote upsert failed (upsert):', err)
    }
  },

  async remove(id) {
    await itemsSQLiteDS.remove(id)

    try {
      await itemsFirebaseDS.remove(id)
    } catch (err) {
      console.error('Remote remove failed:', err)
    }
  },

  async toggleResolved(id) {
    await itemsSQLiteDS.toggleResolved(id)

    const updated = await itemsSQLiteDS.getById(id)

    if (updated) {
      try {
        await itemsFirebaseDS.upsert(updated)
      } catch (err) {
        console.error('Remote markResolved failed:', err)
      }
    }
  },
}
