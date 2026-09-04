import React, { useState } from 'react'
import { createPost } from './api.js'
import FormInput from './FormInput.jsx'
import FormTextarea from './FormTextarea.jsx'
import FormSelect from './FormSelect.jsx'
import UploadModal from './UploadModal.jsx'
import { showToast } from './utils.js'
import { getOwnerFromLocal } from './auth.js'

export default function PostForm({ editingPost, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: editingPost?.title || '',
    description: editingPost?.description || '',
    post_type: editingPost?.post_type || 'picha',
    share_link: editingPost?.share_link || '',
    download_url: editingPost?.download_url || '',
    is_pinned: editingPost?.is_pinned || false,
    is_published: editingPost?.is_published !== false
  })

  const [mediaFiles, setMediaFiles] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleUploadComplete = (result) => {
    setMediaFiles(prev => [...prev, result])
    setShowUpload(false)
  }

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const owner = getOwnerFromLocal()
    
    const postData = {
      user_id: owner?.id,
      post_type: formData.post_type,
      title: formData.title,
      description: formData.description,
      share_link: formData.share_link || null,
      download_url: formData.download_url || null,
      is_pinned: formData.is_pinned,
      is_published: formData.is_published,
      created_by: owner?.id
    }
    
    const allMedia = mediaFiles.map(f => ({
      media_type: 'image',
      media_url: f.url
    }))
    
    try {
      await createPost(postData, allMedia)
      showToast('Post imeongezwa!', 'success')
      onSuccess()
    } catch (error) {
      showToast(error.message || 'Imeshindikana kuhifadhi', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput 
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title ya post"
        required
      />
      
      <FormSelect 
        label="Post Type"
        name="post_type"
        value={formData.post_type}
        onChange={handleChange}
        options={[
          { value: 'picha', label: '🖼️ Picha' },
          { value: 'video', label: '🎥 Video' },
          { value: 'text', label: '📄 Text' }
        ]}
      />
      
      <FormTextarea 
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        placeholder="Maelezo ya post"
      />
      
      {/* Media Upload */}
      <div>
        <label className="form-label">Media Files</label>
        <div className="flex gap-2 mb-3">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setShowUpload(true)}
          >
            📤 Upload Picha/Video
          </button>
        </div>
        
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative">
                <img 
                  src={file.url} 
                  alt={`Media ${index + 1}`}
                  className="w-full h-24 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <FormInput 
        label="Share Link (optional)"
        name="share_link"
        value={formData.share_link}
        onChange={handleChange}
        placeholder="https://..."
      />
      
      <FormInput 
        label="Download URL (optional)"
        name="download_url"
        value={formData.download_url}
        onChange={handleChange}
        placeholder="https://..."
      />
      
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_pinned"
            checked={formData.is_pinned}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Pin Post</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Published</span>
        </label>
      </div>
      
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <button 
          type="button" 
          onClick={onClose}
          className="btn-ghost"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Inahifadhi...' : '💾 Hifadhi'}
        </button>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUploadComplete}
        title="Upload Picha/Video"
        accept="image/*,video/*"
      />
    </form>
  )
}