export const ITEMS_TABLE_NAME = 'items_table'

export const CREATE_ITEMS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS ${ITEMS_TABLE_NAME} (
    id TEXT PRIMARY KEY,
    type TEXT,
    title TEXT,
    description TEXT,
    category TEXT default 'Unspecified',
    is_resolved BOOLEAN default 0,
    latitude REAL,
    longitude REAL,
    photo_uri TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );
`
