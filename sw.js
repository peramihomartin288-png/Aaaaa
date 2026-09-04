// Service Worker - KMCAM Owner Panel

const CACHE_NAME = 'kmcam-owner-v1'
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_ASSETS)
    })
  )
})

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    })
  )
})

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request)
    })
  )
})

// Push Notification Event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  
  const options = {
    body: data.message || 'Notification kutoka KMCAM',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Fungua'
      },
      {
        action: 'close',
        title: 'Funga'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'KMCAM', options)
  )
})

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})