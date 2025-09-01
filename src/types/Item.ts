export enum ItemType {
  Found = 'found',
  Lost = 'lost',
}

export enum ItemStatus {
  Open = 'open',
  Resolved = 'resolved',
}

export interface Item {
  id?: number
  type: ItemType
  title: string
  description?: string
  category?: string
  status: ItemStatus
  latitude?: number | null
  longitude?: number | null
  photo_uri: string
  created_at: number
  updated_at: number
}

export type ItemToInsert = Omit<
  Item,
  'id' | 'status' | 'created_at' | 'updated_at'
>
