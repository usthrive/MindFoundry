/**
 * Achievement Service
 * Handles CRUD operations for achievements in Supabase
 */

import { supabase } from '@/lib/supabase';
import {
  Achievement,
  AchievementType,
  AchievementData,
  CelebrationLevel,
  ShareEvent,
  ShareMethod,
  ShareCardFormat,
  ShareCardTheme,
  ParentNotification,
  CelebrationConfig,
  getCelebrationLevel,
} from '@/types/achievements';

// ============================================
// Database Row Types (snake_case from Supabase)
// ============================================

interface AchievementRow {
  id: string;
  child_id: string;
  achievement_type: string;
  achievement_data: AchievementData;
  celebration_level: string;
  earned_at: string;
  shared: boolean;
  share_count: number;
  created_at: string;
}

interface ShareEventRow {
  id: string;
  achievement_id: string;
  child_id: string;
  share_method: string;
  card_format: string | null;
  card_theme: string | null;
  shared_at: string;
}

interface ParentNotificationRow {
  id: string;
  parent_id: string;
  achievement_id: string;
  child_id: string;
  read: boolean;
  responded: boolean;
  response_type: string | null;
  response_content: string | null;
  created_at: string;
  read_at: string | null;
  responded_at: string | null;
}

interface CelebrationConfigRow {
  id: string;
  child_id: string;
  celebrations_enabled: boolean;
  sound_enabled: boolean;
  preferred_theme: string;
  auto_notify_parent: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// Converters
// ============================================

function rowToAchievement(row: AchievementRow): Achievement {
  return {
    id: row.id,
    childId: row.child_id,
    achievementType: row.achievement_type as AchievementType,
    achievementData: row.achievement_data,
    celebrationLevel: row.celebration_level as CelebrationLevel,
    earnedAt: row.earned_at,
    shared: row.shared,
    shareCount: row.share_count,
    createdAt: row.created_at,
  };
}

function rowToShareEvent(row: ShareEventRow): ShareEvent {
  return {
    id: row.id,
    achievementId: row.achievement_id,
    childId: row.child_id,
    shareMethod: row.share_method as ShareMethod,
    cardFormat: row.card_format as ShareCardFormat | undefined,
    cardTheme: row.card_theme as ShareCardTheme | undefined,
    sharedAt: row.shared_at,
  };
}

function rowToParentNotification(row: ParentNotificationRow): ParentNotification {
  return {
    id: row.id,
    parentId: row.parent_id,
    achievementId: row.achievement_id,
    childId: row.child_id,
    read: row.read,
    responded: row.responded,
    responseType: row.response_type as ParentNotification['responseType'],
    responseContent: row.response_content || undefined,
    createdAt: row.created_at,
    readAt: row.read_at || undefined,
    respondedAt: row.responded_at || undefined,
  };
}

function rowToCelebrationConfig(row: CelebrationConfigRow): CelebrationConfig {
  return {
    id: row.id,
    childId: row.child_id,
    celebrationsEnabled: row.celebrations_enabled,
    soundEnabled: row.sound_enabled,
    preferredTheme: row.preferred_theme as ShareCardTheme,
    autoNotifyParent: row.auto_notify_parent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================
// Achievement CRUD
// ============================================

/**
 * Create a new achievement
 */
export async function createAchievement(
  childId: string,
  type: AchievementType,
  data: AchievementData
): Promise<Achievement | null> {
  const celebrationLevel = getCelebrationLevel(type, data);

  const { data: row, error } = await supabase
    .from('achievements')
    .insert({
      child_id: childId,
      achievement_type: type,
      achievement_data: data,
      celebration_level: celebrationLevel,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating achievement:', error);
    return null;
  }

  return rowToAchievement(row as AchievementRow);
}

/**
 * Get all achievements for a child
 */
export async function getChildAchievements(childId: string): Promise<Achievement[]> {
  const { data: rows, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('child_id', childId)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return (rows as AchievementRow[]).map(rowToAchievement);
}

/**
 * Get achievements by type for a child
 */
export async function getAchievementsByType(
  childId: string,
  type: AchievementType
): Promise<Achievement[]> {
  const { data: rows, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('child_id', childId)
    .eq('achievement_type', type)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements by type:', error);
    return [];
  }

  return (rows as AchievementRow[]).map(rowToAchievement);
}

/**
 * Get recent achievements for a child (last N)
 */
export async function getRecentAchievements(
  childId: string,
  limit: number = 10
): Promise<Achievement[]> {
  const { data: rows, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('child_id', childId)
    .order('earned_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent achievements:', error);
    return [];
  }

  return (rows as AchievementRow[]).map(rowToAchievement);
}

/**
 * Check if a specific achievement already exists
 */
export async function hasAchievement(
  childId: string,
  type: AchievementType,
  dataMatch?: Partial<AchievementData>
): Promise<boolean> {
  const query = supabase
    .from('achievements')
    .select('id')
    .eq('child_id', childId)
    .eq('achievement_type', type);

  // For some achievement types, we need to check specific data
  if (dataMatch) {
    // Use containedBy for JSONB matching
    query.contains('achievement_data', dataMatch);
  }

  const { data, error } = await query.limit(1);

  if (error) {
    console.error('Error checking achievement:', error);
    return false;
  }

  return data.length > 0;
}

/**
 * Get achievement count by type
 */
export async function getAchievementCount(
  childId: string,
  type?: AchievementType
): Promise<number> {
  const query = supabase
    .from('achievements')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', childId);

  if (type) {
    query.eq('achievement_type', type);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error counting achievements:', error);
    return 0;
  }

  return count || 0;
}

// ============================================
// Share Event CRUD
// ============================================

/**
 * Record a share event
 */
export async function recordShareEvent(
  achievementId: string,
  childId: string,
  method: ShareMethod,
  cardFormat?: ShareCardFormat,
  cardTheme?: ShareCardTheme
): Promise<ShareEvent | null> {
  const { data: row, error } = await supabase
    .from('share_events')
    .insert({
      achievement_id: achievementId,
      child_id: childId,
      share_method: method,
      card_format: cardFormat || null,
      card_theme: cardTheme || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording share event:', error);
    return null;
  }

  return rowToShareEvent(row as ShareEventRow);
}

/**
 * Get share events for an achievement
 */
export async function getShareEvents(achievementId: string): Promise<ShareEvent[]> {
  const { data: rows, error } = await supabase
    .from('share_events')
    .select('*')
    .eq('achievement_id', achievementId)
    .order('shared_at', { ascending: false });

  if (error) {
    console.error('Error fetching share events:', error);
    return [];
  }

  return (rows as ShareEventRow[]).map(rowToShareEvent);
}

// ============================================
// Parent Notification CRUD
// ============================================

/**
 * Create a parent notification for an achievement
 */
export async function createParentNotification(
  parentId: string,
  achievementId: string,
  childId: string
): Promise<ParentNotification | null> {
  const { data: row, error } = await supabase
    .from('parent_achievement_notifications')
    .insert({
      parent_id: parentId,
      achievement_id: achievementId,
      child_id: childId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating parent notification:', error);
    return null;
  }

  return rowToParentNotification(row as ParentNotificationRow);
}

/**
 * Get unread notifications for a parent
 */
export async function getUnreadNotifications(parentId: string): Promise<ParentNotification[]> {
  const { data: rows, error } = await supabase
    .from('parent_achievement_notifications')
    .select('*')
    .eq('parent_id', parentId)
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching unread notifications:', error);
    return [];
  }

  return (rows as ParentNotificationRow[]).map(rowToParentNotification);
}

/**
 * Get all notifications for a parent
 */
export async function getParentNotifications(
  parentId: string,
  limit: number = 50
): Promise<ParentNotification[]> {
  const { data: rows, error } = await supabase
    .from('parent_achievement_notifications')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching parent notifications:', error);
    return [];
  }

  return (rows as ParentNotificationRow[]).map(rowToParentNotification);
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<boolean> {
  const { error } = await supabase
    .from('parent_achievement_notifications')
    .update({
      read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification read:', error);
    return false;
  }

  return true;
}

/**
 * Send encouragement response to child
 */
export async function sendEncouragement(
  notificationId: string,
  responseType: 'encouragement' | 'reaction' | 'message',
  responseContent: string
): Promise<boolean> {
  const { error } = await supabase
    .from('parent_achievement_notifications')
    .update({
      responded: true,
      response_type: responseType,
      response_content: responseContent,
      responded_at: new Date().toISOString(),
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Error sending encouragement:', error);
    return false;
  }

  return true;
}

/**
 * Get unread encouragement responses for a child
 */
export async function getChildEncouragements(childId: string): Promise<ParentNotification[]> {
  const { data: rows, error } = await supabase
    .from('parent_achievement_notifications')
    .select('*')
    .eq('child_id', childId)
    .eq('responded', true)
    .order('responded_at', { ascending: false });

  if (error) {
    console.error('Error fetching child encouragements:', error);
    return [];
  }

  return (rows as ParentNotificationRow[]).map(rowToParentNotification);
}

// ============================================
// Celebration Config CRUD
// ============================================

/**
 * Get or create celebration config for a child
 */
export async function getCelebrationConfig(childId: string): Promise<CelebrationConfig | null> {
  // Try to get existing config
  const { data: existing, error: fetchError } = await supabase
    .from('celebration_config')
    .select('*')
    .eq('child_id', childId)
    .single();

  if (existing) {
    return rowToCelebrationConfig(existing as CelebrationConfigRow);
  }

  // Create default config if not exists
  if (fetchError && fetchError.code === 'PGRST116') {
    const { data: created, error: createError } = await supabase
      .from('celebration_config')
      .insert({ child_id: childId })
      .select()
      .single();

    if (createError) {
      console.error('Error creating celebration config:', createError);
      return null;
    }

    return rowToCelebrationConfig(created as CelebrationConfigRow);
  }

  console.error('Error fetching celebration config:', fetchError);
  return null;
}

/**
 * Update celebration config
 */
export async function updateCelebrationConfig(
  childId: string,
  updates: Partial<Omit<CelebrationConfig, 'id' | 'childId' | 'createdAt' | 'updatedAt'>>
): Promise<CelebrationConfig | null> {
  const dbUpdates: Record<string, unknown> = {};

  if (updates.celebrationsEnabled !== undefined) {
    dbUpdates.celebrations_enabled = updates.celebrationsEnabled;
  }
  if (updates.soundEnabled !== undefined) {
    dbUpdates.sound_enabled = updates.soundEnabled;
  }
  if (updates.preferredTheme !== undefined) {
    dbUpdates.preferred_theme = updates.preferredTheme;
  }
  if (updates.autoNotifyParent !== undefined) {
    dbUpdates.auto_notify_parent = updates.autoNotifyParent;
  }

  const { data: row, error } = await supabase
    .from('celebration_config')
    .update(dbUpdates)
    .eq('child_id', childId)
    .select()
    .single();

  if (error) {
    console.error('Error updating celebration config:', error);
    return null;
  }

  return rowToCelebrationConfig(row as CelebrationConfigRow);
}

// ============================================
// Export all functions
// ============================================

export const achievementService = {
  // Achievements
  createAchievement,
  getChildAchievements,
  getAchievementsByType,
  getRecentAchievements,
  hasAchievement,
  getAchievementCount,

  // Share events
  recordShareEvent,
  getShareEvents,

  // Parent notifications
  createParentNotification,
  getUnreadNotifications,
  getParentNotifications,
  markNotificationRead,
  sendEncouragement,
  getChildEncouragements,

  // Config
  getCelebrationConfig,
  updateCelebrationConfig,
};

export default achievementService;
