import { Item } from '../../../domain/entities/Item'
import { itemMapper } from '../../mappers/itemMapper'
import { firestoreClient } from '../../../services/firebase/firestore'

//

export const itemsFirebaseDS = {
  async getAll(): Promise<Item[]> {
    const remotes = await firestoreClient.getAllRemote()
    return remotes.map(r => itemMapper.toDomain(r))
  },

  async getById(id: string): Promise<Item | null> {
    const r = await firestoreClient.getById(id)
    return r ? itemMapper.toDomain(r) : null
  },

  async upsert(item: Item): Promise<void> {
    const remote = itemMapper.toRemoteRow(item)
    await firestoreClient.upsertRemote(remote)
  },

  async remove(id: string): Promise<void> {
    await firestoreClient.deleteRemote(id)
  },
}
