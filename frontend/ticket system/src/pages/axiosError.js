const axiosError = (error='something went wrong', setBackendError) => {
  setBackendError(error);
  setTimeout(() => {
    setBackendError('')
  }, 4000);
}

export default axiosError
