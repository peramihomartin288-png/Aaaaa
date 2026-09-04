import React, { useState, useEffect } from 'react'
import Login from './Login.jsx'
import PinRecovery from './PinRecovery.jsx'
import Dashboard from './Dashboard.jsx'
import Users from './Users.jsx'
import Cards from './Cards.jsx'
import Posts from './Posts.jsx'
import Notifications from './Notifications.jsx'
import History from './History.jsx'
import MediaLibrary from './MediaLibrary.jsx'
import Analytics from './Analytics.jsx'
import Schedule from './Schedule.jsx'
import Appearance from './Appearance.jsx'
import Settings from './Settings.jsx'
import Owners from './Owners.jsx'
import SqlEditor from './SqlEditor.jsx'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import Toast from './Toast.jsx'
import InstallPrompt from './InstallPrompt.jsx'
import PushNotificationPrompt from './PushNotificationPrompt.jsx'
import { isOwnerLoggedIn, getOwnerFromLocal, isSuperAdmin, hasPermission } from './auth.js'
import { isAppInstalled, wasInstallSkipped, captureInstallPrompt } from './pwa.js'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showPushPrompt, setShowPushPrompt] = useState(false)
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Capture install prompt
    captureInstallPrompt()
    
    // Check session
    if (isOwnerLoggedIn()) {
      setIsLoggedIn(true)
      setCurrentPage('dashboard')
      
      // Check PWA install
      if (!isAppInstalled() && !wasInstallSkipped()) {
        setShowInstallPrompt(true)
      } else {
        setShowPushPrompt(true)
      }
    }
    
    // Listen for toast events
    window.addEventListener('toast', handleToast)
    
    return () => {
      window.removeEventListener('toast', handleToast)
    }
  }, [])

  const handleToast = (e) => {
    setToast(e.detail)
    setTimeout(() => setToast(null), 3000)
  }

  const handleInstallComplete = () => {
    setShowInstallPrompt(false)
    setShowPushPrompt(true)
  }

  const handlePushComplete = () => {
    setShowPushPrompt(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('kmcam_owner')
    localStorage.removeItem('kmcam_owner_installed')
    localStorage.removeItem('kmcam_owner_install_skipped')
    localStorage.removeItem('kmcam_sql_history')
    localStorage.removeItem('kmcam_sql_saved')
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
    
    if (!isAppInstalled() && !wasInstallSkipped()) {
      setShowInstallPrompt(true)
    } else {
      setShowPushPrompt(true)
    }
  }

  const pageTitles = {
    dashboard: 'Dashboard',
    users: 'Users Management',
    cards: 'Cards Management',
    posts: 'Posts Management',
    notifications: 'Notifications',
    history: 'History',
    media: 'Media Library',
    analytics: 'Analytics',
    schedule: 'Schedule',
    appearance: 'Appearance',
    settings: 'Settings',
    owners: 'Owners Management',
    sql: 'SQL Editor'
  }

  // Check permission before rendering page
  const canAccessPage = (pageId) => {
    const owner = getOwnerFromLocal()
    if (!owner) return false
    
    // Super Admin ana access zote
    if (isSuperAdmin(owner)) return true
    
    // Others - check permissions
    return hasPermission(owner, pageId)
  }

  // Render login pages
  if (!isLoggedIn) {
    if (currentPage === 'pin-recovery') {
      return <PinRecovery onBackToLogin={() => setCurrentPage('login')} />
    }
    
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onForgotPin={() => setCurrentPage('pin-recovery')}
      />
    )
  }

  // Render main app
  return (
    <div className="flex">
      <Sidebar 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="main-wrapper">
        <TopBar 
          title={pageTitles[currentPage] || 'Dashboard'}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="main-content">
          {currentPage === 'dashboard' && canAccessPage('dashboard') && <Dashboard />}
          {currentPage === 'users' && canAccessPage('users') && <Users />}
          {currentPage === 'cards' && canAccessPage('cards') && <Cards />}
          {currentPage === 'posts' && canAccessPage('posts') && <Posts />}
          {currentPage === 'notifications' && canAccessPage('notifications') && <Notifications />}
          {currentPage === 'history' && canAccessPage('history') && <History />}
          {currentPage === 'media' && canAccessPage('media') && <MediaLibrary />}
          {currentPage === 'analytics' && canAccessPage('analytics') && <Analytics />}
          {currentPage === 'schedule' && canAccessPage('schedule') && <Schedule />}
          {currentPage === 'appearance' && canAccessPage('appearance') && <Appearance />}
          {currentPage === 'settings' && canAccessPage('settings') && <Settings />}
          {currentPage === 'owners' && canAccessPage('owners') && <Owners />}
          {currentPage === 'sql' && canAccessPage('sql') && <SqlEditor />}
        </main>
      </div>
      
      {showInstallPrompt && (
        <InstallPrompt 
          onClose={handleInstallComplete}
          onSkip={handleInstallComplete}
        />
      )}
      
      {showPushPrompt && (
        <PushNotificationPrompt 
          onClose={handlePushComplete}
        />
      )}
      
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}