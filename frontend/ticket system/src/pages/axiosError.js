const axiosError = (error='something went wrong', setBackendError) => {
  setBackendError(error);
  setTimeout(() => {
    setBackendError('')
  }, 3000);
}

export default axiosError
