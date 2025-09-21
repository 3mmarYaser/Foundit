// src/services/sync/syncService.ts
import NetInfo from '@react-native-community/netinfo'
import { itemsSQLiteDS } from '../../data/sources/local/itemsSQLiteDS'
import { itemsFirebaseDS } from '../../data/sources/remote/itemsFirebaseDS'
import { supaStorageDS } from '../../data/sources/remote/supaStorageDS'
import { cleanupCache } from '../storage/cache/cache.service'
import { uriToArrayBuffer } from '../storage/helper'

type ProgressCb = (msg: string, percent?: number) => void

let _isSyncing = false

export const syncService = {
  isSyncing() {
    return _isSyncing
  },

  /**
   * Full two-way sync: remote -> local, then local -> remote.
   * Accepts optional progress callback for UI updates.
   */
  async fullSync(opts?: { onProgress?: ProgressCb }): Promise<void> {
    if (_isSyncing) return

    _isSyncing = true

    await cleanupCache(24 * 7)

    const onProgress = opts?.onProgress

    try {
      onProgress?.('Initializing local DB...')

      await itemsSQLiteDS.init()

      const net = await NetInfo.fetch()

      if (!net.isConnected) {
        onProgress?.('Offline — skipping remote sync')
        return
      }

      onProgress?.('Syncing: pulling remote changes (1/2)...')
      await pull(onProgress)

      onProgress?.('Syncing: pushing local changes (2/2)...')
      await push(onProgress)

      onProgress?.('Sync complete')
    } catch (err) {
      console.warn('syncService.fullSync error', err)
      throw err
    } finally {
      _isSyncing = false
    }
  },
}

/* -------------------------
   Internal helpers
   ------------------------- */

async function pull(onProgress?: ProgressCb) {
  const remoteItems = await itemsFirebaseDS.getAll()
  const total = remoteItems.length
  let idx = 0

  for (const remote of remoteItems) {
    idx++

    try {
      if (remote.id == null) {
        // Skip remote items that don't carry an ID matching local (optional handling)
        console.warn('remote item without id, skipping', remote)
        continue
      }

      const local = await itemsSQLiteDS.getById(remote.id)

      if (!local) {
        // Local missing -> insert remote

        await itemsSQLiteDS.upsert(remote)
        await supaStorageDS.downloadImage(remote.photo_uri)

        onProgress?.(
          `Imported remote item ${remote.id}`,
          Math.round((idx / total) * 50),
        )
      } else if ((remote.updated_at ?? 0) > (local.updated_at ?? 0)) {
        // Remote is newer -> overwrite local

        await itemsSQLiteDS.upsert(remote)
        await supaStorageDS.downloadImage(remote.photo_uri)

        onProgress?.(
          `Updated local item ${remote.id}`,
          Math.round((idx / total) * 50),
        )
      } else {
        // local is newer or same -> nothing to do
      }
    } catch (err) {
      console.warn(`pull: failed for remote id ${remote.id}`, err)
    }
  }
}

async function push(onProgress?: ProgressCb) {
  const localItems = await itemsSQLiteDS.getAll()
  const total = localItems.length
  let idx = 0

  for (const local of localItems) {
    idx++

    try {
      if (!local.id) {
        // Local item without id should be rare (we expect DB assigns id)
        // fallback: insert locally first (should not happen in our flow)
        console.warn('local item without id, skipping push', local)
        continue
      }

      const remote = await itemsFirebaseDS.getById(local.id)

      if (!remote) {
        // Remote missing -> create remote

        await itemsFirebaseDS.upsert(local)

        const imageName = local.photo_uri
        const uri = await uriToArrayBuffer(imageName)

        await supaStorageDS.uploadImage(imageName, uri)

        onProgress?.(
          `Created remote item ${local.id}`,
          50 + Math.round((idx / total) * 50),
        )
      } else if ((local.updated_at ?? 0) > (remote.updated_at ?? 0)) {
        // Local is newer -> overwrite remote

        await itemsFirebaseDS.upsert(local)

        const imageName = local.photo_uri
        const uri = await uriToArrayBuffer(imageName)

        await supaStorageDS.uploadImage(imageName, uri)

        onProgress?.(
          `Updated remote item ${local.id}`,
          50 + Math.round((idx / total) * 50),
        )
      } else {
        // remote is newer or same -> nothing to do
      }
    } catch (err) {
      console.warn(`push: failed for local id ${local.id}`, err)
    }
  }
}
