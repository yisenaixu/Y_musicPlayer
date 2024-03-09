import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  timeout: 15000,
})

request.interceptors.response.use(response => {
  console.log('response', response)
  const res = response.data
  return res
})

export default request
