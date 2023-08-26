import axios from 'axios'

const LOCAL_STORAGE_JWT = 'jwt'
const QUERY_PARAMETER_INVALID_TOKEN = 'invalidToken'

const apiService = axios.create({
  baseURL: process.env.NEXT_API_URL
})

apiService.interceptors.request.use(
  config => {
    const newConfig = { ...config }
    newConfig.headers.Authorization = `Bearer ${localStorage.getItem(
      LOCAL_STORAGE_JWT
    )}`
    return newConfig
  },
  error => {
    return Promise.reject(error)
  }
)

apiService.interceptors.response.use(
  response => response.data,
  error => {
    if (
      error.response.status === 403 &&
      error.response.data?.error === 'Invalid token'
    ) {
      return window.location.assign(`/?${QUERY_PARAMETER_INVALID_TOKEN}`)
    }
    return Promise.reject(error)
  }
)

export default apiService
