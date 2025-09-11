import { Item, ItemStatus, ItemType } from '../../domain/entities/Item'

export type ItemRow = {
  id?: number
  type: string | null
  title: string
  description?: string | null
  category?: string | null
  is_resolved: boolean // 0 or 1
  latitude?: number | null
  longitude?: number | null
  photo_uri: string
  created_at: number
  updated_at: number
}

export const itemMapper = {
  toDomain(row: ItemRow): Item {
    return {
      id: row.id,
      type: (row.type as ItemType) ?? 'lost',
      title: row.title,
      description: row.description ?? undefined,
      category: row.category ?? 'Unspecified',
      status: (row.is_resolved ? 'resolved' : 'open') as ItemStatus,
      latitude: row.latitude ?? null,
      longitude: row.longitude ?? null,
      photo_uri: row.photo_uri,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  },

  toRow(item: Omit<Item, 'id'>): Omit<ItemRow, 'id'> {
    return {
      type: item.type,
      title: item.title,
      description: item.description ?? null,
      category: item.category ?? 'Unspecified',
      is_resolved: item.status == 'resolved',
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      photo_uri: item.photo_uri,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }
  },

  toRemoteRow(item: Item): ItemRow {
    return {
      ...item,
      description: item.description ?? null,
      category: item.category ?? 'Unspecified',
      is_resolved: item.status == 'resolved',
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
    }
  },
}
