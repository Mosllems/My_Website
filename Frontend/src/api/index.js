import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const getProfile    = ()     => api.get('/profile/')
export const getSkills     = ()     => api.get('/skills/')
export const getInterests  = ()     => api.get('/interests/')
export const getEducation  = ()     => api.get('/education/')
export const getExperience = ()     => api.get('/experience/')
export const sendContact   = (data) => api.post('/contact/', data)
export const getProjects   = (params = {}, config = {}) => api.get('/projects/', { params, ...config })
export const getProject    = (id, config = {})          => api.get(`/projects/${id}/`, config)

export default api
