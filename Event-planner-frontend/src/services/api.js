import axios from 'axios'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
console.log("this is api url" + API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Authentication API (Phase 0)
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  check: () => api.get('/auth/check'),
}

// Events API
export const eventsAPI = {
  getOrganizedEvents: (userId) => api.post('/events/organized', { user_id: userId }),
  getInvitedEvents: (userId) => api.post('/events/invited', { user_id: userId }),
  createEvent: (userId, eventData) => api.post('/events/create', { ...eventData, user_id: userId }),
  updateEvent: (eventId, userId, eventData) => api.post('/events/update', { event_id: eventId, user_id: userId, ...eventData }),
  deleteEvent: (eventId, userId) => api.post('/events/delete', { event_id: eventId, user_id: userId }),
  inviteUser: (data) => api.post('/events/invite', data),
  setStatus: (eventId, userId, status) => api.post('/events/status', { event_id: eventId, user_id: userId, status }),
  getAttendees: (eventId) => api.post('/events/attendees', { event_id: eventId }),
  getEventDetails: (eventId) => api.post('/events/details', { event_id: eventId }),
  inviteUserByEmail: (email, eventId, userId, role) => api.post('/events/invite-email', { email, event_id: eventId, user_id: userId, role }),
  searchEvents: (filters) => api.post('/events/search', filters),
}

export default api
