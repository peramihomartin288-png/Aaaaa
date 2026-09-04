import React, { useState, useEffect } from 'react'
import supabase from './supabase.js'
import DataTable from './DataTable.jsx'
import FormSelect from './FormSelect.jsx'
import FormDate from './FormDate.jsx'
import Modal from './Modal.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import { formatDate, showToast } from './utils.js'
import { getOwnerFromLocal } from './auth.js'

export default function Schedule() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    content_type: 'post',
    content_id: '',
    scheduled_date: '',
    scheduled_time: '09:00',
    recurrence_pattern: 'none'
  })

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('content_schedule')
        .select('*')
        .order('scheduled_date', { ascending: true })
      
      if (error) throw error
      setSchedules(data || [])
    } catch (error) {
      showToast('Imeshindikana kupata schedules', 'error')
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
    setSaving(true)
    
    const owner = getOwnerFromLocal()
    
    try {
      const { error } = await supabase
        .from('content_schedule')
        .insert({
          ...formData,
          status: 'scheduled',
          created_by: owner?.id
        })
      
      if (error) throw error
      
      showToast('Schedule imeongezwa!', 'success')
      setShowForm(false)
      setFormData({
        content_type: 'post',
        content_id: '',
        scheduled_date: '',
        scheduled_time: '09:00',
        recurrence_pattern: 'none'
      })
      loadSchedules()
    } catch (error) {
      showToast('Imeshindikana kuhifadhi schedule', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async (scheduleId) => {
    try {
      const { error } = await supabase
        .from('content_schedule')
        .update({ status: 'cancelled' })
        .eq('id', scheduleId)
      
      if (error) throw error
      
      showToast('Schedule ime-cancelled', 'success')
      loadSchedules()
    } catch (error) {
      showToast('Imeshindikana ku-cancel', 'error')
    }
  }

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className="badge badge-info capitalize">{row.content_type}</span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => formatDate(row.scheduled_date)
    },
    {
      key: 'time',
      label: 'Time',
      render: (row) => row.scheduled_time || '09:00'
    },
    {
      key: 'recurrence',
      label: 'Recurrence',
      render: (row) => <span className="capitalize text-sm">{row.recurrence_pattern || 'None'}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge ${
          row.status === 'published' ? 'badge-success' :
          row.status === 'scheduled' ? 'badge-info' :
          row.status === 'cancelled' ? 'badge-gray' : 'badge-error'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        row.status === 'scheduled' && (
          <button
            onClick={() => handleCancel(row.id)}
            className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
          >
            🚫 Cancel
          </button>
        )
      )
    }
  ]

  if (loading) {
    return <LoadingSpinner text="Inapakia Schedule..." />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Content Schedule</h3>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Add Schedule
        </button>
      </div>
      
      <DataTable columns={columns} data={schedules} emptyMessage="Hakuna schedules bado" />

      {/* Add Schedule Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title="Add Schedule"
        maxWidth="500px"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect 
            label="Content Type"
            name="content_type"
            value={formData.content_type}
            onChange={handleChange}
            options={[
              { value: 'post', label: '📝 Post' },
              { value: 'card', label: '🎴 Card' },
              { value: 'notification', label: '🔔 Notification' }
            ]}
            required
          />
          
          <FormDate 
            label="Date"
            name="scheduled_date"
            value={formData.scheduled_date}
            onChange={handleChange}
            required
          />
          
          <FormSelect 
            label="Time"
            name="scheduled_time"
            value={formData.scheduled_time}
            onChange={handleChange}
            options={[
              { value: '06:00', label: '06:00 AM' },
              { value: '07:00', label: '07:00 AM' },
              { value: '08:00', label: '08:00 AM' },
              { value: '09:00', label: '09:00 AM' },
              { value: '10:00', label: '10:00 AM' },
              { value: '12:00', label: '12:00 PM' },
              { value: '14:00', label: '02:00 PM' },
              { value: '16:00', label: '04:00 PM' },
              { value: '18:00', label: '06:00 PM' },
              { value: '20:00', label: '08:00 PM' }
            ]}
          />
          
          <FormSelect 
            label="Recurrence"
            name="recurrence_pattern"
            value={formData.recurrence_pattern}
            onChange={handleChange}
            options={[
              { value: 'none', label: 'None (Once)' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' }
            ]}
          />
          
          <div className="flex gap-3 justify-end">
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
    </div>
  )
}