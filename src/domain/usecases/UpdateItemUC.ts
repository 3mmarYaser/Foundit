import { Item } from '../entities/Item'
import { ItemRepoInterface } from '../repos/ItemRepoInterface'

export const updateItemUC = async (
  repo: ItemRepoInterface,
  input: Item,
): Promise<void> => {
  if (!input.title?.trim()) throw new Error('Title is required')
  if (!input.photo_uri?.trim()) throw new Error('Photo is required')

  return await repo.update(input)
}
