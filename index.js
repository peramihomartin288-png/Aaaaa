// ============================================
// KMCAM OWNER PANEL - CONFIGURATION
// ============================================

const config = {
  // SUPABASE CONFIGURATION
  supabase: {
    url: 'https://lbrbbzozrmdblselicav.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicmJiem96cm1kYmxzZWxpY2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MzMwNDcsImV4cCI6MjEwNDAwOTA0N30.P3LWjf6mt5V_SS4TJfnWHiDNDJoaPGNs7fBzfp1kw08',
    // Service Role Key - USIWEKE HAPA! Weka kwenye .env
    // Itatumika kwenye Edge Function kwa SQL Editor
  },

  // CLOUDINARY CONFIGURATION
  cloudinary: {
    cloudName: 'pv88ocpt',
    uploadPreset: 'kmca_preset',
    uploadUrl: 'https://api.cloudinary.com/v1_1/pv88ocpt/upload'
  },

  // UPLOADCARE CONFIGURATION
  uploadcare: {
    publicKey: 'b69fa8f92a2bd382c0b4',
    uploadUrl: 'https://upload.uploadcare.com/base/'
  },

  // APP SETTINGS
  app: {
    name: 'KMCAM',
    fullName: 'Kwaya ya Mtakatifu Carlo Acutis',
    version: '1.0.0',
    description: 'Owner Panel - KMCAM'
  },

  // OWNER CREDENTIALS
  owner: {
    name: 'Martin Peramiho',
    phone: '0636802857',
    pin: '1408'
  },

  // COLORS
  colors: {
    primary: '#1e3a5f',
    primaryDark: '#15294a',
    secondary: '#f59e0b',
    sidebar: '#0f172a',
    background: '#f1f5f9',
    white: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b'
  },

  // STORAGE LIMITS
  storage: {
    warningThreshold: 80,
    criticalThreshold: 95
  },

  // PWA SETTINGS
  pwa: {
    installPromptEnabled: true,
    maxPromptAttempts: 3,
    daysBeforeReprompt: 7
  },

  // SQL EDITOR SETTINGS
  sqlEditor: {
    // Edge Function URL - itawekwa baada ya deploy
    edgeFunctionUrl: 'https://lbrbbzozrmdblselicav.supabase.co/functions/v1/run-sql'
  }
}

export default config