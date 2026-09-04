import { useState, useEffect } from 'react'
import { getOwnerFromLocal, isOwnerLoggedIn } from './auth.js'

export default function useAuth() {
  const [owner, setOwner] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const loggedIn = isOwnerLoggedIn()
    const ownerData = getOwnerFromLocal()
    
    setIsLoggedIn(loggedIn)
    setOwner(ownerData)
    setLoading(false)
  }

  return {
    owner,
    isLoggedIn,
    loading,
    refreshAuth: checkAuth
  }
}