import { supabase } from './client'

const BUCKET = 'items'

//

export const storageClient = {
  bucket: () => supabase.storage.from(BUCKET),

  async uploadItemImage(imageName: string, buffer: ArrayBuffer) {
    const { error } = await this.bucket().upload(imageName, buffer, {
      contentType: `image/${imageName.split('.').pop()}`,
      upsert: true,
    })

    if (error) throw error

    return imageName
  },

  async downloadItemImage(imageName: string): Promise<Blob> {
    const { data, error } = await this.bucket().download(imageName)

    if (error) throw error

    return data
  },

  async deleteItemImage(name: string) {
    const { error } = await this.bucket().remove([name])

    if (error) throw error

    return true
  },
}
