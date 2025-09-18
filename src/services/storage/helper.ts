export async function uriToArrayBuffer(fileUri: string): Promise<ArrayBuffer> {
  const response = await fetch(fileUri)
  const buffer = await response.arrayBuffer()

  return buffer
}

//

export const getExtFromUri = (fileUri: string) => fileUri.split('.').pop()

//

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)

  // /* GPT */
  // const chunkSize = 0x8000 // process in chunks to avoid call stack issues

  // for (let i = 0; i < bytes.length; i += chunkSize) {
  //   const chunk = bytes.subarray(i, i + chunkSize)
  //   binary += String.fromCharCode.apply(null, chunk as any)
  // }

  /* Gemini */
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary)
}
