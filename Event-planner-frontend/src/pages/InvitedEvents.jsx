import { useState, useEffect } from 'react'
import { eventsAPI } from '../services/api'
import '../pages/Dashboard.css'

function InvitedEvents({ user }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusUpdating, setStatusUpdating] = useState({})

  useEffect(() => {
    loadEvents()
  }, [user.id])

  const loadEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await eventsAPI.getInvitedEvents(user.id)
      setEvents(response.data || [])
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load invited events')
      }
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (eventId, status) => {
    setStatusUpdating({ ...statusUpdating, [eventId]: true })
    try {
      await eventsAPI.setStatus(eventId, user.id, status)
      loadEvents()
    } catch (err) {
      setError(err.response?.data || 'Failed to update status')
    } finally {
      setStatusUpdating({ ...statusUpdating, [eventId]: false })
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>
          <ion-icon name="mail-open-outline"></ion-icon>
          Events I'm Invited To
        </h1>
        <p>Events you've been invited to attend</p>
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
              <ion-icon name="mail-outline"></ion-icon>
              <h3>No event invitations yet</h3>
              <p>You'll see events here when someone invites you!</p>
            </div>
          ) : (
            <div className="events-grid-list">
              {events.map((event) => (
                <div key={event.id} className="event-card-with-status">
                  <div className="event-card-content">
                    <ion-icon name="calendar"></ion-icon>
                    <div className="event-info">
                      <h4>{event.name}</h4>
                    </div>
                  </div>
                  <div className="status-buttons">
                    <button
                      className="status-btn going"
                      onClick={() => handleStatusChange(event.id, 'Going')}
                      disabled={statusUpdating[event.id]}
                      title="Going"
                    >
                      <ion-icon name="checkmark-circle-outline"></ion-icon>
                    </button>
                    <button
                      className="status-btn maybe"
                      onClick={() => handleStatusChange(event.id, 'Maybe')}
                      disabled={statusUpdating[event.id]}
                      title="Maybe"
                    >
                      <ion-icon name="help-circle-outline"></ion-icon>
                    </button>
                    <button
                      className="status-btn not-going"
                      onClick={() => handleStatusChange(event.id, 'Not Going')}
                      disabled={statusUpdating[event.id]}
                      title="Not Going"
                    >
                      <ion-icon name="close-circle-outline"></ion-icon>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default InvitedEvents
