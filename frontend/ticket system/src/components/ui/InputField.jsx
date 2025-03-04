import React from 'react'

const InputField = ({ label, type, val, setVal }) => {

return (
  <div className="mb-4">
    <label className="block ">{label}</label>
    <input
      type={type || label}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      className="w-full p-2 border rounded"
      required
    />
  </div>
)
}

export default InputField