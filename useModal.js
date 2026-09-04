import { useState, useCallback } from 'react'

export default function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)
  const [modalData, setModalData] = useState(null)

  const openModal = useCallback((data = null) => {
    setModalData(data)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalData(null)
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    modalData,
    openModal,
    closeModal
  }
}