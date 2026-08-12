/**
 * bbNotebookStore — the child's working, kept for the whole level.
 *
 * The scratch pad used to hold strokes in a module-scoped Map: they survived
 * navigation inside one session and nothing else. A tablet restart lost them,
 * and there was no way to look back at how a child had worked.
 *
 * WHY INDEXEDDB, MEASURED. A level is 24–26 weeks, ~31 items a week. At the raw
 * `Stroke[]` shape (`{x: 123.45, y: 678.9}` ≈ 23 bytes a point) that is
 * **5.4–5.9 MB a level**, which does not fit a ~5 MB localStorage origin quota
 * that the rest of the app already shares. Quantising coordinates to integers
 * and delta-encoding them takes it to **~1.3 MB** — which would fit, but
 * localStorage is SYNCHRONOUS, and writing megabytes on the drawing path is
 * exactly where a child would feel it. IndexedDB is async and has room for
 * siblings on one device.
 *
 * The compaction is lossy by ONE pixel, deliberately: pointer coordinates are
 * rounded to integers. Nothing downstream measures a stroke — this is a picture
 * of a child's thinking, not data — and a pixel of rounding is invisible at any
 * size the pad renders.
 *
 * NOTE ON THE PROMISE MADE TO THE CHILD. The pad says "Nobody marks this", and
 * that stays true: nothing here grades, scores or feeds mastery. Retention makes
 * the working reviewable by a parent, never markable by the system.
 */

import type { Stroke } from '@/components/ui/ScratchPad';

const DB_NAME = 'bb-notebook';
const DB_VERSION = 1;
const STORE = 'pages';

/** One page of working: an item the child drew on, with enough to render it back. */
export interface NotebookPage {
  /** `${childId}::${level}::${packId}::${itemId}` — the primary key. */
  id: string;
  childId: string;
  level: string;
  week: number;
  packId: string;
  itemId: string;
  /** The question as it was asked, so a page can be read without the pack. */
  prompt: string;
  /** Compact strokes; decode with `decodeStrokes`. */
  data: CompactStroke[];
  updatedAt: number;
}

/** `[color, width, x0, y0, dx1, dy1, dx2, dy2, …]` — origin absolute, rest deltas. */
export type CompactStroke = [string, number, ...number[]];

export const pageId = (childId: string, level: string, packId: string, itemId: string): string =>
  `${childId}::${level}::${packId}::${itemId}`;

// ---------------------------------------------------------------------------
// Compaction
// ---------------------------------------------------------------------------

export function encodeStrokes(strokes: readonly Stroke[]): CompactStroke[] {
  const out: CompactStroke[] = [];
  for (const s of strokes) {
    if (!s.points?.length) continue;
    const nums: number[] = [];
    let px = Math.round(s.points[0].x);
    let py = Math.round(s.points[0].y);
    nums.push(px, py);
    for (let i = 1; i < s.points.length; i++) {
      const x = Math.round(s.points[i].x);
      const y = Math.round(s.points[i].y);
      nums.push(x - px, y - py);
      px = x;
      py = y;
    }
    out.push([s.color, s.width, ...nums]);
  }
  return out;
}

export function decodeStrokes(compact: readonly CompactStroke[] | undefined): Stroke[] {
  if (!compact?.length) return [];
  const out: Stroke[] = [];
  for (const c of compact) {
    const [color, width, ...nums] = c;
    if (nums.length < 2) continue;
    let x = nums[0];
    let y = nums[1];
    const points = [{ x, y }];
    for (let i = 2; i + 1 < nums.length; i += 2) {
      x += nums[i];
      y += nums[i + 1];
      points.push({ x, y });
    }
    out.push({ color, width, points });
  }
  return out;
}

// ---------------------------------------------------------------------------
// IndexedDB, wrapped thinly. Every path is best-effort: a child must be able to
// draw on a device with storage disabled, so nothing here may throw upward.
// ---------------------------------------------------------------------------

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    let req: IDBOpenDBRequest;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch {
      return resolve(null);
    }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: 'id' });
        // Level is the retention unit; child+level is how a notebook is gathered.
        os.createIndex('childLevel', ['childId', 'level'], { unique: false });
        os.createIndex('child', 'childId', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });
  return dbPromise;
}

function tx(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
  return db.transaction(STORE, mode).objectStore(STORE);
}

/** Write one page. Deletes the row instead when the child has cleared the pad. */
export async function savePage(page: Omit<NotebookPage, 'updatedAt'>): Promise<void> {
  const db = await openDb();
  if (!db) return;
  try {
    const store = tx(db, 'readwrite');
    if (!page.data.length) store.delete(page.id);
    else store.put({ ...page, updatedAt: Date.now() });
  } catch {
    /* storage is a convenience; never break the pad */
  }
}

export async function loadPage(id: string): Promise<NotebookPage | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const req = tx(db, 'readonly').get(id);
      req.onsuccess = () => resolve((req.result as NotebookPage) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/** Every page a child drew in one level, oldest first — the notebook's contents. */
export async function loadLevel(childId: string, level: string): Promise<NotebookPage[]> {
  const db = await openDb();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const req = tx(db, 'readonly').index('childLevel').getAll([childId, level]);
      req.onsuccess = () => {
        const rows = (req.result as NotebookPage[]) ?? [];
        rows.sort((a, b) => a.week - b.week || a.itemId.localeCompare(b.itemId));
        resolve(rows);
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

/** Which levels this child has working for, so a notebook can be offered per level. */
export async function levelsWithWork(childId: string): Promise<{ level: string; pages: number }[]> {
  const db = await openDb();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const req = tx(db, 'readonly').index('child').getAll(childId);
      req.onsuccess = () => {
        const counts = new Map<string, number>();
        for (const r of (req.result as NotebookPage[]) ?? []) counts.set(r.level, (counts.get(r.level) ?? 0) + 1);
        resolve([...counts.entries()].map(([level, pages]) => ({ level, pages })).sort((a, b) => a.level.localeCompare(b.level)));
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

/**
 * Retention: keep the levels a child is working through, drop the rest.
 *
 * Called with the levels worth keeping (normally the current one and the one
 * before it, so a notebook stays downloadable after a promotion). Retention is
 * by LEVEL rather than by date because that is the unit a family thinks in —
 * "his Level B notebook" — and because it makes the bound predictable: one level
 * of working is ~1.3 MB compact, measured, not guessed.
 */
export async function pruneToLevels(childId: string, keep: readonly string[]): Promise<number> {
  const db = await openDb();
  if (!db) return 0;
  const keepSet = new Set(keep);
  return new Promise((resolve) => {
    try {
      const store = tx(db, 'readwrite');
      const req = store.index('child').getAllKeys(childId);
      req.onsuccess = () => {
        const all = (req.result as IDBValidKey[]) ?? [];
        let dropped = 0;
        for (const key of all) {
          const level = String(key).split('::')[1];
          if (!keepSet.has(level)) {
            store.delete(key);
            dropped++;
          }
        }
        resolve(dropped);
      };
      req.onerror = () => resolve(0);
    } catch {
      resolve(0);
    }
  });
}

/** Test seam: forget the cached connection so a fresh open is attempted. */
export function _resetForTests(): void {
  dbPromise = null;
}
