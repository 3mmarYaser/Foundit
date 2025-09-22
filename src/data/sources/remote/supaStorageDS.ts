import {
  getFromCache,
  saveToCache,
} from '../../../services/storage/cache/cache.service'
import { storageClient } from '../../../services/storage/supabase/storage.service'

//

export const supaStorageDS = {
  async uploadImage(imageName: string, buffer: ArrayBuffer): Promise<string> {
    return storageClient.uploadItemImage(imageName, buffer)
  },

  async downloadImage(imageName: string): Promise<string> {
    let cached = await getFromCache(imageName)

    if (!cached) {
      const blob = await storageClient.downloadItemImage(imageName)

      cached = await saveToCache(imageName, blob)
    }

    return cached
  },

  async deleteImage(name: string): Promise<boolean> {
    return storageClient.deleteItemImage(name)
  },
}
