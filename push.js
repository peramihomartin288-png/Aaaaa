// ============================================
// PUSH NOTIFICATION FUNCTIONS
// ============================================

import supabase from './supabase.js'
import { getOwnerFromLocal } from './auth.js'

// ========== CHECK SUPPORT ==========

export function isPushSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator
}

export function hasNotificationPermission() {
  return Notification.permission === 'granted'
}

export function hasNotificationDenied() {
  return Notification.permission === 'denied'
}

// ========== SUBSCRIBE TO PUSH NOTIFICATIONS ==========

export async function subscribeToPushNotifications() {
  try {
    // Request permission
    const permission = await Notification.requestPermission()
    
    if (permission !== 'granted') {
      return { success: false, message: 'Notifications zimezuiwa' }
    }
    
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready
    
    // Subscribe
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
    })
    
    // Save subscription kwenye Supabase
    const owner = getOwnerFromLocal()
    
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert({
        user_id: owner?.id,
        endpoint: subscription.endpoint,
        auth_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
        user_agent: navigator.userAgent,
        device_type: detectDeviceType(),
        browser_type: detectBrowser()
      })
    
    if (error) throw error
    
    return { success: true, message: 'Notifications zimewashwa!' }
    
  } catch (error) {
    console.error('Push subscription error:', error)
    return { success: false, message: 'Imeshindikana ku-subscribe' }
  }
}

// ========== HELPER FUNCTIONS ==========

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function detectDeviceType() {
  const ua = navigator.userAgent
  if (/mobile/i.test(ua)) return 'mobile'
  if (/tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}

function detectBrowser() {
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'chrome'
  if (ua.includes('Firefox')) return 'firefox'
  if (ua.includes('Safari')) return 'safari'
  if (ua.includes('Edge')) return 'edge'
  return 'other'
}