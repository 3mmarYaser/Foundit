import { ItemRepoInterface } from '../repos/ItemRepoInterface'

export const removeItemUC = async (
  repo: ItemRepoInterface,
  id: number,
): Promise<void> => {
  return await repo.remove(id)
}
