# Foundit

> A weekend PoC: Lost & Found tracker with camera + GPS + SQLite.
>
> ### Features
>
> - Capture item photo
> - Auto-tag GPS (when available)
> - Determine type either **lost** or **found**
> - Add title, description, and category
> - Local SQLite storage
> - Search & filter, mark resolved
>
> ### Tech
>
> React Native CLI • `react-native-vision-camera` • `react-native-geolocation-service` • `react-native-sqlite-storage` • React Navigation

## 1) Business Foundations

### Problem

People frequently **lose** or **find** items in public spaces but have no lightweight way to log details **with proof (photo)** and **where** it happened.

### Vision

A fast, offline-first mobile app to **snap a photo**, **auto-tag GPS**, and **store a searchable record**. (Local DB now; easily upgradable to cloud later.)

### Personas

- **Finder** — wants to record where she found an item to reunite it with its owner.
- **Owner** — wants a personal log of lost items with last-seen details.
- **Moderator/Community (future)** — handles public posts & contact handoffs.

### Value Proposition (MVP)

- **1-tap capture** of photo + GPS + short description → **trustworthy log**.
- **Offline-first**: works without network; sync is a future upgrade.
- **Fast retrieval**: filter/search by category, status, and proximity.

### Success Metrics (OKRs for PoC)

- **O1:** Ship MVP in a weekend.

  - KR1: 100% of items saved with photo + GPS + timestamp.
  - KR2: Search by text & category under 150ms on typical device.
  - KR3: 95% flows finish without crash (manual test suite).

### Competitive Angle (for recruiters)

- Clean architecture, native modules (camera/GPS), offline DB, privacy-by-design.
- Clear roadmap to SaaS features (share links, cloud sync, verification).

---

## 2) Scope & Feature Set

### MVP (Weekend)

- Add Item (Lost or Found) with **photo**, **GPS**, **title/description**, **category**.
- Items **list** with thumbnails + **search/filter**.
- Item **details** screen (full photo, map snapshot optional).
- Mark **Resolved**.
- Local **SQLite** storage.

### Nice-to-Have (If time allows)

- **Map view** of items near me (react-native-maps).
- **Multiple photos** per item.
- **Image compression** before save.

### Out of Scope (Future)

- Cloud sync / auth / public marketplace.
- Push notifications, chat between users.
- OCR / similarity matching.

---

## 3) User Stories & Acceptance Criteria

1. **Create Found Item**

   - As a Finder, I can take a photo, auto-capture GPS, add title/desc/category, and save.
   - **AC:** If location denied/unavailable, I can still save with “No location” tag.

2. **Create Lost Item**

   - As an Owner, I can log what I lost with last-seen GPS & details.
   - **AC:** Type defaults to “Lost”; GPS optional but requested.

3. **Browse & Search**

   - As a user, I can view items list with thumbnails; filter by type (Lost/Found), category, status; search by text.
   - **AC:** Query returns under 150ms for < 500 entries.

4. **View Item Details**

   - As a user, I can open an item to see full photo, location (coords), and metadata, and mark resolved.
   - **AC:** Status change persists and reflects in the list immediately.

---

## 4) Data Model (SQLite)

### Tables

**items**

```sql
id INTEGER PRIMARY KEY NOT NULL
type TEXT NOT NULL            -- 'lost' | 'found'
title TEXT NOT NULL
description TEXT
category TEXT                 -- 'wallet', 'keys', 'electronics', 'documents', 'other'
status TEXT NOT NULL          -- 'open' | 'resolved'
latitude REAL                 -- nullable
longitude REAL                -- nullable
address TEXT                  -- optional (reverse geocoding vNext)
photo_uri TEXT NOT NULL
created_at INTEGER NOT NULL   -- epoch ms
updated_at INTEGER NOT NULL   -- epoch ms
```

_(Optional)_ **photos** (if you add multiple images)

```sql
id INTEGER PRIMARY KEY NOT NULL
item_id INTEGER NOT NULL
photo_uri TEXT NOT NULL
FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE
```

### Indexes

- `CREATE INDEX idx_items_type ON items(type);`
- `CREATE INDEX idx_items_status ON items(status);`
- `CREATE INDEX idx_items_created_at ON items(created_at DESC);`

---

## 5) Architecture & Tech Choices

- **RN CLI** (no Expo).
- **Navigation:** `@react-navigation/native` (Stack).
- **Camera:** `react-native-vision-camera`.
- **Location:** `react-native-geolocation-service`.
- **DB:** `react-native-sqlite-storage` (promise API).
- **State:** lightweight Context or Zustand; keep server-less.
- **Utils:** `date-fns` for formatting (optional).

