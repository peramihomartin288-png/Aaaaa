import React, { useState, useEffect } from 'react'
import supabase from './supabase.js'
import LoadingSpinner from './LoadingSpinner.jsx'
import { showToast } from './utils.js'

export default function Settings() {
  const [settings, setSettings] = useState({
    app_name: 'KMCAM',
    app_description: 'Kwaya ya Mtakatifu Carlo Acutis',
    registration_open: true,
    default_language: 'sw',
    pwa_install_enabled: true,
    prompt_after_intro: true,
    prompt_after_login: true,
    prompt_after_register: true,
    max_prompt_attempts: 3,
    days_before_reprompt: 7,
    push_enabled: true,
    warning_threshold: 80,
    critical_threshold: 95
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
      
      if (error) throw error
      
      const settingsMap = {}
      data?.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value
      })
      
      setSettings(prev => ({
        ...prev,
        ...settingsMap
      }))
    } catch (error) {
      console.error('Settings error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('settings')
          .upsert({
            setting_key: key,
            setting_value: value
          }, {
            onConflict: 'setting_key'
          })
        
        if (error) throw error
      }
      
      showToast('Settings zime-saved!', 'success')
    } catch (error) {
      showToast('Imeshindikana kuhifadhi settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Inapakia Settings..." />
  }

  return (
    <div className="space-y-6">
      {/* App Settings */}
      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">📱 App Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="form-label">App Name</label>
            <input
              type="text"
              value={settings.app_name}
              onChange={(e) => handleChange('app_name', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div>
            <label className="form-label">App Description</label>
            <textarea
              value={settings.app_description}
              onChange={(e) => handleChange('app_description', e.target.value)}
              className="form-input"
              rows={3}
            />
          </div>
          
          <div>
            <label className="form-label">Default Language</label>
            <select
              value={settings.default_language}
              onChange={(e) => handleChange('default_language', e.target.value)}
              className="form-input"
            >
              <option value="sw">Kiswahili</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.registration_open}
              onChange={(e) => handleChange('registration_open', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-medium text-sm">Registration Open</span>
          </label>
        </div>
      </div>
      
      {/* PWA Settings */}
      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">📲 PWA Settings</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pwa_install_enabled}
              onChange={(e) => handleChange('pwa_install_enabled', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">Install Prompt Enabled</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.prompt_after_intro}
              onChange={(e) => handleChange('prompt_after_intro', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">Prompt After Intro</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.prompt_after_login}
              onChange={(e) => handleChange('prompt_after_login', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">Prompt After Login</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.prompt_after_register}
              onChange={(e) => handleChange('prompt_after_register', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">Prompt After Register</span>
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Max Prompt Attempts</label>
              <input
                type="number"
                value={settings.max_prompt_attempts}
                onChange={(e) => handleChange('max_prompt_attempts', parseInt(e.target.value))}
                className="form-input"
                min="1"
                max="10"
              />
            </div>
            
            <div>
              <label className="form-label">Days Before Reprompt</label>
              <input
                type="number"
                value={settings.days_before_reprompt}
                onChange={(e) => handleChange('days_before_reprompt', parseInt(e.target.value))}
                className="form-input"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">🔔 Notification Settings</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.push_enabled}
              onChange={(e) => handleChange('push_enabled', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">Push Notifications Enabled</span>
          </label>
        </div>
      </div>
      
      {/* Storage Settings */}
      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">💾 Storage Settings</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Warning Threshold (%)</label>
            <input
              type="number"
              value={settings.warning_threshold}
              onChange={(e) => handleChange('warning_threshold', parseInt(e.target.value))}
              className="form-input"
              min="50"
              max="95"
            />
          </div>
          
          <div>
            <label className="form-label">Critical Threshold (%)</label>
            <input
              type="number"
              value={settings.critical_threshold}
              onChange={(e) => handleChange('critical_threshold', parseInt(e.target.value))}
              className="form-input"
              min="60"
              max="100"
            />
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <button 
        onClick={handleSave}
        disabled={saving}
        className="btn-primary py-4 px-8 text-lg w-full sm:w-auto"
      >
        {saving ? 'Inahifadhi...' : '💾 Save All Settings'}
      </button>
    </div>
  )
}