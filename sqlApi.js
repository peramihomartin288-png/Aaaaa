// ============================================
// SQL EDITOR API (Edge Function)
// ============================================

import config from './index.js'

// ========== RUN SQL QUERY ==========

export async function runSqlQuery(queryText) {
  try {
    const response = await fetch(config.sqlEditor.edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queryText
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Query imeshindikana')
    }
    
    return {
      success: true,
      data: data,
      rowsAffected: data.length || 0,
      executionTime: data.executionTime || 0
    }
  } catch (error) {
    console.error('SQL query error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// ========== SAVE QUERY HISTORY (LocalStorage) ==========

export function saveQueryHistory(queryText, success, errorMessage = null) {
  try {
    const history = getQueryHistory()
    
    history.unshift({
      id: Date.now().toString(36),
      query: queryText,
      success: success,
      error: errorMessage,
      timestamp: new Date().toISOString()
    })
    
    // Keep last 50 queries
    const limitedHistory = history.slice(0, 50)
    
    localStorage.setItem('kmcam_sql_history', JSON.stringify(limitedHistory))
    return limitedHistory
  } catch (error) {
    console.error('Save history error:', error)
    return []
  }
}

export function getQueryHistory() {
  try {
    const history = localStorage.getItem('kmcam_sql_history')
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

export function clearQueryHistory() {
  localStorage.removeItem('kmcam_sql_history')
}

// ========== SAVED QUERIES (LocalStorage) ==========

export function saveQuery(name, queryText) {
  try {
    const saved = getSavedQueries()
    
    saved.unshift({
      id: Date.now().toString(36),
      name: name,
      query: queryText,
      savedAt: new Date().toISOString()
    })
    
    localStorage.setItem('kmcam_sql_saved', JSON.stringify(saved))
    return saved
  } catch (error) {
    console.error('Save query error:', error)
    return []
  }
}

export function getSavedQueries() {
  try {
    const saved = localStorage.getItem('kmcam_sql_saved')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function deleteSavedQuery(queryId) {
  try {
    const saved = getSavedQueries()
    const updated = saved.filter(q => q.id !== queryId)
    localStorage.setItem('kmcam_sql_saved', JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Delete saved query error:', error)
    return []
  }
}

// ========== COMMON QUERIES ==========

export const commonQueries = [
  {
    name: 'View All Users',
    query: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 100;'
  },
  {
    name: 'View All Posts',
    query: 'SELECT * FROM posts ORDER BY created_at DESC LIMIT 100;'
  },
  {
    name: 'View All Cards',
    query: 'SELECT * FROM cards ORDER BY created_at DESC LIMIT 100;'
  },
  {
    name: 'Count Users',
    query: 'SELECT COUNT(*) as total_users FROM users;'
  },
  {
    name: 'Count Posts',
    query: 'SELECT COUNT(*) as total_posts FROM posts;'
  },
  {
    name: 'View All Owners',
    query: "SELECT * FROM users WHERE user_type IN ('owner', 'super_admin', 'step_admin', 'moderator');"
  },
  {
    name: 'View Recent Notifications',
    query: 'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50;'
  },
  {
    name: 'View Media Assets',
    query: 'SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 100;'
  }
]