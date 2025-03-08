import React from 'react'

const InputField = ({ label, type='text', val, onChange, error }) => {

  return (
    <div className="mb-4">
      <label className="block ">{label}</label>
      <input
        type={type || label}
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      {error && <p className="italic text-red-500 text-sm">{error}</p>}
    </div>
  )
}

export default InputField
