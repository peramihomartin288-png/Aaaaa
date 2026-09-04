// ============================================
// MEDIA UPLOAD FUNCTIONS
// ============================================

import config from './index.js'
import supabase from './supabase.js'

// ========== CLOUDINARY UPLOAD ==========

export async function uploadToCloudinary(file, fileType = 'image') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.cloudinary.uploadPreset)
  
  if (fileType === 'video') {
    formData.append('resource_type', 'video')
  }
  
  try {
    const response = await fetch(config.cloudinary.uploadUrl, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload imeshindikana')
    }
    
    return {
      url: data.secure_url,
      public_id: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
      size: data.bytes,
      source_type: 'folder',
      is_external: false
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// ========== UPLOADCARE UPLOAD ==========

export async function uploadToUploadCare(file) {
  const formData = new FormData()
  formData.append('UPLOADCARE_PUB_KEY', config.uploadcare.publicKey)
  formData.append('file', file)
  
  try {
    const response = await fetch(config.uploadcare.uploadUrl, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload imeshindikana')
    }
    
    return {
      url: `https://ucarecdn.com/${data.file}/`,
      uuid: data.file,
      size: data.size,
      source_type: 'folder',
      is_external: false
    }
  } catch (error) {
    console.error('UploadCare upload error:', error)
    throw error
  }
}

// ========== SAVE MEDIA TO SUPABASE ==========

export async function saveMediaToSupabase(mediaData) {
  try {
    const { data, error } = await supabase
      .from('media_assets')
      .insert(mediaData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Save media error:', error)
    throw error
  }
}

// ========== GET MEDIA ==========

export async function getAllMedia(filters = {}) {
  try {
    let query = supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filters.file_type && filters.file_type !== 'all') {
      query = query.eq('file_type', filters.file_type)
    }
    
    if (filters.source_type && filters.source_type !== 'all') {
      query = query.eq('source_type', filters.source_type)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Get media error:', error)
    throw error
  }
}

// ========== DELETE MEDIA ==========

export async function deleteMedia(mediaId) {
  try {
    const { error } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', mediaId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete media error:', error)
    throw error
  }
}

// ========== GET STORAGE USAGE ==========

export async function getCloudinaryUsage() {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/usage`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(`${config.cloudinary.apiKey || ''}:${config.cloudinary.apiSecret || ''}`)
        }
      }
    )
    
    const data = await response.json()
    return {
      storage: data.storage,
      bandwidth: data.bandwidth,
      requests: data.requests
    }
  } catch (error) {
    console.error('Cloudinary usage error:', error)
    return null
  }
}

export async function getUploadCareUsage() {
  try {
    const response = await fetch('https://api.uploadcare.com/storage/', {
      method: 'GET',
      headers: {
        'Authorization': `Uploadcare.Simple ${config.uploadcare.publicKey}:${config.uploadcare.secretKey || ''}`,
        'Accept': 'application/vnd.uploadcare-v0.7+json'
      }
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('UploadCare usage error:', error)
    return null
  }
}