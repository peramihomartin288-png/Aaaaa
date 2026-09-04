import { useState } from 'react'
import { uploadToCloudinary, uploadToUploadCare } from './media.js'

export default function useMediaUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadFile = async (file, mediaType = 'image') => {
    setUploading(true)
    setProgress(10)
    setError(null)
    
    try {
      let result
      
      if (file.type.startsWith('audio/')) {
        setProgress(30)
        result = await uploadToUploadCare(file)
      } else {
        setProgress(30)
        result = await uploadToCloudinary(file, file.type.startsWith('video/') ? 'video' : 'image')
      }
      
      setProgress(100)
      return { success: true, data: result }
      
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const uploadFromUrl = (url) => {
    return {
      success: true,
      data: {
        url,
        is_external: true,
        source_type: 'url'
      }
    }
  }

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadFromUrl
  }
}