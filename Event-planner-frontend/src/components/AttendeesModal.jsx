import { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import './AttendeesModal.css';

const AttendeesModal = ({ isOpen, onClose, event }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && event?.id) {
      loadAttendees();
    }
  }, [isOpen, event?.id]);

  const loadAttendees = async () => {
    setLoading(true);
    setError('');
    console.log('Loading attendees for event:', event);
    try {
      const response = await eventsAPI.getAttendees(event.id);
      console.log('Attendees response:', response.data);
      setAttendees(response.data || []);
    } catch (err) {
      console.error('Error loading attendees:', err);
      setError(err.response?.data || 'Failed to load attendees');
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Going':
        return '#28a745';
      case 'Maybe':
        return '#ffc107';
      case 'Not Going':
        return '#dc3545';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Going':
        return 'checkmark-circle';
      case 'Maybe':
        return 'help-circle';
      case 'Not Going':
        return 'close-circle';
      default:
        return 'ellipse';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'organizer':
        return { text: 'Organizer', color: '#000000' };
      case 'collaborator':
        return { text: 'Collaborator', color: '#007bff' };
      case 'invitee':
        return { text: 'Invitee', color: '#6c757d' };
      default:
        return { text: role, color: '#999' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="attendees-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <ion-icon name="people-outline"></ion-icon>
            {event?.name || 'Event'} - Attendees
          </h2>
          <button className="close-button" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">
            <ion-icon name="hourglass-outline" className="spin"></ion-icon>
            Loading attendees...
          </div>
        ) : (
          <div className="attendees-list">
            {attendees.length === 0 ? (
              <div className="no-attendees">
                <ion-icon name="person-outline"></ion-icon>
                <p>No attendees yet</p>
              </div>
            ) : (
              attendees.map((attendee) => {
                const roleBadge = getRoleBadge(attendee.role);
                return (
                  <div key={attendee.user_id} className="attendee-item">
                    <div className="attendee-avatar">
                      <ion-icon name="person-circle"></ion-icon>
                    </div>
                    <div className="attendee-info">
                      <div className="attendee-name">
                        {attendee.first_name} {attendee.last_name}
                      </div>
                      <div className="attendee-email">{attendee.email}</div>
                    </div>
                    <div className="attendee-badges">
                      <span 
                        className="role-badge" 
                        style={{ backgroundColor: roleBadge.color }}
                      >
                        {roleBadge.text}
                      </span>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(attendee.status) }}
                      >
                        <ion-icon name={getStatusIcon(attendee.status)}></ion-icon>
                        {attendee.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="attendees-summary">
          <div className="summary-item">
            <ion-icon name="checkmark-circle" style={{ color: '#28a745' }}></ion-icon>
            <span>{attendees.filter(a => a.status === 'Going').length} Going</span>
          </div>
          <div className="summary-item">
            <ion-icon name="help-circle" style={{ color: '#ffc107' }}></ion-icon>
            <span>{attendees.filter(a => a.status === 'Maybe').length} Maybe</span>
          </div>
          <div className="summary-item">
            <ion-icon name="close-circle" style={{ color: '#dc3545' }}></ion-icon>
            <span>{attendees.filter(a => a.status === 'Not Going').length} Not Going</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeesModal;
