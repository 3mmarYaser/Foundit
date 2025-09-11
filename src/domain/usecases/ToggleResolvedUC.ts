import { ItemRepoInterface } from '../repos/ItemRepoInterface'

export const toggleResolvedUC = async (
  repo: ItemRepoInterface,
  id: number,
): Promise<void> => {
  return await repo.toggleResolved(id)
}
