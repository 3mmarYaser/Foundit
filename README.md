# Foundit

Lost & Found tracker with Camera + Gallery + GPS + SQLite + Firebase + Supabase.

> _Show demo on [YouTube](https://youtube.com/shorts/mbxrZXxTBrM)_
  
### Features

- Capture item photo / attach image
- Auto-tag GPS (when available)
- Determine type either lost or found
- Add title, description, and category
- Local SQLite storage
- Remote Firebase & Supabase integration
- Search & filter, mark resolved

### Tech Choices

- **RN CLI** (no Expo).
- **Navigation:** `@react-navigation/native` (Stack).
- **Camera:** `react-native-vision-camera` • `react-native-image-picker`.
- **Location:** `react-native-geolocation-service`.
- **DB:** `react-native-sqlite-storage`, `@react-native-firebase/firestore`, `@supabase/supabase-js`
- **State:** lightweight Context.

### Future plan

- Map integration: Swap list/map views.
- Push notifications, chat between users.
- OCR / similarity matching.

---
---

### File structure

```
src
├── components
│   ├── BottomNav.tsx
│   ├── FAB.tsx
│   ├── ImagePicker.tsx
│   ├── InputField.tsx
│   ├── ItemCard.tsx
│   ├── LocationDetector.tsx
│   ├── PrimaryButton.tsx
│   ├── TabButton.tsx
│   └── TopBar.tsx
├── constants
│   └── icons.tsx
├── data
│   ├── mappers
│   │   └── itemMapper.ts
│   ├── repos
│   │   └── itemsRepo.ts
│   └── sources
│       ├── local
│       │   ├── itemsSQLiteDS.ts
│       │   └── schema.ts
│       └── remote
│           ├── itemsFirebaseDS.ts
│           └── supaStorageDS.ts
├── domain
│   ├── entities
│   │   └── Item.ts
│   ├── repos
│   │   └── ItemRepoInterface.ts
│   └── usecases
│       ├── RemoveItemUC.ts
│       ├── ReportItemUC.ts
│       ├── ToggleResolvedUC.ts
│       └── UpdateItemUC.ts
├── helpers
│   ├── Camera.ts
│   ├── Gallery.ts
│   ├── Location.ts
│   └── Permissions.android.ts
├── navigation
│   ├── NavStack.tsx
│   ├── ScreenKeys.ts
│   └── Screens.tsx
├── providers
│   ├── AppContext.tsx
│   └── AppProvider.tsx
├── screens
│   ├── Details.screen.tsx
│   ├── Details.style.tsx
│   ├── Home.screen.tsx
│   ├── Report.screen.tsx
│   ├── Report.style.tsx
│   └── Splash.screen.tsx
├── services
│   ├── db
│   │   └── sqlite.ts
│   ├── firebase
│   │   └── firestore.ts
│   ├── storage
│   │   ├── cache
│   │   │   └── cache.service.ts
│   │   ├── helper.ts
│   │   └── supabase
│   │       ├── client.ts
│   │       └── storage.service.ts
│   └── sync
│       └── syncService.ts
├── theme
│   ├── Colors.ts
│   ├── Global.style.tsx
│   └── typography.ts
└── types
    ├── LatLong.ts
    └── Tab.ts
```

---
---

## Business Foundations

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

## Scope & Feature Set

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

---

## User Stories & Acceptance Criteria

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

## Data Model (SQLite)

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

## Privacy & Security

- **Local-only** data in SQLite (no PII beyond user’s text).
- Show clear **permission prompts** explaining value.
- Allow user to **delete entries** (add later if time allows).

---

## Testing Checklist (manual)

- Permission flows: camera allowed/denied; location allowed/denied.
- Create Lost and Found entries with/without GPS.
- Search & filter correctness.
- Details screen correctness; mark resolved persists.
- App restarts keep data.

---

## Performance & Reliability

- Resize/compress images if you see sluggishness (future: `react-native-compressor`).
- Keep list images to \~64–96px thumbnails for smooth scrolling.
- Wrap DB calls with try/catch; pre-open DB at app start.

---

## Roadmap (Post-PoC)

- Map view + radius filter
- Multiple photos, categories UI
- Shareable “Found this?” link
- Cloud sync & auth
- OCR for text on documents
- Duplicate detection / similarity search
