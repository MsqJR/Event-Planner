import { useState, useEffect } from 'react'
import { eventsAPI } from '../services/api'
import EventModal from '../components/EventModal'
import InviteModal from '../components/InviteModal'
import '../pages/Dashboard.css'

function OrganizedEvents({ user }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [user.id])

  const loadEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await eventsAPI.getOrganizedEvents(user.id)
      setEvents(response.data || [])
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load organized events')
      }
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (eventData) => {
    setCreateLoading(true)
    try {
      if (editingEvent) {
        await eventsAPI.updateEvent(editingEvent.id, user.id, eventData)
      } else {
        await eventsAPI.createEvent(user.id, eventData)
      }
      setIsModalOpen(false)
      setEditingEvent(null)
      loadEvents()
    } catch (err) {
      setError(err.response?.data || `Failed to ${editingEvent ? 'update' : 'create'} event`)
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }
    try {
      await eventsAPI.deleteEvent(eventId, user.id)
      loadEvents()
    } catch (err) {
      setError(err.response?.data || 'Failed to delete event')
    }
  }

  const handleInviteUser = async (email, role) => {
    try {
      await eventsAPI.inviteUserByEmail(email, selectedEvent, user.id, role)
      alert('User invited successfully!')
    } catch (err) {
      throw err
    }
  }

  const openInviteModal = (eventId) => {
    setSelectedEvent(eventId)
    setIsInviteModalOpen(true)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>
            <ion-icon name="create-outline"></ion-icon>
            My Organized Events
          </h1>
          <p>Events you've created and are managing</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <ion-icon name="add-outline"></ion-icon>
          Create Event
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">
          <ion-icon name="hourglass-outline"></ion-icon> Loading events...
        </div>
      ) : (
        <div className="events-container">
          {events.length === 0 ? (
            <div className="no-events-card">
              <ion-icon name="calendar-clear-outline"></ion-icon>
              <h3>No organized events yet</h3>
              <p>Create your first event to get started!</p>
            </div>
          ) : (
            <div className="events-grid-list">
              {events.map((event) => (
                <div key={event.id} className="event-card-organizer">
                  <ion-icon name="calendar"></ion-icon>
                  <div className="event-info">
                    <h4>{event.name}</h4>
                  </div>
                  <div className="event-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEditEvent(event)}
                      title="Edit event"
                    >
                      <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button 
                      className="invite-button"
                      onClick={() => openInviteModal(event.id)}
                      title="Invite users"
                    >
                      <ion-icon name="person-add-outline"></ion-icon>
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteEvent(event.id)}
                      title="Delete event"
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateEvent}
        loading={createLoading}
        event={editingEvent}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
        eventId={selectedEvent}
      />
    </div>
  )
}

export default OrganizedEvents
