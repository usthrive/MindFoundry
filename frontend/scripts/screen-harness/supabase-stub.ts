/** Harness stand-in for '@/lib/supabase': every call rejects; no network ever. */
const reject = () => Promise.reject(new Error('harness: supabase disabled'));
const chain: any = new Proxy(() => chain, { get: (_t, k) => (k === 'then' ? undefined : chain), apply: () => chain });
export const supabase: any = new Proxy({}, { get: (_t, k) => (k === 'rpc' ? reject : () => chain) });
export default supabase;
