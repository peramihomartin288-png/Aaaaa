import React from 'react'
import Modal from './Modal.jsx'

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Unathibitisha?',
  message = 'Una uhakika unataka kufanya hii action?',
  confirmText = 'Ndio, Endelea',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' au 'success'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="400px">
      <div className="text-center py-4">
        <div className="text-5xl mb-4">
          {type === 'danger' ? '⚠️' : '✅'}
        </div>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="btn-ghost"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={type === 'danger' ? 'btn-danger' : 'btn-primary'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}