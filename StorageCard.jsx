import React from 'react'
import { formatBytes } from './utils.js'

export default function StorageCard({ providerName, icon, usedBytes, totalBytes, percentage }) {
  const getStatus = (pct) => {
    if (pct >= 95) return { color: '#ef4444', label: 'Critical', bg: '#fee2e2', text: '#991b1b' }
    if (pct >= 80) return { color: '#f59e0b', label: 'Warning', bg: '#fef3c7', text: '#92400e' }
    return { color: '#10b981', label: 'Healthy', bg: '#d1fae5', text: '#065f46' }
  }
  
  const status = getStatus(percentage || 0)
  
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h4 className="font-semibold text-sm">{providerName}</h4>
        </div>
        <span 
          className="badge"
          style={{ background: status.bg, color: status.text }}
        >
          {status.label}
        </span>
      </div>
      
      <div className="progress-bar mb-2">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${Math.min(percentage || 0, 100)}%`,
            background: status.color
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">
          {formatBytes(usedBytes)} / {formatBytes(totalBytes)}
        </span>
        <span className="font-semibold" style={{ color: status.color }}>
          {(percentage || 0).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}