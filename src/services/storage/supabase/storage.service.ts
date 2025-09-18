import { supabase } from './client'

const BUCKET = 'items'

//

export const storageClient = {
  async uploadItemImage(imageName: string, buffer: ArrayBuffer) {
    const { error } = await supabase.storage.from(BUCKET).upload(imageName, buffer, {
      contentType: `image/${imageName.split('.').pop()}`,
      upsert: true,
    })

    if (error) throw error

    return imageName
  },

  async downloadItemImage(imageName: string): Promise<ArrayBuffer> {
    const { data, error } = await supabase.storage.from(BUCKET).download(imageName)

    if (error) throw error

    const arrayBuffer = await data.arrayBuffer()
    // const buffer = Buffer.from(arrayBuffer)

    return arrayBuffer
  },

  async deleteItemImage(name: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([name])

    if (error) throw error

    return true
  },
}
