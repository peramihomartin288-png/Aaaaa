import React from 'react'

export default function FormSelect({ 
  label, 
  value, 
  onChange, 
  options = [],
  required = false,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="form-input"
        required={required}
        {...props}
      >
        <option value="">-- Chagua --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}