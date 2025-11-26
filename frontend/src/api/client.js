import axios from 'axios'

const client = axios.create({
  baseURL: '/api', // Proxy will forward to the actual backend URL
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default client
