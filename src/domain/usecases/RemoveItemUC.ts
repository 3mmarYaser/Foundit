import { ItemRepoInterface } from '../repos/ItemRepoInterface'

export const removeItemUC = async (
  repo: ItemRepoInterface,
  id: string,
): Promise<void> => {
  return await repo.remove(id)
}
