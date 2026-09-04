import React from 'react'
import { getOwnerFromLocal, isSuperAdmin, hasPermission } from './auth.js'

const allMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'cards', label: 'Cards', icon: '🎴' },
  { id: 'posts', label: 'Posts', icon: '📝' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'media', label: 'Media Library', icon: '🖼️' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'schedule', label: 'Schedule', icon: '🗓️' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'owners', label: 'Owners', icon: '🔑' },
  { id: 'sql', label: 'SQL Editor', icon: '💾' }
]

export default function Sidebar({ currentPage, onNavigate, onLogout, isOpen, onClose }) {
  const owner = getOwnerFromLocal()
  const superAdmin = isSuperAdmin(owner)

  // Filter menu kulingana na permissions
  const menuItems = allMenuItems.filter(item => {
    // Super Admin anaona kila kitu
    if (superAdmin) return true
    
    // Others - check permissions
    return hasPermission(owner, item.id)
  })

  return (
    <>
      {/* Overlay kwa mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <h1>KMCAM</h1>
          <p>Owner Panel</p>
        </div>
        
        {/* Owner Info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {owner?.full_name?.[0] || 'M'}
          </div>
          <div className="sidebar-user-info">
            <h4>{owner?.full_name || 'Martin Peramiho'}</h4>
            <p>{owner?.user_type === 'owner' || owner?.user_type === 'super_admin' ? 'Main Admin' : 
                 owner?.user_type === 'step_admin' ? 'Step Admin' : 'Moderator'}</p>
          </div>
        </div>
        
        {/* Menu Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id)
                onClose()
              }}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        
        {/* Logout */}
        <div className="sidebar-logout">
          <button onClick={onLogout}>
            <span className="icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}