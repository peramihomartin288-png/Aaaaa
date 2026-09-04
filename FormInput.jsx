import React from 'react'

export default function FormInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  maxLength,
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
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        required={required}
        maxLength={maxLength}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}