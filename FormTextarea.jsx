import React from 'react'

export default function FormTextarea({ 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 4,
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
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="form-input"
        required={required}
        {...props}
      />
    </div>
  )
}