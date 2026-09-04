import React, { useState } from 'react'
import { createCard } from './api.js'
import FormInput from './FormInput.jsx'
import FormTextarea from './FormTextarea.jsx'
import FormSelect from './FormSelect.jsx'
import FormDate from './FormDate.jsx'
import UploadModal from './UploadModal.jsx'
import { showToast, getTodayDate } from './utils.js'
import { getOwnerFromLocal } from './auth.js'

export default function CardForm({ cardType, editingCard, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: editingCard?.title || '',
    description: editingCard?.description || '',
    start_date: editingCard?.cards?.start_date || getTodayDate(),
    end_date: editingCard?.cards?.end_date || '',
    is_active: editingCard?.cards?.is_active !== false,
    is_published: editingCard?.cards?.is_published !== false
  })

  const [details, setDetails] = useState({
    // Watakatifu
    jina: editingCard?.jina || '',
    picha_url: editingCard?.picha_url || '',
    historia: editingCard?.historia || '',
    miujiza: editingCard?.miujiza || '',
    sala: editingCard?.sala || '',
    siku_ya_sikukuu: editingCard?.siku_ya_sikukuu || '',
    // Bible Verse
    kichwa: editingCard?.kichwa || '',
    rejea: editingCard?.rejea || '',
    mstari: editingCard?.mstari || '',
    funzo: editingCard?.funzo || '',
    // Masomo
    jina_la_dominika: editingCard?.jina_la_dominika || '',
    somo_la_1: editingCard?.somo_la_1 || '',
    wimbo_wa_katikati: editingCard?.wimbo_wa_katikati || '',
    somo_la_2: editingCard?.somo_la_2 || '',
    shangilio: editingCard?.shangilio || '',
    injili: editingCard?.injili || '',
    rangi_ya_mavazi: editingCard?.rangi_ya_mavazi || '',
    mwaka_wa_liturujia: editingCard?.mwaka_wa_liturujia || '',
    // Wimbo
    jina_la_wimbo: editingCard?.jina_la_wimbo || '',
    audio_url: editingCard?.audio_url || '',
    video_url: editingCard?.video_url || '',
    media_type: editingCard?.media_type || 'audio'
  })

  const [showUpload, setShowUpload] = useState(false)
  const [uploadField, setUploadField] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name in formData) {
      setFormData(prev => ({ ...prev, [name]: value }))
    } else {
      setDetails(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleUploadComplete = (result) => {
    setDetails(prev => ({ ...prev, [uploadField]: result.url }))
    setShowUpload(false)
  }

  const getTitle = () => {
    if (cardType === 'watakatifu') return details.jina
    if (cardType === 'bible_verse') return details.kichwa
    if (cardType === 'masomo') return details.jina_la_dominika
    if (cardType === 'wimbo') return details.jina_la_wimbo
    return formData.title
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const owner = getOwnerFromLocal()
    
    const cardData = {
      card_type: cardType,
      title: getTitle(),
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      is_active: formData.is_active,
      is_published: formData.is_published,
      created_by: owner?.id
    }
    
    try {
      await createCard(cardData, details)
      showToast('Card imeongezwa!', 'success')
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
        placeholder="Title ya card"
      />
      
      <FormDate 
        label="Start Date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />
      
      <FormDate 
        label="End Date (optional)"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
      />

      {/* Watakatifu Fields */}
      {cardType === 'watakatifu' && (
        <>
          <FormInput 
            label="Jina la Mtakatifu"
            name="jina"
            value={details.jina}
            onChange={handleChange}
            required
          />
          
          <div>
            <label className="form-label">Picha</label>
            <div className="flex gap-2 items-center">
              <button type="button" className="btn-secondary" onClick={() => {
                setUploadField('picha_url')
                setShowUpload(true)
              }}>
                📤 Upload Picha
              </button>
              {details.picha_url && (
                <img src={details.picha_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
              )}
            </div>
          </div>
          
          <FormTextarea 
            label="Historia"
            name="historia"
            value={details.historia}
            onChange={handleChange}
            rows={4}
            required
          />
          
          <FormTextarea 
            label="Miujiza"
            name="miujiza"
            value={details.miujiza}
            onChange={handleChange}
            rows={3}
          />
          
          <FormTextarea 
            label="Sala"
            name="sala"
            value={details.sala}
            onChange={handleChange}
            rows={3}
            required
          />
        </>
      )}

      {/* Bible Verse Fields */}
      {cardType === 'bible_verse' && (
        <>
          <FormInput 
            label="Kichwa"
            name="kichwa"
            value={details.kichwa}
            onChange={handleChange}
            required
          />
          
          <FormInput 
            label="Rejea (mfano: Yohana 3:16)"
            name="rejea"
            value={details.rejea}
            onChange={handleChange}
            required
          />
          
          <FormTextarea 
            label="Mstari"
            name="mstari"
            value={details.mstari}
            onChange={handleChange}
            rows={3}
            required
          />
          
          <FormTextarea 
            label="Funzo"
            name="funzo"
            value={details.funzo}
            onChange={handleChange}
            rows={3}
          />
        </>
      )}

      {/* Masomo Fields */}
      {cardType === 'masomo' && (
        <>
          <FormInput 
            label="Jina la Dominika"
            name="jina_la_dominika"
            value={details.jina_la_dominika}
            onChange={handleChange}
            required
          />
          
          <FormTextarea 
            label="Somo la 1"
            name="somo_la_1"
            value={details.somo_la_1}
            onChange={handleChange}
            rows={3}
            required
          />
          
          <FormTextarea 
            label="Wimbo wa Katikati"
            name="wimbo_wa_katikati"
            value={details.wimbo_wa_katikati}
            onChange={handleChange}
            rows={2}
            required
          />
          
          <FormTextarea 
            label="Somo la 2"
            name="somo_la_2"
            value={details.somo_la_2}
            onChange={handleChange}
            rows={3}
            required
          />
          
          <FormTextarea 
            label="Shangilio"
            name="shangilio"
            value={details.shangilio}
            onChange={handleChange}
            rows={2}
            required
          />
          
          <FormTextarea 
            label="Injili"
            name="injili"
            value={details.injili}
            onChange={handleChange}
            rows={3}
            required
          />
          
          <FormSelect 
            label="Rangi ya Mavazi"
            name="rangi_ya_mavazi"
            value={details.rangi_ya_mavazi}
            onChange={handleChange}
            options={[
              { value: 'kijani', label: 'Kijani' },
              { value: 'zambarau', label: 'Zambarau' },
              { value: 'nyekundu', label: 'Nyekundu' },
              { value: 'nyeupe', label: 'Nyeupe' }
            ]}
          />
          
          <FormSelect 
            label="Mwaka wa Liturujia"
            name="mwaka_wa_liturujia"
            value={details.mwaka_wa_liturujia}
            onChange={handleChange}
            options={[
              { value: 'A', label: 'Mwaka A' },
              { value: 'B', label: 'Mwaka B' },
              { value: 'C', label: 'Mwaka C' }
            ]}
          />
        </>
      )}

      {/* Wimbo Fields */}
      {cardType === 'wimbo' && (
        <>
          <FormInput 
            label="Jina la Wimbo"
            name="jina_la_wimbo"
            value={details.jina_la_wimbo}
            onChange={handleChange}
            required
          />
          
          <FormSelect 
            label="Media Type"
            name="media_type"
            value={details.media_type}
            onChange={handleChange}
            options={[
              { value: 'audio', label: '🎵 Audio' },
              { value: 'video', label: '🎥 Video' }
            ]}
          />
          
          <div>
            <label className="form-label">Audio/Video</label>
            <div className="flex gap-2 flex-wrap">
              <button type="button" className="btn-secondary" onClick={() => {
                setUploadField('audio_url')
                setShowUpload(true)
              }}>
                📤 Upload Audio
              </button>
              <button type="button" className="btn-secondary" onClick={() => {
                setUploadField('video_url')
                setShowUpload(true)
              }}>
                📤 Upload Video
              </button>
            </div>
            {(details.audio_url || details.video_url) && (
              <div className="mt-2 space-y-2">
                {details.audio_url && (
                  <audio controls className="w-full">
                    <source src={details.audio_url} />
                  </audio>
                )}
                {details.video_url && (
                  <video controls className="w-full rounded-lg">
                    <source src={details.video_url} />
                  </video>
                )}
              </div>
            )}
          </div>
          
          <FormTextarea 
            label="Description"
            name="description"
            value={details.description}
            onChange={handleChange}
            rows={3}
          />
        </>
      )}

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
        title="Upload Media"
      />
    </form>
  )
}