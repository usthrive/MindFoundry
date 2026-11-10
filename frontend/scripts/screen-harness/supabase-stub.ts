/**
 * Harness stand-in for '@/lib/supabase': no network ever. By default every call
 * rejects. A driver may seed `window.__sbFixture = { <table>: rows[] }`: reads of
 * a seeded table then resolve from those rows, honouring eq / like / is / in /
 * order, and inserts land in `window.__sbInserts` so the driver can read what a
 * screen recorded (2026-10-15: the hub's status card and the comebacks read the log).
 *
 * 2026-11-10 (the Kumon StudyPage harness): an inserted row comes back with an id;
 * updates and deletes are logged in `window.__sbUpdates`; and with
 * `window.__sbApplyUpdates = true` inserts, updates and deletes are APPLIED to the
 * seeded rows, so a page that writes and then reads (a sheet's record, the child's
 * position) sees its own writes. Off by default: the Best Brains drivers are unchanged.
 */
const reject = () => Promise.reject(new Error('harness: supabase disabled'));
const chain: any = new Proxy(() => chain, { get: (_t, k) => (k === 'then' ? undefined : chain), apply: () => chain });
/** A real session shape so services that read `auth.getSession()` reach their fetch (which the driver intercepts). */
const auth = { getSession: async () => ({ data: { session: { access_token: 'harness-token' } }, error: null }), getUser: async () => ({ data: { user: { id: 'harness' } }, error: null }) };

type Row = Record<string, unknown>;
const w = globalThis as unknown as {
  __sbFixture?: Record<string, Row[]>;
  __sbInserts?: Array<{ table: string; row: Row }>;
  __sbUpdates?: Array<{ table: string; row: Row | null; matched: number; op: 'update' | 'delete' }>;
  __sbApplyUpdates?: boolean;
};
const likeRe = (pat: string) => new RegExp('^' + pat.split('%').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
let nextId = 1;

function seeded(table: string): any {
  const filters: Array<(r: Row) => boolean> = [];
  let orderKey: string | null = null;
  let orderAsc = true;
  let single = false;
  let inserted: Row | null = null;
  let updated: Row | null = null;
  let deleting = false;
  const q: any = {
    select: () => q,
    eq: (k: string, v: unknown) => (filters.push((r) => r[k] === v), q),
    neq: (k: string, v: unknown) => (filters.push((r) => r[k] !== v), q),
    is: (k: string, v: unknown) => (filters.push((r) => (r[k] ?? null) === v), q),
    in: (k: string, vs: unknown[]) => (filters.push((r) => vs.includes(r[k])), q),
    like: (k: string, pat: string) => (filters.push((r) => likeRe(pat).test(String(r[k] ?? ''))), q),
    gte: () => q, lte: () => q, gt: () => q, lt: () => q, range: () => q, not: () => q, or: () => q, filter: () => q,
    order: (k: string, o?: { ascending?: boolean }) => ((orderKey = k), (orderAsc = o?.ascending !== false), q),
    limit: () => q,
    maybeSingle: () => ((single = true), q),
    single: () => ((single = true), q),
    insert: (row: Row | Row[]) => {
      const r = Array.isArray(row) ? row[0] : row;
      inserted = { id: r.id ?? `harness-${table}-${nextId++}`, created_at: new Date().toISOString(), ...r };
      (w.__sbInserts ??= []).push({ table, row: w.__sbApplyUpdates ? inserted : r });
      if (w.__sbApplyUpdates && w.__sbFixture?.[table]) w.__sbFixture[table].push(inserted);
      return q;
    },
    update: (row: Row) => ((updated = row), q),
    delete: () => ((deleting = true), q),
    upsert: () => q,
    then: (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) => {
      if (inserted) return Promise.resolve({ data: inserted, error: null }).then(res, rej);
      const rows = (w.__sbFixture?.[table] ?? []).filter((r) => filters.every((f) => f(r)));
      if (updated || deleting) {
        (w.__sbUpdates ??= []).push({ table, row: updated, matched: rows.length, op: deleting ? 'delete' : 'update' });
        if (w.__sbApplyUpdates && w.__sbFixture?.[table]) {
          if (deleting) w.__sbFixture[table] = w.__sbFixture[table].filter((r) => !rows.includes(r));
          else for (const r of rows) Object.assign(r, JSON.parse(JSON.stringify(updated)));
        }
        return Promise.resolve({ data: rows, error: null }).then(res, rej);
      }
      let out = rows;
      // Descending order only in the opt-in mode (the Best Brains drivers were built on ascending).
      const dir = w.__sbApplyUpdates && !orderAsc ? -1 : 1;
      if (orderKey) out = [...rows].sort((a, b) => dir * String(a[orderKey!]).localeCompare(String(b[orderKey!]), undefined, { numeric: true }));
      return Promise.resolve({ data: single ? (out[0] ?? null) : out, error: null }).then(res, rej);
    },
  };
  return q;
}

export const supabase: any = new Proxy({}, {
  get: (_t, k) =>
    k === 'rpc' ? reject
    : k === 'auth' ? auth
    : k === 'from' ? (table: string) => (w.__sbFixture?.[table] ? seeded(table) : chain)
    : () => chain,
});
export default supabase;
