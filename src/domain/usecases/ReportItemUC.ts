import { Item, ItemStatus } from '../entities/Item'
import { ItemRepoInterface } from '../repos/ItemRepoInterface'
import { Platform } from 'react-native'

export type ReportItemInput = Omit<Item, 'created_at' | 'updated_at'>

export const reportItemUC = async (
  repo: ItemRepoInterface,
  input: ReportItemInput,
): Promise<Item> => {
  // Example business rule: title required, photo_uri required
  if (!input.title?.trim()) throw new Error('Title is required')
  if (!input.photo_uri?.trim()) throw new Error('Photo is required')

  const now = Date.now()
  const newItem: Item = {
    ...input,
    // TOOD: use uuid
    id: Date.now() + (Platform.OS == 'ios' ? 'i' : 'a'),
    status: input.status ?? ('open' as ItemStatus),
    created_at: now,
    updated_at: now,
  }

  const saved = await repo.add(newItem)

  return saved
}
