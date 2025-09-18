import firestore from '@react-native-firebase/firestore'
import { ItemRow } from '../../data/mappers/itemMapper'

const COLLECTION = 'items'

export const firestoreClient = {
  collectionRef() {
    return firestore().collection(COLLECTION)
  },

  async getAllRemote(): Promise<ItemRow[]> {
    const snap = await firestore().collection(COLLECTION).get()
    return snap.docs.map(d => d.data() as ItemRow)
  },

  async getById(id: string): Promise<ItemRow | null> {
    const doc = await firestore().collection(COLLECTION).doc(id).get()

    if (!doc.exists) return null

    return doc.data() as ItemRow
  },

  async upsertRemote(item: ItemRow): Promise<void> {
    if (!item.id) {
      // create new doc with auto id: use Firestore auto-id (but domain expects numeric id) -
      // best pattern: keep local id as authoritative. For PoC, require id.
      const ref = await firestore().collection(COLLECTION).add(item)
      // optionally set doc id to numeric? not trivial — recommend using id from local DB
      return
    }

    await firestore()
      .collection(COLLECTION)
      .doc(item.id)
      .set(item, { merge: true })
  },

  async deleteRemote(id: string): Promise<void> {
    await firestore().collection(COLLECTION).doc(id).delete()
  },
}
