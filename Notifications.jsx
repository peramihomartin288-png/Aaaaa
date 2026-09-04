import React, { useState, useEffect } from 'react'
import { sendNotification, getAllNotifications, getAllUsers } from './api.js'
import FormInput from './FormInput.jsx'
import FormTextarea from './FormTextarea.jsx'
import FormSelect from './FormSelect.jsx'
import DataTable from './DataTable.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import { formatDate, formatTime, showToast } from './utils.js'
import { getOwnerFromLocal } from './auth.js'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_audience: 'all_users',
    target_user_id: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [notifData, userData] = await Promise.all([
        getAllNotifications(),
        getAllUsers()
      ])
      setNotifications(notifData)
      setUsers(userData)
    } catch (error) {
      showToast('Imeshindikana kupata data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    
    const owner = getOwnerFromLocal()
    
    const notificationData = {
      title: formData.title,
      message: formData.message,
      target_audience: formData.target_audience,
      target_user_id: formData.target_audience === 'specific_user' ? formData.target_user_id : null,
      created_by: owner?.id
    }
    
    try {
      await sendNotification(notificationData)
      showToast('Notification imetumwa!', 'success')
      setFormData({
        title: '',
        message: '',
        target_audience: 'all_users',
        target_user_id: ''
      })
      loadData()
    } catch (error) {
      showToast('Imeshindikana kutuma notification', 'error')
    } finally {
      setSending(false)
    }
  }

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'message',
      label: 'Message',
      render: (row) => row.message?.substring(0, 50) + '...'
    },
    {
      key: 'target',
      label: 'Target',
      render: (row) => (
        <span className="badge badge-info capitalize">
          {row.target_audience?.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => `${formatDate(row.created_at)} ${formatTime(row.created_at)}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge ${row.is_sent ? 'badge-success' : 'badge-warning'}`}>
          {row.is_sent ? 'Sent' : 'Scheduled'}
        </span>
      )
    }
  ]

  if (loading) {
    return <LoadingSpinner text="Inapakia Notifications..." />
  }

  return (
    <div className="space-y-6">
      {/* Send Notification Form */}
      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">🔔 Send Notification</h3>
        
        <form onSubmit={handleSubmit}>
          <FormInput 
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title ya notification"
            required
          />
          
          <FormTextarea 
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message ya notification"
            rows={3}
            required
          />
          
          <FormSelect 
            label="Target Audience"
            name="target_audience"
            value={formData.target_audience}
            onChange={handleChange}
            options={[
              { value: 'all_users', label: '👥 All Users' },
              { value: 'specific_user', label: '👤 Specific User' }
            ]}
          />
          
          {formData.target_audience === 'specific_user' && (
            <FormSelect 
              label="Chagua User"
              name="target_user_id"
              value={formData.target_user_id}
              onChange={handleChange}
              options={users.map(u => ({ value: u.id, label: u.full_name }))}
            />
          )}
          
          <button 
            type="submit" 
            disabled={sending}
            className="btn-primary"
          >
            {sending ? 'Inatuma...' : '📤 Send Notification'}
          </button>
        </form>
      </div>
      
      {/* Notifications List */}
      <div>
        <h3 className="text-lg font-bold mb-4">📋 Sent Notifications</h3>
        <DataTable columns={columns} data={notifications} emptyMessage="Hakuna notifications bado" />
      </div>
    </div>
  )
}