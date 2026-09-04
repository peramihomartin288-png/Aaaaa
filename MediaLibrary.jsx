import React, { useState, useEffect } from 'react'
import { getAllMedia, deleteMedia, saveMediaToSupabase } from './media.js'
import UploadModal from './UploadModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import Modal from './Modal.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import { formatDate, showToast } from './utils.js'
import { getOwnerFromLocal } from './auth.js'

export default function MediaLibrary() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [mediaToDelete, setMediaToDelete] = useState(null)

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const filters = {}
      if (filter !== 'all') {
        filters.file_type = filter
      }
      const data = await getAllMedia(filters)
      setMedia(data)
    } catch (error) {
      showToast('Imeshindikana kupata media', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = async (result) => {
    const owner = getOwnerFromLocal()
    
    try {
      let fileType = 'image'
      if (result.url.includes('ucarecdn')) fileType = 'audio'
      else if (result.url.includes('.mp4') || result.url.includes('.mov')) fileType = 'video'
      
      await saveMediaToSupabase({
        file_name: result.url.split('/').pop(),
        file_type: fileType,
        source_type: result.source_type || 'folder',
        file_url: result.url,
        external_url: result.is_external ? result.url : null,
        is_external: result.is_external || false,
        uploaded_by: owner?.id
      })
      
      showToast('Media imehifadhiwa!', 'success')
      loadMedia()
    } catch (error) {
      showToast('Imeshindikana kuhifadhi media', 'error')
    }
  }

  const handleDelete = async () => {
    if (!mediaToDelete) return
    
    try {
      await deleteMedia(mediaToDelete.id)
      showToast('Media imefutwa', 'success')
      loadMedia()
    } catch (error) {
      showToast('Imeshindikana kufuta media', 'error')
    }
  }

  const filteredMedia = filter === 'all' 
    ? media 
    : media.filter(m => m.file_type === filter)

  if (loading) {
    return <LoadingSpinner text="Inapakia Media Library..." />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: '🖼️ All' },
            { id: 'image', label: '📷 Images' },
            { id: 'video', label: '🎥 Videos' },
            { id: 'audio', label: '🎵 Audio' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.id 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <button 
          className="btn-primary"
          onClick={() => setShowUpload(true)}
        >
          📤 Upload Media
        </button>
      </div>
      
      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📂</p>
          <p>Hakuna media bado</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedMedia(item)}
            >
              {item.file_type === 'image' ? (
                <img 
                  src={item.file_url} 
                  alt={item.file_name}
                  className="w-full h-32 object-cover"
                />
              ) : item.file_type === 'video' ? (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-4xl">
                  🎥
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-4xl">
                  🎵
                </div>
              )}
              
              <div className="p-3">
                <p className="text-xs font-medium truncate">{item.file_name}</p>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{item.source_type === 'url' ? '🔗 URL' : '📁 Folder'}</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Modal */}
      <Modal 
        isOpen={!!selectedMedia} 
        onClose={() => setSelectedMedia(null)}
        title="Media Details"
        maxWidth="600px"
      >
        {selectedMedia && (
          <div className="space-y-4">
            {selectedMedia.file_type === 'image' && (
              <img 
                src={selectedMedia.file_url} 
                alt={selectedMedia.file_name}
                className="w-full rounded-lg"
              />
            )}
            {selectedMedia.file_type === 'video' && (
              <video controls className="w-full rounded-lg">
                <source src={selectedMedia.file_url} />
              </video>
            )}
            {selectedMedia.file_type === 'audio' && (
              <audio controls className="w-full">
                <source src={selectedMedia.file_url} />
              </audio>
            )}
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">File Name</p>
                <p className="font-semibold">{selectedMedia.file_name || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-semibold capitalize">{selectedMedia.file_type}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Source</p>
                <p className="font-semibold">{selectedMedia.source_type === 'url' ? 'External URL' : 'Folder Upload'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold">{formatDate(selectedMedia.created_at)}</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setMediaToDelete(selectedMedia)
                setShowDeleteConfirm(true)
              }}
              className="btn-danger w-full justify-center"
            >
              🗑️ Futa Media
            </button>
          </div>
        )}
      </Modal>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUploadComplete}
        title="Upload Media"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Futa Media"
        message="Una uhakika unataka kufuta hii media?"
        confirmText="Futa"
      />
    </div>
  )
}