import React from 'react'

function BackendError({ backendError }) {
  return (
    <>
      {
        backendError &&
        <p className=' italic text-red-800'> {backendError} </p>
      }
    </>
  )
}

export default BackendError