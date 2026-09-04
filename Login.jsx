import React, { useState } from 'react'
import { ownerLoginByPin } from './auth.js'
import { showToast } from './utils.js'

export default function Login({ onLoginSuccess, onForgotPin }) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!pin || pin.length < 4) {
      setError('Tafadhali weka PIN (tarakimu 4)')
      return
    }
    
    setLoading(true)
    setError('')
    
    const result = await ownerLoginByPin(pin)
    
    if (result.success) {
      showToast(`Karibu ${result.data.full_name}!`, 'success')
      onLoginSuccess()
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo-source.jpg" 
            alt="KMCAM Logo" 
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <h1 className="text-3xl font-extrabold text-gray-900">KMCAM</h1>
          <p className="text-sm text-gray-500 mt-1">Owner Panel</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-center mb-3 text-gray-700">
              Weka PIN yako
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))
                setError('')
              }}
              placeholder="••••"
              maxLength={4}
              className="w-full text-center text-3xl font-bold tracking-[12px] py-4 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none transition bg-gray-50"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">❌ {error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-900 text-white rounded-xl font-semibold text-lg hover:bg-blue-950 transition disabled:opacity-50"
          >
            {loading ? 'Inaingia...' : 'Ingia'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <button
            onClick={onForgotPin}
            className="text-sm text-gray-500 hover:text-blue-900 transition"
          >
            Umesahau PIN?
          </button>
        </div>
      </div>
    </div>
  )
}