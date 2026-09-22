/** Harness stand-in for '@/lib/supabase': every call rejects; no network ever. */
const reject = () => Promise.reject(new Error('harness: supabase disabled'));
const chain: any = new Proxy(() => chain, { get: (_t, k) => (k === 'then' ? undefined : chain), apply: () => chain });
/** A real session shape so services that read `auth.getSession()` reach their fetch (which the driver intercepts). */
const auth = { getSession: async () => ({ data: { session: { access_token: 'harness-token' } }, error: null }), getUser: async () => ({ data: { user: { id: 'harness' } }, error: null }) };
export const supabase: any = new Proxy({}, { get: (_t, k) => (k === 'rpc' ? reject : k === 'auth' ? auth : () => chain) });
export default supabase;
