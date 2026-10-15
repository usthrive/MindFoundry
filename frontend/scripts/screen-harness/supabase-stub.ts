/**
 * Harness stand-in for '@/lib/supabase': no network ever. By default every call
 * rejects. A driver may seed `window.__sbFixture = { <table>: rows[] }`: reads of
 * a seeded table then resolve from those rows, honouring eq / like / is / order,
 * and inserts land in `window.__sbInserts` so the driver can read what a screen
 * recorded (2026-10-15: the hub's status card and the comebacks read the log).
 */
const reject = () => Promise.reject(new Error('harness: supabase disabled'));
const chain: any = new Proxy(() => chain, { get: (_t, k) => (k === 'then' ? undefined : chain), apply: () => chain });
/** A real session shape so services that read `auth.getSession()` reach their fetch (which the driver intercepts). */
const auth = { getSession: async () => ({ data: { session: { access_token: 'harness-token' } }, error: null }), getUser: async () => ({ data: { user: { id: 'harness' } }, error: null }) };

type Row = Record<string, unknown>;
const w = globalThis as unknown as { __sbFixture?: Record<string, Row[]>; __sbInserts?: Array<{ table: string; row: Row }> };
const likeRe = (pat: string) => new RegExp('^' + pat.split('%').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');

function seeded(table: string): any {
  const filters: Array<(r: Row) => boolean> = [];
  let orderKey: string | null = null;
  let single = false;
  let inserted: Row | null = null;
  const q: any = {
    select: () => q,
    eq: (k: string, v: unknown) => (filters.push((r) => r[k] === v), q),
    is: (k: string, v: unknown) => (filters.push((r) => (r[k] ?? null) === v), q),
    like: (k: string, pat: string) => (filters.push((r) => likeRe(pat).test(String(r[k] ?? ''))), q),
    order: (k: string) => ((orderKey = k), q),
    limit: () => q,
    maybeSingle: () => ((single = true), q),
    single: () => ((single = true), q),
    insert: (row: Row) => {
      inserted = row;
      (w.__sbInserts ??= []).push({ table, row });
      return q;
    },
    update: () => q,
    upsert: () => q,
    then: (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) => {
      if (inserted) return Promise.resolve({ data: inserted, error: null }).then(res, rej);
      let rows = (w.__sbFixture?.[table] ?? []).filter((r) => filters.every((f) => f(r)));
      if (orderKey) rows = [...rows].sort((a, b) => String(a[orderKey!]).localeCompare(String(b[orderKey!]), undefined, { numeric: true }));
      return Promise.resolve({ data: single ? (rows[0] ?? null) : rows, error: null }).then(res, rej);
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
