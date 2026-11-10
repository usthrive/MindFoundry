/**
 * Harness stand-in for '@/contexts/AuthContext' (2026-11-10): a signed-in parent with
 * one child, `window.__harnessChild`, so the real Kumon StudyPage and the parent
 * progress card can mount with no network. Only the harness build aliases this in.
 */
import type { ReactNode } from 'react'

const w = globalThis as unknown as { __harnessChild?: Record<string, unknown> }

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

const value = () => {
  const child = w.__harnessChild ?? null
  return {
    user: { id: 'harness-parent', email: 'parent@harness.local' },
    currentChild: child,
    children: child ? [child] : [],
    loading: false,
    login: async () => ({ error: null }),
    signup: async () => ({ error: null }),
    signInWithGoogle: async () => ({ error: null }),
    logout: async () => {},
    selectChild: () => {},
    clearCurrentChild: () => {},
    refreshChildren: async () => {},
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAuth(): any {
  return value()
}
