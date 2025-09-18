import { Item, ItemStatus, ItemType } from '../../domain/entities/Item'

export type ItemRow = {
  id: string
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
      ...row,
      type: (row.type as ItemType) ?? 'lost',
      description: row.description ?? undefined,
      category: row.category ?? 'Unspecified',
      status: (row.is_resolved ? 'resolved' : 'open') as ItemStatus,
    }
  },

  toRow(item: Item): ItemRow {
    return {
      ...item,
      category: item.category ?? 'Unspecified',
      is_resolved: item.status == 'resolved',
    }
  },

  toRemoteRow(item: Item): ItemRow {
    return this.toRow(item)
    // {
    //   ...item,
    //   description: item.description ?? null,
    //   category: item.category ?? 'Unspecified',
    //   is_resolved: item.status == 'resolved',
    // }
  },
}
