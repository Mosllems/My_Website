import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const getHomeInfo         = () => api.get('/home/')
export const getAboutInfo        = () => api.get('/about/')
export const getProjects         = () => api.get('/projects/')
export const getFeaturedProjects = () => api.get('/projects/?featured=true')
export const getSkills           = () => api.get('/skills/')
export const sendContact         = (data) => api.post('/contact/', data)

export default api
