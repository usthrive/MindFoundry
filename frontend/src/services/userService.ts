import { supabase } from '@/lib/supabase'
import { getInitialLevelForGrade } from '@/utils/levelMapping'

export type UserType = 'parent' | 'student'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  user_type: UserType | null
  tier: string
  parent_pin: string | null
  created_at: string
  updated_at: string
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

export async function updateUserType(userId: string, userType: UserType): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ user_type: userType })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user type:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateUserType:', error)
    return false
  }
}

export async function createStudentProfile(
  userId: string,
  name: string,
  age: number,
  gradeLevel: number,
  avatar: string
): Promise<boolean> {
  try {
    // First, set user as student
    const typeUpdated = await updateUserType(userId, 'student')
    if (!typeUpdated) return false

    // Get appropriate Kumon level based on grade
    const initialLevel = getInitialLevelForGrade(gradeLevel)

    // Create child profile for the student
    const { error } = await supabase.from('children').insert({
      user_id: userId,
      name,
      age,
      grade_level: gradeLevel,
      avatar,
      current_level: initialLevel, // Grade-appropriate starting level
      current_worksheet: 1,
    })

    if (error) {
      console.error('Error creating student profile:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in createStudentProfile:', error)
    return false
  }
}

/**
 * Set parent PIN for child profile switching protection
 */
export async function setParentPin(userId: string, pin: string): Promise<boolean> {
  try {
    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(pin)) {
      console.error('Invalid PIN format: must be 4 digits')
      return false
    }

    const { error } = await supabase
      .from('users')
      .update({ parent_pin: pin })
      .eq('id', userId)

    if (error) {
      console.error('Error setting parent PIN:', error)
      return false
    }

    console.log('✅ Parent PIN set successfully')
    return true
  } catch (error) {
    console.error('Error in setParentPin:', error)
    return false
  }
}

/**
 * Get parent PIN for a user
 */
export async function getParentPin(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('parent_pin')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching parent PIN:', error)
      return null
    }

    return data?.parent_pin || null
  } catch (error) {
    console.error('Error in getParentPin:', error)
    return null
  }
}

/**
 * Verify parent PIN
 */
export async function verifyParentPin(userId: string, pin: string): Promise<boolean> {
  try {
    const storedPin = await getParentPin(userId)
    if (!storedPin) return false
    return storedPin === pin
  } catch (error) {
    console.error('Error in verifyParentPin:', error)
    return false
  }
}