### Folder Structure

```
Foundit/
├─ android/
├─ ios/
├─ src/
│  ├─ components/
│  │   ├─ ItemCard.tsx
│  │   └─ EmptyState.tsx
│  ├─ screens/
│  │   ├─ HomeListScreen.tsx
│  │   ├─ AddItemScreen.tsx
│  │   ├─ CameraScreen.tsx
│  │   └─ ItemDetailsScreen.tsx
│  ├─ db/
│  │   └─ sqlite.ts
│  ├─ services/
│  │   ├─ camera.ts
│  │   ├─ geo.ts
│  │   └─ items.ts
│  ├─ navigation/AppNavigator.tsx
│  ├─ types.ts
│  └─ App.tsx
└─ package.json
```

---

## 6) Permissions & Platform Setup

### Android (Manifest)

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<application ...>
  <!-- If using VisionCamera, ensure minSdk >= 21 and proper Gradle setup -->
</application>
```

### iOS (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>We use the camera to capture item photos.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We use your location to tag where items were lost or found.</string>
```

---

## 7) Install Commands

```shell
npx react-native@latest init Foundit
cd Foundit

# Navigation
yarn install /
    @react-navigation/native /
    @react-navigation/native-stack /
    react-native-screens /
    react-native-safe-area-context

# Camera & Location & DB
yarn install /
    react-native-vision-camera /
    react-native-geolocation-service /
    react-native-sqlite-storage

# iOS pods
cd ios && pod install && cd ..
```

> Android Gradle setup for these libs follows their READMEs; VisionCamera requires CameraX dependencies (auto-handled by recent versions).

---

## 8) Core Code Scaffolding (TypeScript-friendly)

### `src/types.ts`

```ts
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
```

### `src/db/sqlite.ts`

```ts
import SQLite from 'react-native-sqlite-storage'
SQLite.enablePromise(true)

let db: SQLite.SQLiteDatabase

export async function openDB() {
  if (db) return db

  db = await SQLite.openDatabase({ name: 'foundit.db', location: 'default' })

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      status TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      photo_uri TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `)

  await db.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);`,
  )

  await db.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);`,
  )

  return db
}

export async function insertItem(item: Omit<Item, 'id'>) {
  const d = await openDB()

  const sql = `
    INSERT INTO items (type,title,description,category,status,latitude,longitude,photo_uri,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?)`

  const params = [
    item.type,
    item.title,
    item.description ?? null,
    item.category ?? null,
    item.status,
    item.latitude ?? null,
    item.longitude ?? null,
    item.photo_uri,
    item.created_at,
    item.updated_at,
  ]
  const res = await d.executeSql(sql, params)
  const id = res[0].insertId as number
  return { ...item, id }
}

export async function listItems(q?: {
  text?: string
  type?: string
  status?: string
}) {
  const d = await openDB()
  let sql = `SELECT * FROM items`
  const clauses: string[] = []
  const params: any[] = []

  if (q?.text) {
    clauses.push(`(title LIKE ? OR description LIKE ?)`)
    params.push(`%${q.text}%`, `%${q.text}%`)
  }

  if (q?.type) {
    clauses.push(`type = ?`)
    params.push(q.type)
  }

  if (q?.status) {
    clauses.push(`status = ?`)
    params.push(q.status)
  }

  if (clauses.length) sql += ` WHERE ` + clauses.join(' AND ')

  sql += ` ORDER BY created_at DESC`

  const res = await d.executeSql(sql, params)

  return res[0].rows.raw()
}

export async function findItem(id: number) {
  const d = await openDB()

  const res = await d.executeSql(`SELECT * FROM items WHERE id = ?`, [id])

  return res[0].rows.length ? res[0].rows.item(0) : null
}

export async function updateItemStatus(
  id: number,
  status: 'open' | 'resolved',
) {
  const d = await openDB()
  const now = Date.now()

  await d.executeSql(
    `UPDATE items SET status = ?, updated_at = ? WHERE id = ?`,
    [status, now, id],
  )
}
```

### `src/services/geo.ts`

```ts
import Geolocation from 'react-native-geolocation-service'

export function getCurrentCoords(): Promise<{
  latitude: number
  longitude: number
} | null> {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      pos =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      _err => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
    )
  })
}
```

### `src/services/camera.tsx` (Camera screen using VisionCamera)

```tsx
import React, { useRef, useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, Platform } from 'react-native'
import { Camera, useCameraDevice } from 'react-native-vision-camera'

