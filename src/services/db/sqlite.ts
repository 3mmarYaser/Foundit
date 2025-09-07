import SQLite from 'react-native-sqlite-storage'
import { CREATE_ITEMS_TABLE_QUERY } from '../../data/sources/local/schema'

SQLite.enablePromise(true)

let _db: SQLite.SQLiteDatabase | null = null

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db

  _db = await SQLite.openDatabase({ name: 'foundit.db', location: 'default' })

  // Ensure tables exist
  await _db.executeSql(CREATE_ITEMS_TABLE_QUERY)

  return _db
}

export async function closeDB(): Promise<void> {
  if (!_db) return

  await _db.close()

  _db = null
}
