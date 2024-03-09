import axios from 'axios'

export const createAxiosByIntercepors = config => {
  const instance = axios.create({
    ...config,
  })
  instance.interceptors.request.use(
    config => {
      return config
    },
    error => {
      return Promise.reject(error)
    },
  )
  instance.interceptors.response.use(
    response => {
      const data = response.data
      return data
    },
    error => {
      return Promise.reject(error)
    },
  )
  return instance
}
