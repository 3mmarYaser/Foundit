import { Item } from '../../../domain/entities/Item'
import { getDB } from '../../../services/db/sqlite'
import { itemMapper, ItemRow } from '../../mappers/itemMapper'
import { ITEMS_TABLE_NAME } from './schema'

/**
 * Low-level SQLite repository
 * - returns/accepts domain Item objects (uses mapper internally)
 */

export const itemsSQLiteDS = {
  async init(): Promise<void> {
    await getDB() // getDB creates tables via schema
  },

  async add(item: Item): Promise<Item> {
    const db = await getDB()
    const row = itemMapper.toRow(item)

    const [result] = await db.executeSql(
      `INSERT INTO ${ITEMS_TABLE_NAME}
        (id, type, title, description, category, is_resolved, latitude, longitude, photo_uri, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        row.id,
        row.type,
        row.title,
        row.description,
        row.category,
        row.is_resolved,
        row.latitude,
        row.longitude,
        row.photo_uri,
        row.created_at,
        row.updated_at,
      ],
    )

    const id = result.rows.item(0) as Item
    console.log(id)

    return item
  },

  async getAll(): Promise<Item[]> {
    const db = await getDB()

    const [rs] = await db.executeSql(
      `SELECT * FROM ${ITEMS_TABLE_NAME} ORDER BY updated_at DESC;`,
    )

    const out: Item[] = []
    const len = rs.rows.length

    for (let i = 0; i < len; i++) {
      const row = rs.rows.item(i) as ItemRow

      out.push(itemMapper.toDomain(row))
    }
    return out
  },

  async getById(id: string): Promise<Item | null> {
    const db = await getDB()

    const [rs] = await db.executeSql(
      `SELECT * FROM ${ITEMS_TABLE_NAME} WHERE id = ?`,
      [id],
    )

    if (rs.rows.length === 0) return null

    const row = rs.rows.item(0) as ItemRow

    return itemMapper.toDomain(row)
  },

  async getByType(type: Item['type']): Promise<Item[]> {
    const db = await getDB()

    const [rs] = await db.executeSql(
      `SELECT * FROM ${ITEMS_TABLE_NAME} WHERE type = ? ORDER BY updated_at DESC;`,
      [type],
    )

    const out: Item[] = []

    for (let i = 0; i < rs.rows.length; i++) {
      out.push(itemMapper.toDomain(rs.rows.item(i) as ItemRow))
    }

    return out
  },

  async update(item: Item): Promise<void> {
    if (!item.id) throw new Error('update requires item.id')

    const db = await getDB()
    const row = itemMapper.toRow(item)

    await db.executeSql(
      `UPDATE ${ITEMS_TABLE_NAME}
       SET type=?, title=?, description=?, category=?, is_resolved=?, latitude=?, longitude=?, photo_uri=?, updated_at=?
       WHERE id=?;`,
      [
        row.type,
        row.title,
        row.description,
        row.category,
        row.is_resolved,
        row.latitude,
        row.longitude,
        row.photo_uri,
        row.updated_at,
        item.id,
      ],
    )
  },

  async upsert(item: Item): Promise<void> {
    // Use INSERT OR REPLACE pattern with id; this will replace row if id exists.
    const db = await getDB()
    const row = itemMapper.toRow(item)

    // INSERT OR REPLACE (keeps id)
    await db.executeSql(
      `INSERT OR REPLACE INTO ${ITEMS_TABLE_NAME}
        (id, type, title, description, category, is_resolved, latitude, longitude, photo_uri, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        item.id,
        row.type,
        row.title,
        row.description,
        row.category,
        row.is_resolved,
        row.latitude,
        row.longitude,
        row.photo_uri,
        row.created_at,
        row.updated_at,
      ],
    )
  },

  async remove(id: string): Promise<void> {
    const db = await getDB()

    await db.executeSql(`DELETE FROM ${ITEMS_TABLE_NAME} WHERE id = ?;`, [id])
  },

  async toggleResolved(id: string): Promise<void> {
    const db = await getDB()
    const updated_at = Date.now()

    await db.executeSql(
      `UPDATE ${ITEMS_TABLE_NAME} SET is_resolved = 1 - is_resolved, updated_at = ? WHERE id = ?`,
      [updated_at, id],
    )
  },
}
