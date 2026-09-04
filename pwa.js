// ============================================
// PWA FUNCTIONS
// ============================================

let deferredPrompt = null

// ========== CAPTURE INSTALL PROMPT ==========

export function captureInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
  })
}

// ========== CHECK INSTALL STATUS ==========

export function isAppInstalled() {
  // Check localStorage
  if (localStorage.getItem('kmcam_owner_installed') === 'true') {
    return true
  }
  
  // Check display mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    localStorage.setItem('kmcam_owner_installed', 'true')
    return true
  }
  
  // Check iOS Safari
  if (window.navigator.standalone === true) {
    localStorage.setItem('kmcam_owner_installed', 'true')
    return true
  }
  
  return false
}

// ========== CHECK IF INSTALL WAS SKIPPED ==========

export function wasInstallSkipped() {
  const skippedAt = localStorage.getItem('kmcam_owner_install_skipped')
  if (!skippedAt) return false
  
  const daysSinceSkip = (Date.now() - parseInt(skippedAt)) / (1000 * 60 * 60 * 24)
  return daysSinceSkip < 7 // Usiulize tena kwa siku 7
}

// ========== INSTALL APP ==========

export async function installApp() {
  if (deferredPrompt) {
    try {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      
      if (result.outcome === 'accepted') {
        localStorage.setItem('kmcam_owner_installed', 'true')
        return { success: true, message: 'App imesakinishwa!' }
      } else {
        return { success: false, message: 'Install imeghairiwa' }
      }
    } catch (error) {
      console.error('Install error:', error)
      return { success: false, message: 'Imeshindikana kusakinisha' }
    } finally {
      deferredPrompt = null
    }
  } else {
    // Fallback - onyesha instructions manual
    return { success: false, message: 'Tumia browser menu kusakinisha', manual: true }
  }
}

// ========== SKIP INSTALL ==========

export function skipInstall() {
  localStorage.setItem('kmcam_owner_install_skipped', Date.now().toString())
}

// ========== REGISTER SERVICE WORKER ==========

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      return registration
    } catch (error) {
      console.error('SW registration failed:', error)
      return null
    }
  }
  return null
}