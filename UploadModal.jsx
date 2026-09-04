import React, { useState, useRef } from 'react'
import Modal from './Modal.jsx'
import { uploadToCloudinary, uploadToUploadCare } from './media.js'
import { showToast } from './utils.js'

export default function UploadModal({ 
  isOpen, 
  onClose, 
  onUpload,
  title = 'Upload Media',
  accept = 'image/*,video/*,audio/*'
}) {
  const [sourceType, setSourceType] = useState(null)
  const [externalUrl, setExternalUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (file) => {
    setUploading(true)
    setProgress(10)
    
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
      onUpload({ ...result, source_type: 'folder' })
      showToast('Upload imefanikiwa!', 'success')
      
      setTimeout(() => {
        onClose()
        setSourceType(null)
        setProgress(0)
      }, 500)
      
    } catch (error) {
      showToast(error.message || 'Upload imeshindikana', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (!externalUrl) {
      showToast('Tafadhali weka URL', 'warning')
      return
    }
    
    onUpload({ url: externalUrl, source_type: 'url', is_external: true })
    showToast('URL imehifadhiwa!', 'success')
    setExternalUrl('')
    setSourceType(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="500px">
      {!sourceType ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSourceType('folder')}
            className="p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 transition text-center cursor-pointer"
          >
            <div className="text-4xl mb-3">📁</div>
            <div className="font-semibold">Folder</div>
            <div className="text-xs text-gray-500 mt-1">Upload kutoka device</div>
          </button>
          
          <button
            onClick={() => setSourceType('url')}
            className="p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 transition text-center cursor-pointer"
          >
            <div className="text-4xl mb-3">🔗</div>
            <div className="font-semibold">URL</div>
            <div className="text-xs text-gray-500 mt-1">Weka link ya nje</div>
          </button>
        </div>
      ) : sourceType === 'folder' ? (
        <div>
          <button onClick={() => setSourceType(null)} className="text-sm text-gray-500 mb-4">
            ← Rudi
          </button>
          
          <div 
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-5xl mb-3">⬆️</div>
            <p className="font-semibold">Bonyeza kuchagua file</p>
            <p className="text-xs text-gray-500 mt-1">au buruta hapa</p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) {
                handleFileUpload(e.target.files[0])
              }
            }}
          />
          
          {uploading && (
            <div className="mt-4">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%`, background: '#1e3a5f' }}
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                Inapakia... {progress}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button onClick={() => setSourceType(null)} className="text-sm text-gray-500 mb-4">
            ← Rudi
          </button>
          
          <label className="form-label">Weka URL ya file:</label>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="form-input mb-4"
          />
          <button onClick={handleUrlSubmit} className="btn-secondary w-full">
            Hifadhi URL
          </button>
        </div>
      )}
    </Modal>
  )
}