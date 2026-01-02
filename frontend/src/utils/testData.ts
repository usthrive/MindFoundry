import { supabase } from '@/lib/supabase'

/**
 * Create a test child profile for a user
 * This is a temporary utility for testing until we build the "Add Child" UI
 */
export async function createTestChild(userId: string) {
  const { data, error } = await supabase
    .from('children')
    .insert({
      user_id: userId,
      name: 'Emma',
      age: 7,
      grade_level: 1,
      avatar: '🦄',
      current_level: 'A',
      current_worksheet: 1,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating test child:', error)
    return null
  }

  return data
}

/**
 * Alternative: Create multiple test children
 */
export async function createMultipleTestChildren(userId: string) {
  const children = [
    {
      user_id: userId,
      name: 'Emma',
      age: 7,
      grade_level: 1,
      avatar: '🦄',
      current_level: 'A',
      current_worksheet: 1,
    },
    {
      user_id: userId,
      name: 'Noah',
      age: 9,
      grade_level: 3,
      avatar: '🚀',
      current_level: 'C',
      current_worksheet: 50,
    },
  ]

  const { data, error } = await supabase
    .from('children')
    .insert(children)
    .select()

  if (error) {
    console.error('Error creating test children:', error)
    return []
  }

  return data
}
