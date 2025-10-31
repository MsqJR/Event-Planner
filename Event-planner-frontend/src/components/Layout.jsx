import { Link } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            Event Planner
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/users" className="nav-link">Users</Link>
            <Link to="/events" className="nav-link">Events</Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Event Planner. Phase 0 Implementation.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

