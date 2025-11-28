import { useState } from 'react'
import './EventModal.css'

function EventModal({ isOpen, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      location: '',
      description: '',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <ion-icon name="add-circle-outline"></ion-icon>
            Create New Event
          </h2>
          <button className="close-button" onClick={handleClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">
              <ion-icon name="text-outline"></ion-icon> Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter event name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">
                <ion-icon name="calendar-outline"></ion-icon> Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">
                <ion-icon name="time-outline"></ion-icon> Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">
              <ion-icon name="location-outline"></ion-icon> Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter event location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <ion-icon name="document-text-outline"></ion-icon> Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter event description (optional)"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <ion-icon name="hourglass-outline"></ion-icon> Creating...
                </>
              ) : (
                <>
                  <ion-icon name="add-outline"></ion-icon> Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
