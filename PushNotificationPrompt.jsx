import React, { useState } from 'react'
import Modal from './Modal.jsx'
import { subscribeToPushNotifications } from './push.js'
import { showToast } from './utils.js'

export default function PushNotificationPrompt({ onClose }) {
  const [subscribing, setSubscribing] = useState(false)

  const handleAllow = async () => {
    setSubscribing(true)
    const result = await subscribeToPushNotifications()
    
    if (result.success) {
      showToast(result.message, 'success')
    } else {
      showToast(result.message, 'warning')
    }
    
    setSubscribing(false)
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="" maxWidth="380px">
      <div className="text-center">
        <div className="text-6xl mb-4">🔔</div>
        
        <h3 className="text-xl font-bold mb-2">Pata Notifications</h3>
        <p className="text-sm text-gray-500 mb-6">
          KMCAM inataka kukutumia notifications kuhusu content mpya, comments, na updates.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleAllow}
            disabled={subscribing}
            className="btn-primary w-full justify-center py-3"
          >
            {subscribing ? 'Inatayarisha...' : 'Ruhusu'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-50 transition text-sm"
          >
            La, Asante
          </button>
        </div>
      </div>
    </Modal>
  )
}