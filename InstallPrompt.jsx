import React, { useState } from 'react'
import Modal from './Modal.jsx'
import { installApp, skipInstall } from './pwa.js'
import { showToast } from './utils.js'

export default function InstallPrompt({ onClose, onSkip }) {
  const [installing, setInstalling] = useState(false)
  const [showManual, setShowManual] = useState(false)

  const handleInstall = async () => {
    setInstalling(true)
    const result = await installApp()
    
    if (result.success) {
      showToast(result.message, 'success')
      onClose()
    } else if (result.manual) {
      setShowManual(true)
      setInstalling(false)
    } else {
      showToast(result.message, 'warning')
      setInstalling(false)
    }
  }

  const handleSkip = () => {
    skipInstall()
    onSkip()
  }

  return (
    <Modal isOpen={true} onClose={handleSkip} title="" maxWidth="400px">
      <div className="text-center">
        <div className="install-prompt-icon">
          <img src="/icon-192.png" alt="KMCAM" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Sakinisha KMCAM App</h3>
        <p className="text-sm text-gray-500 mb-6">
          Weka app kwenye home screen yako kwa urahisi!
        </p>
        
        {showManual ? (
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-sm mb-2">📱 Jinsi ya Kusakinisha:</h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-gray-600">
              <li>Bonyeza menu (⋮) kwenye browser</li>
              <li>Chagua "Install App" au "Add to Home Screen"</li>
              <li>Kama ni iPhone: Bonyeza Share → Add to Home Screen</li>
            </ol>
          </div>
        ) : (
          <div className="text-left mb-6 space-y-2 text-sm">
            <p>🚀 Fungua app haraka</p>
            <p>🔔 Pata notifications zote</p>
            <p>📱 App icon kwenye home screen</p>
            <p>⚡ Fanya kazi offline</p>
          </div>
        )}
        
        <div className="space-y-3">
          {!showManual && (
            <button
              onClick={handleInstall}
              disabled={installing}
              className="btn-primary w-full justify-center py-3"
            >
              {installing ? 'Inasakinisha...' : 'Sakinisha'}
            </button>
          )}
          
          <button
            onClick={handleSkip}
            className="w-full px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-50 transition text-sm"
          >
            Baadaye
          </button>
        </div>
      </div>
    </Modal>
  )
}