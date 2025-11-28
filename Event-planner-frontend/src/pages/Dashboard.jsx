import { useState, useEffect } from 'react'
import { eventsAPI } from '../services/api'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const [organizedEvents, setOrganizedEvents] = useState([])
  const [invitedEvents, setInvitedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEvents()
  }, [user.id])

  const loadEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const [organizedRes, invitedRes] = await Promise.allSettled([
        eventsAPI.getOrganizedEvents(user.id),
        eventsAPI.getInvitedEvents(user.id)
      ])

      if (organizedRes.status === 'fulfilled') {
        setOrganizedEvents(organizedRes.value.data || [])
      }
      if (invitedRes.status === 'fulfilled') {
        setInvitedEvents(invitedRes.value.data || [])
      }
    } catch (err) {
      setError('Failed to load events')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h2>
            <ion-icon name="calendar"></ion-icon> Event Planner
          </h2>
          <div className="nav-right">
            <span className="user-name">
              <ion-icon name="person-circle-outline"></ion-icon> Welcome, {user.first_name} {user.last_name}!
            </span>
            <button onClick={onLogout} className="btn btn-logout">
              <ion-icon name="log-out-outline"></ion-icon> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">
            <ion-icon name="hourglass-outline"></ion-icon> Loading events...
          </div>
        ) : (
          <div className="events-grid">
            <div className="events-section">
              <h3>
                <ion-icon name="create-outline"></ion-icon> My Organized Events
              </h3>
              {organizedEvents.length === 0 ? (
                <p className="no-events">
                  <ion-icon name="calendar-clear-outline"></ion-icon>
                  <br />No organized events yet
                </p>
              ) : (
                <div className="events-list">
                  {organizedEvents.map((event) => (
                    <div key={event.id} className="event-card">
                      <ion-icon name="calendar"></ion-icon>
                      <h4>{event.name}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="events-section">
              <h3>
                <ion-icon name="mail-open-outline"></ion-icon> Events I'm Invited To
              </h3>
              {invitedEvents.length === 0 ? (
                <p className="no-events">
                  <ion-icon name="mail-outline"></ion-icon>
                  <br />No event invitations yet
                </p>
              ) : (
                <div className="events-list">
                  {invitedEvents.map((event) => (
                    <div key={event.id} className="event-card">
                      <ion-icon name="calendar"></ion-icon>
                      <h4>{event.name}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

