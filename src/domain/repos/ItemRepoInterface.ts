import { Item, ItemType } from '../entities/Item'

export interface ItemRepoInterface {
  init(): Promise<void>

  // Read
  getAll(): Promise<Item[]>
  getById(id: number): Promise<Item | null>
  getByType(type: ItemType): Promise<Item[]>

  // Create / Update / Delete
  add(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item>
  update(item: Item): Promise<void>
  upsert(item: Item): Promise<void>
  remove(id: number): Promise<void>

  // Helpers
  toggleResolved(id: number): Promise<void>
}
