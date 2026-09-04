import React, { useState, useEffect } from 'react'
import { getAllOwners, createOwner, updateOwner, deleteOwner } from './api.js'
import DataTable from './DataTable.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import Modal from './Modal.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import FormInput from './FormInput.jsx'
import FormSelect from './FormSelect.jsx'
import { formatDate, getInitials, getAvatarColor, showToast } from './utils.js'
import { getOwnerFromLocal, isSuperAdmin } from './auth.js'

const permissionOptions = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users Management' },
  { id: 'cards', label: 'Cards Management' },
  { id: 'posts', label: 'Posts Management' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'history', label: 'History' },
  { id: 'media', label: 'Media Library' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'settings', label: 'Settings' },
  { id: 'owners', label: 'Owners Management' },
  { id: 'sql', label: 'SQL Editor' }
]

export default function Owners() {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingOwner, setEditingOwner] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [ownerToDelete, setOwnerToDelete] = useState(null)
  const [showPromoteConfirm, setShowPromoteConfirm] = useState(false)
  const [ownerToPromote, setOwnerToPromote] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    pin: '',
    user_type: 'step_admin',
    permissions: {}
  })

  const currentOwner = getOwnerFromLocal()
  const superAdmin = isSuperAdmin(currentOwner)

  useEffect(() => {
    loadOwners()
  }, [])

  const loadOwners = async () => {
    setLoading(true)
    try {
      const data = await getAllOwners()
      setOwners(data)
    } catch (error) {
      showToast('Imeshindikana kupata owners', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      // Handle permissions
      if (name === 'all_permissions') {
        const allPerms = {}
        if (checked) {
          permissionOptions.forEach(p => { allPerms[p.id] = true })
        }
        setFormData(prev => ({ ...prev, permissions: allPerms }))
      } else {
        setFormData(prev => ({
          ...prev,
          permissions: {
            ...prev.permissions,
            [name]: checked
          }
        }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      if (editingOwner) {
        await updateOwner(editingOwner.id, formData)
        showToast('Owner ime-updated!', 'success')
      } else {
        await createOwner(formData)
        showToast('Owner imeongezwa!', 'success')
      }
      
      setShowForm(false)
      setFormData({
        full_name: '',
        phone: '',
        pin: '',
        user_type: 'step_admin',
        permissions: {}
      })
      loadOwners()
    } catch (error) {
      showToast(error.message || 'Imeshindikana kuhifadhi', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePromote = async () => {
    if (!ownerToPromote) return
    
    try {
      await updateOwner(ownerToPromote.id, {
        user_type: 'owner',
        permissions: null
      })
      
      showToast(`${ownerToPromote.full_name} amepandishwa kuwa Main Admin!`, 'success')
      loadOwners()
    } catch (error) {
      showToast('Imeshindikana kupromote', 'error')
    }
  }

  const handleDelete = async () => {
    if (!ownerToDelete) return
    
    try {
      await deleteOwner(ownerToDelete.id)
      showToast('Owner amefutwa', 'success')
      loadOwners()
    } catch (error) {
      showToast('Imeshindikana kufuta owner', 'error')
    }
  }

  const getRoleLabel = (userType) => {
    if (userType === 'owner' || userType === 'super_admin') return 'Main Admin'
    if (userType === 'step_admin') return 'Step Admin'
    return 'Moderator'
  }

  const getRoleBadge = (userType) => {
    if (userType === 'owner' || userType === 'super_admin') return 'badge-success'
    if (userType === 'step_admin') return 'badge-warning'
    return 'badge-info'
  }

  const columns = [
    {
      key: 'avatar',
      label: '',
      render: (row) => (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: getAvatarColor(row.full_name) }}
        >
          {getInitials(row.full_name)}
        </div>
      )
    },
    { key: 'full_name', label: 'Jina' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span className={`badge ${getRoleBadge(row.user_type)}`}>
          {getRoleLabel(row.user_type)}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Aliongezwa',
      render: (row) => formatDate(row.created_at)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingOwner(row)
              setFormData({
                full_name: row.full_name,
                phone: row.phone || '',
                pin: row.pin || '',
                user_type: row.user_type,
                permissions: row.permissions || {}
              })
              setShowForm(true)
            }}
            className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition"
          >
            ✏️
          </button>
          
          {superAdmin && row.user_type !== 'owner' && row.user_type !== 'super_admin' && (
            <button
              onClick={() => {
                setOwnerToPromote(row)
                setShowPromoteConfirm(true)
              }}
              className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition"
              title="Promote to Main Admin"
            >
              ⬆️
            </button>
          )}
          
          {superAdmin && row.id !== currentOwner?.id && (
            <button
              onClick={() => {
                setOwnerToDelete(row)
                setShowDeleteConfirm(true)
              }}
              className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
            >
              🗑️
            </button>
          )}
        </div>
      )
    }
  ]

  if (loading) {
    return <LoadingSpinner text="Inapakia Owners..." />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Owners Management</h3>
        {superAdmin && (
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingOwner(null)
              setFormData({
                full_name: '',
                phone: '',
                pin: '',
                user_type: 'step_admin',
                permissions: {}
              })
              setShowForm(true)
            }}
          >
            ➕ Add New Owner
          </button>
        )}
      </div>
      
      <DataTable columns={columns} data={owners} emptyMessage="Hakuna owners bado" />

      {/* Add/Edit Owner Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title={editingOwner ? 'Edit Owner' : 'Add New Owner'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput 
            label="Jina Kamili"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
          
          <FormInput 
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="07XXXXXXXX"
          />
          
          <FormInput 
            label="PIN (4 digits)"
            name="pin"
            type="password"
            value={formData.pin}
            onChange={handleChange}
            maxLength={4}
            required
          />
          
          <FormSelect 
            label="Role"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            options={[
              { value: 'step_admin', label: 'Step Admin' },
              { value: 'moderator', label: 'Moderator' },
              { value: 'owner', label: 'Main Admin (Full Access)' }
            ]}
          />
          
          {/* Permissions (kwa Step Admin na Moderator) */}
          {formData.user_type !== 'owner' && (
            <div>
              <label className="form-label">Permissions</label>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 max-h-60 overflow-y-auto">
                <label className="flex items-center gap-2 cursor-pointer border-b border-gray-200 pb-2">
                  <input
                    type="checkbox"
                    name="all_permissions"
                    checked={permissionOptions.every(p => formData.permissions?.[p.id])}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">All Permissions</span>
                </label>
                
                {permissionOptions.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={perm.id}
                      checked={formData.permissions?.[perm.id] || false}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
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
        </form>
      </Modal>

      {/* Promote Confirmation */}
      <ConfirmDialog 
        isOpen={showPromoteConfirm}
        onClose={() => setShowPromoteConfirm(false)}
        onConfirm={handlePromote}
        title="Promote to Main Admin"
        message={`Una uhakika unataka kumfanya ${ownerToPromote?.full_name} kuwa Main Admin? Atapata access zote ikiwemo Owners na SQL Editor.`}
        confirmText="Yes, Promote"
        type="success"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Futa Owner"
        message={`Una uhakika unataka kumfuta ${ownerToDelete?.full_name}?`}
        confirmText="Futa"
      />
    </div>
  )
}