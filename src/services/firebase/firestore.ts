import firestore from '@react-native-firebase/firestore'
import { ItemRow } from '../../data/mappers/itemMapper'

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true

const COLLECTION = 'items'

//

export const firestoreClient = {
  collectionRef() {
    return firestore().collection(COLLECTION)
  },

  async getAllRemote(): Promise<ItemRow[]> {
    const snap = await this.collectionRef().get()
    return snap.docs.map(d => d.data() as ItemRow)
  },

  async getById(id: string): Promise<ItemRow | null> {
    const doc = await this.collectionRef().doc(id).get()

    if (!doc.exists) return null

    return doc.data() as ItemRow
  },

  async upsertRemote(item: ItemRow): Promise<void> {
    if (!item.id) {
      // create new doc with auto id: use Firestore auto-id (but domain expects numeric id) -
      // best pattern: keep local id as authoritative. For PoC, require id.
      const ref = await this.collectionRef().add(item)
      // optionally set doc id to numeric? not trivial — recommend using id from local DB
      return
    }

    await this.collectionRef().doc(item.id).set(item, { merge: true })
  },

  async deleteRemote(id: string): Promise<void> {
    await this.collectionRef().doc(id).delete()
  },
}
