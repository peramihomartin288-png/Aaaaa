import React from 'react'
import { getOwnerFromLocal } from './auth.js'

export default function TopBar({ title, onMenuClick }) {
  const owner = getOwnerFromLocal()

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <button className="hamburger" onClick={onMenuClick}>
          ☰
        </button>
        <h2 className="topbar-title">{title}</h2>
      </div>
      
      <div className="topbar-right">
        <div className="flex items-center gap-3">
          <div className="topbar-avatar">
            {owner?.full_name?.[0] || 'M'}
          </div>
          <div className="topbar-user-info">
            <h4>{owner?.full_name || 'Martin Peramiho'}</h4>
            <p>
              {owner?.user_type === 'owner' || owner?.user_type === 'super_admin' 
                ? 'Main Admin' 
                : owner?.user_type === 'step_admin' 
                  ? 'Step Admin' 
                  : 'Moderator'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}