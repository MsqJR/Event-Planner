import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ user, onLogout }) {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <ion-icon name="calendar"></ion-icon>
        <h2>Event Planner</h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard/organized" className={`nav-item ${isActive('/dashboard/organized')}`}>
          <ion-icon name="create-outline"></ion-icon>
          <span>My Organized Events</span>
        </Link>
        <Link to="/dashboard/invited" className={`nav-item ${isActive('/dashboard/invited')}`}>
          <ion-icon name="mail-open-outline"></ion-icon>
          <span>Events I'm Invited To</span>
        </Link>
        <Link to="/dashboard/search" className={`nav-item ${isActive('/dashboard/search')}`}>
          <ion-icon name="search-outline"></ion-icon>
          <span>Search Events</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <ion-icon name="person-circle"></ion-icon>
          </div>
          <div className="user-info">
            <div className="user-name">{user.first_name} {user.last_name}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
        <button onClick={onLogout} className="btn-logout">
          <ion-icon name="log-out-outline"></ion-icon>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
