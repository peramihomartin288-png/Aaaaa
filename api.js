// ============================================
// SUPABASE API FUNCTIONS
// ============================================

import supabase from './supabase.js'

// ========== DASHBOARD ==========

export async function getDashboardStats() {
  try {
    const [usersCount, postsCount, downloadsToday, likesToday] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'user'),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('downloads').select('*', { count: 'exact', head: true }).gte('downloaded_at', new Date().toDateString()),
      supabase.from('likes').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toDateString())
    ])
    
    return {
      totalUsers: usersCount.count || 0,
      totalPosts: postsCount.count || 0,
      downloadsToday: downloadsToday.count || 0,
      likesToday: likesToday.count || 0
    }
  } catch (error) {
    console.error('Dashboard stats error:', error)
    throw error
  }
}

export async function getRecentActivity(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select(`
        id,
        event_type,
        created_at,
        users (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Recent activity error:', error)
    return []
  }
}

// ========== USERS ==========

export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_type', 'user')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get users error:', error)
    throw error
  }
}

export async function getUserDetails(userId) {
  try {
    const [user, points, postsCount, likesCount, commentsCount, downloadsCount] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('user_points').select('*').eq('user_id', userId).single(),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('likes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('downloads').select('*', { count: 'exact', head: true }).eq('user_id', userId)
    ])
    
    return {
      user: user.data,
      points: points.data,
      stats: {
        posts: postsCount.count || 0,
        likes: likesCount.count || 0,
        comments: commentsCount.count || 0,
        downloads: downloadsCount.count || 0
      }
    }
  } catch (error) {
    console.error('User details error:', error)
    throw error
  }
}

export async function toggleUserStatus(userId, isActive) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ is_active: isActive })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Toggle user error:', error)
    throw error
  }
}

export async function deleteUser(userId) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete user error:', error)
    throw error
  }
}

// ========== CARDS ==========

export async function getCardsByType(cardType) {
  try {
    let query
    
    if (cardType === 'watakatifu') {
      query = supabase.from('watakatifu_cards').select('*, cards(*)')
    } else if (cardType === 'bible_verse') {
      query = supabase.from('bible_verse_cards').select('*, cards(*)')
    } else if (cardType === 'masomo') {
      query = supabase.from('masomo_dominika_cards').select('*, cards(*)')
    } else if (cardType === 'wimbo') {
      query = supabase.from('wimbo_siku_cards').select('*, cards(*)')
    } else {
      query = supabase.from('cards').select('*').eq('card_type', cardType)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get cards error:', error)
    throw error
  }
}

export async function createCard(cardData, cardDetails) {
  try {
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .insert({
        card_type: cardData.card_type,
        title: cardData.title,
        description: cardData.description,
        start_date: cardData.start_date,
        end_date: cardData.end_date,
        is_active: cardData.is_active !== false,
        is_published: cardData.is_published !== false,
        created_by: cardData.created_by
      })
      .select()
      .single()
    
    if (cardError) throw cardError
    
    const detailsWithCardId = { ...cardDetails, card_id: card.id }
    
    let tableName = ''
    if (cardData.card_type === 'watakatifu') tableName = 'watakatifu_cards'
    else if (cardData.card_type === 'bible_verse') tableName = 'bible_verse_cards'
    else if (cardData.card_type === 'masomo') tableName = 'masomo_dominika_cards'
    else if (cardData.card_type === 'wimbo') tableName = 'wimbo_siku_cards'
    
    const { data: details, error: detailsError } = await supabase
      .from(tableName)
      .insert(detailsWithCardId)
      .select()
      .single()
    
    if (detailsError) throw detailsError
    
    return { card, details }
  } catch (error) {
    console.error('Create card error:', error)
    throw error
  }
}

export async function deleteCard(cardId) {
  try {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', cardId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete card error:', error)
    throw error
  }
}

// ========== POSTS ==========

export async function getAllPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_media (*),
        post_audio (*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get posts error:', error)
    throw error
  }
}

export async function createPost(postData, mediaFiles = []) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single()
    
    if (error) throw error
    
    if (mediaFiles.length > 0) {
      const mediaToInsert = mediaFiles.map((file, index) => ({
        post_id: post.id,
        media_type: file.media_type || 'image',
        media_url: file.media_url || file.url,
        media_order: index
      }))
      
      const { error: mediaError } = await supabase
        .from('post_media')
        .insert(mediaToInsert)
      
      if (mediaError) throw mediaError
    }
    
    return post
  } catch (error) {
    console.error('Create post error:', error)
    throw error
  }
}

export async function deletePost(postId) {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete post error:', error)
    throw error
  }
}

// ========== OWNERS ==========

export async function getAllOwners() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('user_type', ['owner', 'super_admin', 'step_admin', 'moderator'])
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get owners error:', error)
    throw error
  }
}

export async function createOwner(ownerData) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        full_name: ownerData.full_name,
        phone: ownerData.phone,
        pin: ownerData.pin,
        user_type: ownerData.user_type || 'step_admin',
        permissions: ownerData.permissions || {},
        is_owner: true,
        is_active: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Create owner error:', error)
    throw error
  }
}

export async function updateOwner(ownerId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', ownerId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Update owner error:', error)
    throw error
  }
}

export async function deleteOwner(ownerId) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', ownerId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete owner error:', error)
    throw error
  }
}

// ========== NOTIFICATIONS ==========

export async function sendNotification(notificationData) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Send notification error:', error)
    throw error
  }
}

export async function getAllNotifications() {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get notifications error:', error)
    throw error
  }
}

// ========== HISTORY ==========

export async function getHistory() {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('history_date', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get history error:', error)
    throw error
  }
}

export async function addHistoryEntry(historyData) {
  try {
    const { data, error } = await supabase
      .from('history')
      .insert(historyData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Add history error:', error)
    throw error
  }
}

// ========== ANALYTICS ==========

export async function getAnalyticsEvents(eventType, days = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', eventType)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Analytics events error:', error)
    return []
  }
}

// ========== SETTINGS ==========

export async function getAppearanceSettings() {
  try {
    const { data, error } = await supabase
      .from('appearance_settings')
      .select('*')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get appearance error:', error)
    throw error
  }
}

export async function updateAppearanceSetting(key, value) {
  try {
    const { data, error } = await supabase
      .from('appearance_settings')
      .update({ setting_value: value })
      .eq('setting_key', key)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Update appearance error:', error)
    throw error
  }
}

export async function getIntroContent() {
  try {
    const { data, error } = await supabase
      .from('intro_content')
      .select('*')
      .limit(1)
      .single()
    
    if (error) return null
    return data
  } catch (error) {
    console.error('Get intro error:', error)
    return null
  }
}

export async function updateIntroContent(content) {
  try {
    const { data, error } = await supabase
      .from('intro_content')
      .update(content)
      .eq('id', content.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Update intro error:', error)
    throw error
  }
}