export default function CameraScreen({ navigation, route }: any) {
  const device = useCameraDevice('back')
  const ref = useRef<Camera>(null)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    ;(async () => {
      const cam = await Camera.requestCameraPermission()
      setAuthorized(cam === 'granted' || cam === 'authorized')
    })()
  }, [])

  if (!device || !authorized)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Requesting camera...</Text>
      </View>
    )

  const take = async () => {
    const photo = await ref.current?.takePhoto({ flash: 'off' })

    if (!photo?.path) return

    const uri = Platform.OS === 'android' ? 'file://' + photo.path : photo.path

    navigation.navigate('AddItem', { photoUri: uri })
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref}
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
      />

      <TouchableOpacity
        onPress={take}
        style={{
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
          padding: 16,
          backgroundColor: '#0008',
          borderRadius: 28,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Capture</Text>
      </TouchableOpacity>
    </View>
  )
}
```

### `src/screens/AddItemScreen.tsx`

```tsx
import React, { useState } from 'react'
import { View, TextInput, Text, Image, Button, Alert } from 'react-native'
import { getCurrentCoords } from '../services/geo'
import { insertItem } from '../db/sqlite'
import type { Item } from '../types'

export default function AddItemScreen({ navigation, route }: any) {
  const { photoUri } = route.params || {}
  const [type, setType] = useState<'lost' | 'found'>('found')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')

  const save = async () => {
    const coords = await getCurrentCoords() // may be null
    const now = Date.now()

    const payload: Omit<Item, 'id'> = {
      type,
      title,
      description,
      category,
      status: 'open',
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
      photo_uri: photoUri,
      created_at: now,
      updated_at: now,
    }

    await insertItem(payload)

    Alert.alert('Saved', 'Your entry has been added.')

    navigation.replace('Home')
  }

  return (
    <View style={{ padding: 12 }}>
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ height: 220, borderRadius: 8, marginBottom: 12 }}
        />
      ) : (
        <Text>No photo</Text>
      )}

      <Text>Type</Text>

      {/* Replace with proper segmented control/picker in real UI */}

      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        <Button title="Found" onPress={() => setType('found')} />
        <Button title="Lost" onPress={() => setType('lost')} />
      </View>

      <Text>Title</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Black wallet"
        style={{ borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 }}
      />

      <Text>Description</Text>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Any identifying details"
        style={{ borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 }}
      />

      <Text>Category</Text>

      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="wallet/keys/electronics/..."
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginBottom: 12,
        }}
      />

      <Button title="Save" onPress={save} disabled={!title || !photoUri} />
    </View>
  )
}
```

### `src/screens/HomeListScreen.tsx`

```tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native'
import { listItems } from '../db/sqlite'

export default function HomeListScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([])
  const [text, setText] = useState('')
  const [type, setType] = useState<string | undefined>()
  const [status, setStatus] = useState<string | undefined>()

  const refresh = async () => setItems(await listItems({ text, type, status }))

  useEffect(() => {
    refresh()
  }, [])

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <TextInput
          placeholder="Search..."
          value={text}
          onChangeText={setText}
          style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }}
        />

        <Button title="Go" onPress={refresh} />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <Button
          title="All"
          onPress={() => {
            setType(undefined)
            setStatus(undefined)
            refresh()
          }}
        />

        <Button
          title="Found"
          onPress={() => {
            setType('found')
            refresh()
          }}
        />

        <Button
          title="Lost"
          onPress={() => {
            setType('lost')
            refresh()
          }}
        />

        <Button
          title="Open"
          onPress={() => {
            setStatus('open')
            refresh()
          }}
        />

        <Button
          title="Resolved"
          onPress={() => {
            setStatus('resolved')
            refresh()
          }}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={it => String(it.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ItemDetails', { id: item.id })}
            style={{
              flexDirection: 'row',
              gap: 12,
              paddingVertical: 8,
              borderBottomWidth: 0.5,
            }}
          >
            <Image
              source={{ uri: item.photo_uri }}
              style={{ width: 64, height: 64, borderRadius: 8 }}
            />

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700' }}>
                {item.title} • {item.type}
              </Text>

              <Text numberOfLines={1}>{item.description}</Text>

              <Text style={{ fontSize: 12, opacity: 0.7 }}>
                {item.status} •{' '}
                {item.latitude && item.longitude
                  ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                  : 'No location'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No items yet. Tap + to add.</Text>}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('Camera')}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: '#2d6cdf',
          padding: 16,
          borderRadius: 32,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>＋</Text>
      </TouchableOpacity>
    </View>
  )
}
```

### `src/screens/ItemDetailsScreen.tsx`

```tsx
import React, { useEffect, useState } from 'react'
import { View, Image, Text, Button, Alert } from 'react-native'
import { findItem, updateItemStatus } from '../db/sqlite'

