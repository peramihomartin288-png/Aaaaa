// ============================================
// SUPABASE CLIENT
// ============================================

import { createClient } from '@supabase/supabase-js'
import config from './index.js'

// Create Supabase client
const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

export default supabase