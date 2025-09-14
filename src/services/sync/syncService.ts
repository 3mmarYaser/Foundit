// src/services/sync/syncService.ts
import NetInfo from '@react-native-community/netinfo'
import { itemsSQLiteDS } from '../../data/sources/local/itemsSQLiteDS'
import { itemsFirebaseDS } from '../../data/sources/remote/itemsFirebaseDS'

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
      await syncFromRemote(onProgress)

      onProgress?.('Syncing: pushing local changes (2/2)...')
      await syncToRemote(onProgress)

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

async function syncFromRemote(onProgress?: ProgressCb) {
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

        onProgress?.(
          `Imported remote item ${remote.id}`,
          Math.round((idx / total) * 50),
        )
      } else if ((remote.updated_at ?? 0) > (local.updated_at ?? 0)) {
        // Remote is newer -> overwrite local
        await itemsSQLiteDS.upsert(remote)

        onProgress?.(
          `Updated local item ${remote.id}`,
          Math.round((idx / total) * 50),
        )
      } else {
        // local is newer or same -> nothing to do
      }
    } catch (err) {
      console.warn(`syncFromRemote: failed for remote id ${remote.id}`, err)
    }
  }
}

async function syncToRemote(onProgress?: ProgressCb) {
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

        onProgress?.(
          `Created remote item ${local.id}`,
          50 + Math.round((idx / total) * 50),
        )
      } else if ((local.updated_at ?? 0) > (remote.updated_at ?? 0)) {
        // Local is newer -> overwrite remote
        await itemsFirebaseDS.upsert(local)

        onProgress?.(
          `Updated remote item ${local.id}`,
          50 + Math.round((idx / total) * 50),
        )
      } else {
        // remote is newer or same -> nothing to do
      }
    } catch (err) {
      console.warn(`syncToRemote: failed for local id ${local.id}`, err)
    }
  }
}

// import { itemsSQLiteDS } from '../../data/sources/local/itemsSQLiteDS'
// import { itemsFirebaseDS } from '../../data/sources/remote/itemsFirebaseDS'

// /**
//  * Two-way sync:
//  *  - Pull remote items, upsert locally
//  *  - Push local items to remote (upsert)
//  *
//  * Conflict resolution: last updated wins (based on updated_at).
//  */

// export const syncService = {
//   async syncFromRemote(): Promise<void> {
//     // fetch remote
//     const remoteItems = await itemsFirebaseDS.getAll()
//     // upsert locally
//     for (const r of remoteItems) {
//       await itemsSQLiteDS.upsert(r)
//     }
//   },

//   async syncToRemote(): Promise<void> {
//     const local = await itemsSQLiteDS.getAll()
//     for (const l of local) {
//       try {
//         await itemsFirebaseDS.upsert(l)
//       } catch (err) {
//         console.warn('syncToRemote: upsert failed for id', l.id, err)
//       }
//     }
//   },

//   async fullSync(): Promise<void> {
//     // Optionally: perform remote->local first (so we don't overwrite remote with stale local)
//     await this.syncFromRemote()
//     await this.syncToRemote()
//   },
// }
