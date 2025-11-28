import { useState } from 'react';
import './InviteModal.css';

const InviteModal = ({ isOpen, onClose, onInvite, eventId }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('invitee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      await onInvite(email, role);
      setEmail('');
      setRole('invitee');
      onClose();
    } catch (err) {
      setError(err.response?.data || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <ion-icon name="person-add-outline"></ion-icon>
            Invite User
          </h2>
          <button className="close-button" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <ion-icon name="mail-outline"></ion-icon>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <ion-icon name="shield-outline"></ion-icon>
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="invitee">Invitee (Can attend)</option>
              <option value="collaborator">Collaborator (Can help organize)</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <ion-icon name="hourglass-outline" className="spin"></ion-icon>
                  Inviting...
                </>
              ) : (
                <>
                  <ion-icon name="send-outline"></ion-icon>
                  Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
