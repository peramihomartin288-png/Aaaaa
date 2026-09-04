// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

import supabase from './supabase.js'
import config from './index.js'

// ========== LOCAL STORAGE ==========

export function saveOwnerToLocal(ownerData) {
  localStorage.setItem('kmcam_owner', JSON.stringify(ownerData))
}

export function getOwnerFromLocal() {
  const owner = localStorage.getItem('kmcam_owner')
  return owner ? JSON.parse(owner) : null
}

export function removeOwnerFromLocal() {
  localStorage.removeItem('kmcam_owner')
  localStorage.removeItem('kmcam_owner_installed')
  localStorage.removeItem('kmcam_owner_install_skipped')
  localStorage.removeItem('kmcam_sql_history')
  localStorage.removeItem('kmcam_sql_saved')
}

export function isOwnerLoggedIn() {
  return !!localStorage.getItem('kmcam_owner')
}

// ========== OWNER LOGIN ==========

export async function ownerLoginByPin(pin) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('pin', pin)
      .in('user_type', ['owner', 'super_admin', 'step_admin', 'moderator'])
      .eq('is_active', true)
      .single()
    
    if (error || !data) {
      return { success: false, error: 'PIN si sahihi!' }
    }
    
    // Save kwenye local storage
    saveOwnerToLocal(data)
    
    return { success: true, data }
  } catch (err) {
    console.error('Login error:', err)
    return { success: false, error: 'Imeshindikana kuingia' }
  }
}

// ========== PIN RECOVERY ==========

export async function recoverOwnerPin(nameOrPhone) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('user_type', ['owner', 'super_admin', 'step_admin', 'moderator'])
      .or(`full_name.ilike.%${nameOrPhone}%,phone.eq.${nameOrPhone}`)
      .single()
    
    if (error || !data) {
      return { success: false, error: 'Taarifa hazijapatikana' }
    }
    
    return { 
      success: true, 
      pin: data.pin, 
      full_name: data.full_name,
      phone: data.phone
    }
  } catch (err) {
    console.error('Recovery error:', err)
    return { success: false, error: 'Imeshindikana kurudisha PIN' }
  }
}

// ========== LOGOUT ==========

export function logoutOwner() {
  removeOwnerFromLocal()
  window.location.reload()
}

// ========== PERMISSIONS ==========

export function hasPermission(owner, pageId) {
  if (!owner) return false
  
  // Super Admin / Main Admin ana access zote
  if (owner.user_type === 'owner' || owner.user_type === 'super_admin') {
    return true
  }
  
  // Step Admin / Moderator - check permissions
  if (owner.permissions) {
    const permissions = typeof owner.permissions === 'string' 
      ? JSON.parse(owner.permissions) 
      : owner.permissions
    
    return permissions[pageId] === true
  }
  
  return false
}

export function isSuperAdmin(owner) {
  return owner?.user_type === 'owner' || owner?.user_type === 'super_admin'
}

export function canManageOwners(owner) {
  return isSuperAdmin(owner)
}

export function canUseSqlEditor(owner) {
  return isSuperAdmin(owner)
}