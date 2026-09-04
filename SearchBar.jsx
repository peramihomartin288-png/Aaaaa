import React from 'react'

export default function SearchBar({ placeholder = 'Tafuta...', value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
  )
}