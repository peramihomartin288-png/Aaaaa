import React, { useState } from 'react'
import { runSqlQuery, saveQueryHistory, getQueryHistory, clearQueryHistory, saveQuery, getSavedQueries, deleteSavedQuery, commonQueries } from './sqlApi.js'
import { showToast } from './utils.js'
import Modal from './Modal.jsx'
import FormInput from './FormInput.jsx'

export default function SqlEditor() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState(getQueryHistory())
  const [savedQueries, setSavedQueries] = useState(getSavedQueries())
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveName, setSaveName] = useState('')

  const handleRunQuery = async () => {
    if (!query.trim()) {
      showToast('Tafadhali andika query kwanza', 'warning')
      return
    }
    
    setLoading(true)
    setError(null)
    setResults(null)
    
    const result = await runSqlQuery(query)
    
    if (result.success) {
      setResults(result.data)
      const updatedHistory = saveQueryHistory(query, true)
      setHistory(updatedHistory)
      showToast('Query imefanikiwa!', 'success')
    } else {
      setError(result.error)
      const updatedHistory = saveQueryHistory(query, false, result.error)
      setHistory(updatedHistory)
      showToast('Query imeshindikana', 'error')
    }
    
    setLoading(false)
  }

  const handleClear = () => {
    setQuery('')
    setResults(null)
    setError(null)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(query)
    showToast('Query ime-copied!', 'success')
  }

  const handleSaveQuery = () => {
    if (!saveName.trim() || !query.trim()) {
      showToast('Tafadhali weka jina na query', 'warning')
      return
    }
    
    const updated = saveQuery(saveName, query)
    setSavedQueries(updated)
    setSaveName('')
    setShowSaveModal(false)
    showToast('Query ime-saved!', 'success')
  }

  const handleClearHistory = () => {
    clearQueryHistory()
    setHistory([])
    showToast('History ime-futwa', 'success')
  }

  const handleRunSavedQuery = (savedQuery) => {
    setQuery(savedQuery)
  }

  const handleDeleteSavedQuery = (queryId) => {
    const updated = deleteSavedQuery(queryId)
    setSavedQueries(updated)
    showToast('Saved query ime-futwa', 'success')
  }

  return (
    <div className="space-y-6">
      {/* SQL Editor */}
      <div>
        <h3 className="text-lg font-bold mb-4">💾 SQL Editor</h3>
        
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sql-editor"
          placeholder="SELECT * FROM users;"
          rows={8}
        />
        
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={handleRunQuery}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Inaendesha...' : '▶ Run Query'}
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="btn-secondary"
          >
            💾 Save
          </button>
          <button
            onClick={handleCopy}
            className="btn-ghost"
          >
            📋 Copy
          </button>
          <button
            onClick={handleClear}
            className="btn-ghost"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
      
      {/* Common Queries */}
      <div className="dashboard-card">
        <h4 className="font-semibold mb-3">📌 Common Queries</h4>
        <div className="flex gap-2 flex-wrap">
          {commonQueries.map((cq, index) => (
            <button
              key={index}
              onClick={() => setQuery(cq.query)}
              className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {cq.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm font-semibold">❌ Error:</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}
      
      {/* Results */}
      {results && (
        <div className="dashboard-card">
          <h4 className="font-semibold mb-3">📊 Results</h4>
          {Array.isArray(results) && results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="sql-result-table">
                <thead>
                  <tr>
                    {Object.keys(results[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 100).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-2">
                Showing {Math.min(results.length, 100)} of {results.length} rows
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Query imefanikiwa! No rows returned.</p>
          )}
        </div>
      )}
      
      {/* History */}
      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold">📋 Query History</h4>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear History
            </button>
          )}
        </div>
        
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm">Hakuna history bado</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <span>{item.success ? '✅' : '❌'}</span>
                <div className="flex-1">
                  <p 
                    className="cursor-pointer hover:text-blue-600 transition"
                    onClick={() => setQuery(item.query)}
                  >
                    {item.query.length > 60 ? item.query.substring(0, 60) + '...' : item.query}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Saved Queries */}
      <div className="dashboard-card">
        <h4 className="font-semibold mb-3">💾 Saved Queries</h4>
        
        {savedQueries.length === 0 ? (
          <p className="text-gray-400 text-sm">Hakuna saved queries bado</p>
        ) : (
          <div className="space-y-2">
            {savedQueries.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span>📌</span>
                <span className="font-semibold">{item.name}</span>
                <button
                  onClick={() => handleRunSavedQuery(item.query)}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
                >
                  Run
                </button>
                <button
                  onClick={() => handleDeleteSavedQuery(item.id)}
                  className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Query Modal */}
      <Modal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)}
        title="Save Query"
        maxWidth="400px"
      >
        <FormInput 
          label="Query Name"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Mfano: View All Users"
          required
        />
        
        <button 
          onClick={handleSaveQuery}
          className="btn-primary w-full justify-center"
        >
          💾 Save Query
        </button>
      </Modal>
    </div>
  )
}