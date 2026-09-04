import React from 'react'

export default function DashboardCard({ title, value, icon, color = '#1e3a5f' }) {
  return (
    <div className="stat-card">
      <div 
        className="stat-icon"
        style={{ background: `${color}15` }}
      >
        {icon}
      </div>
      <div className="stat-info">
        <h3 style={{ color }}>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  )
}