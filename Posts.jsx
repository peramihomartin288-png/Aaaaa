import React, { useState, useEffect } from 'react'
import { getAllPosts, deletePost } from './api.js'
import DataTable from './DataTable.jsx'
import PostForm from './PostForm.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import Modal from './Modal.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import { formatDate, showToast, truncateText } from './utils.js'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [viewingPost, setViewingPost] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = await getAllPosts()
      setPosts(data)
    } catch (error) {
      showToast('Imeshindikana kupata posts', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!postToDelete) return
    
    try {
      await deletePost(postToDelete.id)
      showToast('Post imefutwa', 'success')
      loadPosts()
    } catch (error) {
      showToast('Imeshindikana kufuta post', 'error')
    }
  }

  const columns = [
    {
      key: 'thumbnail',
      label: '',
      render: (row) => {
        const media = row.post_media?.[0]
        if (media?.media_url) {
          return (
            <img 
              src={media.media_url} 
              alt={row.title}
              className="w-14 h-14 rounded-lg object-cover"
            />
          )
        }
        return (
          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
            {row.post_type === 'video' ? '🎥' : row.post_type === 'picha' ? '🖼️' : '📄'}
          </div>
        )
      }
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => truncateText(row.title || 'No Title', 40)
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className="badge badge-info capitalize">{row.post_type}</span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => formatDate(row.created_at)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge ${row.is_published ? 'badge-success' : 'badge-gray'}`}>
          {row.is_published ? 'Published' : 'Draft'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setViewingPost(row)}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
          >
            👁️
          </button>
          <button
            onClick={() => {
              setEditingPost(row)
              setShowForm(true)
            }}
            className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition"
          >
            ✏️
          </button>
          <button
            onClick={() => {
              setPostToDelete(row)
              setShowDeleteConfirm(true)
            }}
            className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
          >
            🗑️
          </button>
        </div>
      )
    }
  ]

  if (loading) {
    return <LoadingSpinner text="Inapakia Posts..." />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Posts Management</h3>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingPost(null)
            setShowForm(true)
          }}
        >
          ➕ Create Post
        </button>
      </div>
      
      <DataTable columns={columns} data={posts} emptyMessage="Hakuna posts bado" />

      {/* Post Form Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title={editingPost ? 'Edit Post' : 'Create Post'}
        maxWidth="650px"
      >
        <PostForm 
          editingPost={editingPost}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            loadPosts()
          }}
        />
      </Modal>

      {/* View Post Modal */}
      <Modal 
        isOpen={!!viewingPost} 
        onClose={() => setViewingPost(null)}
        title="Post Details"
        maxWidth="700px"
      >
        {viewingPost && (
          <div className="space-y-4">
            <h4 className="text-xl font-bold">{viewingPost.title}</h4>
            
            {viewingPost.post_media && viewingPost.post_media.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {viewingPost.post_media.map((media) => (
                  media.media_type === 'image' ? (
                    <img 
                      key={media.id} 
                      src={media.media_url} 
                      alt={viewingPost.title}
                      className="w-full rounded-lg object-cover"
                    />
                  ) : (
                    <video 
                      key={media.id} 
                      controls 
                      className="w-full rounded-lg"
                    >
                      <source src={media.media_url} />
                    </video>
                  )
                ))}
              </div>
            )}
            
            {viewingPost.description && (
              <p className="text-sm text-gray-600">{viewingPost.description}</p>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Futa Post"
        message="Una uhakika unataka kufuta hii post?"
        confirmText="Futa"
      />
    </div>
  )
}