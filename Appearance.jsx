import React, { useState, useEffect } from 'react'
import { getAppearanceSettings, updateAppearanceSetting, getIntroContent, updateIntroContent } from './api.js'
import FormInput from './FormInput.jsx'
import FormTextarea from './FormTextarea.jsx'
import UploadModal from './UploadModal.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import { showToast } from './utils.js'

export default function Appearance() {
  const [settings, setSettings] = useState([])
  const [introContent, setIntroContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadField, setUploadField] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const [settingsData, introData] = await Promise.all([
        getAppearanceSettings(),
        getIntroContent()
      ])
      setSettings(settingsData)
      setIntroContent(introData)
    } catch (error) {
      showToast('Imeshindikana kupata settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = async (key, value) => {
    try {
      await updateAppearanceSetting(key, JSON.stringify(value))
      showToast('Setting ime-updated!', 'success')
      loadSettings()
    } catch (error) {
      showToast('Imeshindikana ku-update setting', 'error')
    }
  }

  const handleIntroChange = (field, value) => {
    setIntroContent(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveIntro = async () => {
    setSaving(true)
    try {
      await updateIntroContent(introContent)
      showToast('Intro content ime-saved!', 'success')
    } catch (error) {
      showToast('Imeshindikana kuhifadhi intro', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUploadComplete = (result) => {
    if (uploadField === 'logo_url') {
      handleIntroChange('logo_url', result.url)
    }
    setShowUpload(false)
  }

  const getSettingValue = (key) => {
    const setting = settings.find(s => s.setting_key === key)
    if (setting?.setting_value) {
      try {
        return JSON.parse(setting.setting_value)
      } catch {
        return setting.setting_value
      }
    }
    return ''
  }

  if (loading) {
    return <LoadingSpinner text="Inapakia Appearance..." />
  }

  return (
    <div className="space-y-6">
      {/* Theme Colors */}
      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">🎨 Theme Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Primary Color</label>
            <input
              type="color"
              value={getSettingValue('primary_color') || '#1e3a5f'}
              onChange={(e) => handleSettingChange('primary_color', e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-200"
            />
          </div>
          
          <div>
            <label className="form-label">Secondary Color</label>
            <input
              type="color"
              value={getSettingValue('secondary_color') || '#f59e0b'}
              onChange={(e) => handleSettingChange('secondary_color', e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-200"
            />
          </div>
          
          <div>
            <label className="form-label">Background Color</label>
            <input
              type="color"
              value={getSettingValue('background_color') || '#f1f5f9'}
              onChange={(e) => handleSettingChange('background_color', e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-200"
            />
          </div>
          
          <div>
            <label className="form-label">Text Color</label>
            <input
              type="color"
              value={getSettingValue('text_color') || '#1e293b'}
              onChange={(e) => handleSettingChange('text_color', e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer border border-gray-200"
            />
          </div>
        </div>
      </div>
      
      {/* Intro Page Settings */}
      {introContent && (
        <div className="dashboard-card">
          <h3 className="text-lg font-bold mb-4">📱 Intro Page Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Logo</label>
              <div className="flex gap-3 items-center">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setUploadField('logo_url')
                    setShowUpload(true)
                  }}
                >
                  📤 Upload Logo
                </button>
                {introContent.logo_url && (
                  <img 
                    src={introContent.logo_url} 
                    alt="Logo" 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>
            
            <FormTextarea 
              label="Intro Text"
              value={introContent.intro_text || ''}
              onChange={(e) => handleIntroChange('intro_text', e.target.value)}
              rows={3}
              placeholder="Karibu KMCAM..."
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="Dots Count"
                type="number"
                value={introContent.dots_count || 3}
                onChange={(e) => handleIntroChange('dots_count', parseInt(e.target.value))}
                min="1"
                max="5"
              />
              
              <div>
                <label className="form-label">Dots Color</label>
                <input
                  type="color"
                  value={introContent.dots_color || '#1e3a5f'}
                  onChange={(e) => handleIntroChange('dots_color', e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                />
              </div>
              
              <div>
                <label className="form-label">Dots Active Color</label>
                <input
                  type="color"
                  value={introContent.dots_active_color || '#f59e0b'}
                  onChange={(e) => handleIntroChange('dots_active_color', e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                />
              </div>
              
              <div>
                <label className="form-label">Background Color</label>
                <input
                  type="color"
                  value={introContent.background_color || '#ffffff'}
                  onChange={(e) => handleIntroChange('background_color', e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                />
              </div>
            </div>
            
            <FormInput 
              label="Install Prompt Title"
              value={introContent.install_prompt_title || ''}
              onChange={(e) => handleIntroChange('install_prompt_title', e.target.value)}
            />
            
            <FormTextarea 
              label="Install Prompt Message"
              value={introContent.install_prompt_message || ''}
              onChange={(e) => handleIntroChange('install_prompt_message', e.target.value)}
              rows={2}
            />
            
            <FormInput 
              label="Install Button Text"
              value={introContent.install_button_text || ''}
              onChange={(e) => handleIntroChange('install_button_text', e.target.value)}
            />
            
            <FormInput 
              label="Skip Button Text"
              value={introContent.skip_button_text || ''}
              onChange={(e) => handleIntroChange('skip_button_text', e.target.value)}
            />
            
            <button 
              onClick={handleSaveIntro}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Inahifadhi...' : '💾 Save Intro Settings'}
            </button>
          </div>
        </div>
      )}
      
      {/* Watermark Settings */}
      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">💧 Watermark Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Watermark Text"
            value={getSettingValue('watermark_text') || 'KMCAM'}
            onChange={(e) => handleSettingChange('watermark_text', e.target.value)}
          />
          
          <div>
            <label className="form-label">Position</label>
            <select 
              className="form-input"
              value={getSettingValue('watermark_position') || 'bottom-right'}
              onChange={(e) => handleSettingChange('watermark_position', e.target.value)}
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="center">Center</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Opacity: {getSettingValue('watermark_opacity') || 70}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={getSettingValue('watermark_opacity') || 70}
              onChange={(e) => handleSettingChange('watermark_opacity', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUploadComplete}
        title="Upload Logo"
        accept="image/*"
      />
    </div>
  )
}