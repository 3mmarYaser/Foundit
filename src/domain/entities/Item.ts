export type ItemType = 'lost' | 'found'

export type ItemStatus = 'open' | 'resolved'

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

export enum ItemTypes {
  Found = 'found',
  Lost = 'lost',
}
