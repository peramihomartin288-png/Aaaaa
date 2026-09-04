import React from 'react'

export default function Toast({ message, type = 'success' }) {
  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }
  
  return (
    <div className="toast" style={{ background: bgColor }}>
      <span>{icons[type] || '✅'}</span>
      <span>{message}</span>
    </div>
  )
}