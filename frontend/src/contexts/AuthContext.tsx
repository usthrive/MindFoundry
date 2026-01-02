import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import { getUserChildren } from '@/services/progressService'

type Child = Database['public']['Tables']['children']['Row']

interface AuthContextType {
  user: User | null
  currentChild: Child | null
  children: Child[]
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: Error | null }>
  signup: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  logout: () => Promise<void>
  selectChild: (childId: string) => void
  refreshChildren: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentChild, setCurrentChild] = useState<Child | null>(null)
  const [childrenList, setChildrenList] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadChildren(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadChildren(session.user.id)
      } else {
        setChildrenList([])
        setCurrentChild(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load user's children
  const loadChildren = async (userId: string) => {
    const children = await getUserChildren(userId)
    setChildrenList(children)

    // Auto-select first child if only one
    if (children.length === 1) {
      setCurrentChild(children[0])
      localStorage.setItem('selectedChildId', children[0].id)
    } else {
      // Try to restore previously selected child
      const savedChildId = localStorage.getItem('selectedChildId')
      if (savedChildId) {
        const savedChild = children.find(c => c.id === savedChildId)
        if (savedChild) {
          setCurrentChild(savedChild)
        }
      }
    }
  }

  const refreshChildren = async () => {
    if (user) {
      await loadChildren(user.id)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Load children after successful login
      if (data.user) {
        await loadChildren(data.user.id)
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      // Create auth user with metadata
      // The database trigger will automatically create the profile in public.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Signup failed')

      // Profile is automatically created by database trigger (handle_new_user)
      // No need to manually insert into public.users table

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setCurrentChild(null)
    setChildrenList([])
    localStorage.removeItem('selectedChildId')
  }

  const selectChild = (childId: string) => {
    const child = childrenList.find(c => c.id === childId)
    if (child) {
      setCurrentChild(child)
      localStorage.setItem('selectedChildId', childId)
    }
  }

  const value = {
    user,
    currentChild,
    children: childrenList,
    loading,
    login,
    signup,
    logout,
    selectChild,
    refreshChildren,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
