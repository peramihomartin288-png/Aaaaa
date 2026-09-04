import React from 'react'

export default function FormDate({ 
  label, 
  value, 
  onChange, 
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
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="form-input"
        required={required}
        {...props}
      />
    </div>
  )
}