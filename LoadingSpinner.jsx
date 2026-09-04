import React from 'react'

export default function LoadingSpinner({ text = 'Inapakia...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="spinner" />
      <p className="mt-4 text-sm text-gray-500">{text}</p>
    </div>
  )
}