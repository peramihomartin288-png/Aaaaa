// ============================================
// UTILITY FUNCTIONS
// ============================================

// ========== DATE FORMATTING ==========

export function formatDate(dateString) {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('sw-TZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return '-'
  }
}

export function formatTime(dateString) {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('sw-TZ', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '-'
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '-'
  return `${formatDate(dateString)} ${formatTime(dateString)}`
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export function getYesterdayDate() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

// ========== NUMBER FORMATTING ==========

export function formatNumber(num) {
  return num?.toLocaleString() || '0'
}

export function formatBytes(bytes) {
  if (bytes === 0 || !bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ========== TEXT FORMATTING ==========

export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function capitalizeText(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// ========== AVATAR ==========

export function getAvatarColor(name) {
  const colors = [
    '#1e3a5f', '#f59e0b', '#10b981', '#ef4444', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'
  ]
  const index = name?.length % colors.length || 0
  return colors[index]
}

// ========== VALIDATION ==========

export function isRequired(value) {
  return value && value.trim().length > 0
}

export function isValidPhone(phone) {
  if (!phone) return true // Optional field
  return /^[0-9+\s-]{10,15}$/.test(phone)
}

export function isValidEmail(email) {
  if (!email) return true // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUrl(url) {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ========== TOAST ==========

export function showToast(message, type = 'success') {
  const event = new CustomEvent('toast', {
    detail: { message, type }
  })
  window.dispatchEvent(event)
}

// ========== GENERATE ID ==========

export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)
}

// ========== DEBOUNCE ==========

export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// ========== SLEEP ==========

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}