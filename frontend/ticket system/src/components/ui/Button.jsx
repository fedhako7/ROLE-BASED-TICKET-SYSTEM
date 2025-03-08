import React from 'react'
import { ClipLoader } from 'react-spinners'

function Button({ btn, type = 'button', handleClick, isLoading }) {
  return (
    <button
      onClick={handleClick}
      type={type}
      disabled={isLoading}
      className=" flex w-full bg-blue-600 gap-2 justify-center items-center text-white p-2 rounded hover:bg-blue-700"
    >
      {isLoading ? <> <ClipLoader size={20} color='white'/> Please wait... </>: btn}
    </button>
  )
}

export default Button
