import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h2>Event Planner</h2>
          <div className="nav-right">
            <span className="user-name">
              Welcome, {user.first_name} {user.last_name}!
            </span>
            <button onClick={onLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Dashboard

