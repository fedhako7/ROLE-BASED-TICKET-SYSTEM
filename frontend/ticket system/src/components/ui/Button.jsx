import React from 'react'

function Button({ btn, type = 'button', handleClick }) {
  return (
    <button
      onClick={handleClick}
      type={type}
      className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
    >
      {btn}
    </button>
  )
}

export default Button