export default function ItemDetailsScreen({ route, navigation }: any) {
  const { id } = route.params
  const [item, setItem] = useState<any>(null)

  const load = async () => setItem(await findItem(id))
  useEffect(() => {
    load()
  }, [])

  if (!item)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading…</Text>
      </View>
    )

  const markResolved = async () => {
    await updateItemStatus(id, 'resolved')

    Alert.alert('Updated', 'Marked as resolved.')

    await load()
  }

  return (
    <View style={{ padding: 12 }}>
      <Image
        source={{ uri: item.photo_uri }}
        style={{ height: 260, borderRadius: 8, marginBottom: 12 }}
      />

      <Text style={{ fontSize: 20, fontWeight: '700' }}>{item.title}</Text>

      <Text>{item.description}</Text>

      <Text style={{ marginTop: 6, opacity: 0.7 }}>
        {item.latitude && item.longitude
          ? `${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`
          : 'No location'}
      </Text>

      <Text style={{ marginTop: 6 }}>Status: {item.status}</Text>

      {item.status === 'open' && (
        <Button title="Mark Resolved" onPress={markResolved} />
      )}
    </View>
  )
}
```

### `src/navigation/AppNavigator.tsx`

```tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeListScreen from '../screens/HomeListScreen'
import AddItemScreen from '../screens/AddItemScreen'
import CameraScreen from '../services/camera'
import ItemDetailsScreen from '../screens/ItemDetailsScreen'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeListScreen}
          options={{ title: 'Foundit' }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: 'Capture' }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ title: 'Add Item' }}
        />
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetailsScreen}
          options={{ title: 'Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

### `src/App.tsx`

```tsx
import React from 'react'
import AppNavigator from './navigation/AppNavigator'
export default function App() {
  return <AppNavigator />
}
```

---

## 9) UX Notes (fast wireframe guidance)

- **Home/List:** Search bar; filter chips (Lost/Found/Open/Resolved); card list with thumbnail, title, coords.
- **FAB “＋”** → Camera; after capture → AddItem form.
- **Details:** Large image; text; coords; “Mark Resolved”.
- **(Optional) Map:** Swap list/map tabs if you add `react-native-maps`.

---

## 10) Privacy & Security

- **Local-only** data in SQLite (no PII beyond user’s text).
- Show clear **permission prompts** explaining value.
- Allow user to **delete entries** (add later if time allows).

---

## 11) Testing Checklist (manual)

- Permission flows: camera allowed/denied; location allowed/denied.
- Create Lost and Found entries with/without GPS.
- Search & filter correctness.
- Details screen correctness; mark resolved persists.
- App restarts keep data.

---

## 12) Performance & Reliability

- Resize/compress images if you see sluggishness (future: `react-native-compressor`).
- Keep list images to \~64–96px thumbnails for smooth scrolling.
- Wrap DB calls with try/catch; pre-open DB at app start.

---

## 13) Weekend Timeline

**Day 1 (Sat)**

- Project + deps + permissions
- DB schema & helpers
- Navigation + HomeList layout
- Camera screen → route param `photoUri`

**Day 2 (Sun)**

- AddItem form + GPS capture
- Insert → list refresh
- Details screen + mark resolved
- Polishing: search/filter, empty states, basic styling
- Manual test pass + README

---

## 14) README Snippet (for your repo)

```
# Foundit (React Native CLI)
A weekend PoC: Lost & Found tracker with camera + GPS + SQLite.

## Features
- Capture item photo
- Auto-tag GPS (when available)
- Local SQLite storage
- Search & filter, mark resolved

## Tech
React Native CLI • react-native-vision-camera • react-native-geolocation-service • react-native-sqlite-storage • React Navigation
```

---

## 15) Roadmap (Post-PoC)

- Map view + radius filter
- Multiple photos, categories UI
- Shareable “Found this?” link
- Cloud sync & auth
- OCR for text on documents
- Duplicate detection / similarity search

---

If you want, I can **package this into a starter repo blueprint** (commands + files you can paste) or tailor it to **Android-only** for fastest success on your machine.
