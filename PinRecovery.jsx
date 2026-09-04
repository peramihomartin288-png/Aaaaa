import React, { useState } from 'react'
import { recoverOwnerPin } from './auth.js'

export default function PinRecovery({ onBackToLogin }) {
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!searchValue.trim()) {
      setError('Tafadhali weka jina au namba ya simu')
      return
    }
    
    setLoading(true)
    setError('')
    setResult(null)
    
    const response = await recoverOwnerPin(searchValue.trim())
    
    if (response.success) {
      setResult(response)
    } else {
      setError(response.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">PIN Recovery</h1>
          <p className="text-sm text-gray-500 mt-2">
            Ingiza jina lako au namba ya simu kurudisha PIN
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                setError('')
                setResult(null)
              }}
              placeholder="Jina kamili au namba ya simu"
              className="w-full text-center py-4 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none transition"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">❌ {error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-950 transition disabled:opacity-50"
          >
            {loading ? 'Inatafuta...' : 'Rudisha PIN'}
          </button>
        </form>
        
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">PIN yako ni:</p>
            <p className="text-4xl font-extrabold text-green-600 tracking-widest mt-1">
              {result.pin}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Jina: {result.full_name}
            </p>
          </div>
        )}
        
        <div className="text-center mt-6">
          <button
            onClick={onBackToLogin}
            className="text-sm text-gray-500 hover:text-blue-900 transition"
          >
            ← Rudi kwenye Login
          </button>
        </div>
      </div>
    </div>
  )
}