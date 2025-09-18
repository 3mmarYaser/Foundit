// services/cache/cache.service.ts
import RNFS from 'react-native-fs'
import { arrayBufferToBase64 } from '../helper'

const CACHE_DIR = `${RNFS.CachesDirectoryPath}/images`

/**
 * Ensure cache directory exists
 */
async function createIfNotExist() {
  const exists = await RNFS.exists(CACHE_DIR)

  if (!exists) {
    await RNFS.mkdir(CACHE_DIR)
  }
}

/**
 * Save file to cache
 */
export async function saveToCache(fileName: string, data: ArrayBuffer | Blob) {
  await createIfNotExist()

  const filePath = `${CACHE_DIR}/${fileName}`

  try {
    let base64Data: string =
      data instanceof ArrayBuffer
        ? arrayBufferToBase64(data)
        : await blobToBase64(data)

    await RNFS.writeFile(filePath, base64Data, 'base64')
  } catch (e) {
    console.error(e)
  }

  return filePath
}

/**
 * Get file from cache
 */
export async function getFromCache(imageName: string): Promise<string | null> {
  const filePath = imageNameToCachedUri(imageName)
  const exists = await RNFS.exists(filePath)

  return exists ? filePath : null
}

export const imageNameToCachedUri = (imageName: string) => {
  return imageName?.startsWith('file://')
    ? imageName
    : `file://${CACHE_DIR}/${imageName}`
}
/**
 * Convert Blob → base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }

    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Clear cache directory
 */
export async function clearCache() {
  const exists = await RNFS.exists(CACHE_DIR)

  if (exists) {
    await RNFS.unlink(CACHE_DIR)
  }
}

//
// -------- CACHE CLEANUP --------
//
export async function cleanupCache(olderThanHours = 24) {
  const files = await RNFS.readDir(CACHE_DIR)
  const now = Date.now()

  for (const file of files) {
    if (file.mtime) {
      const diffHours =
        (now - new Date(file.mtime).getTime()) / (1000 * 60 * 60)

      if (diffHours > olderThanHours) {
        await RNFS.unlink(file.path).catch(() => {})
      }
    }
  }
}
