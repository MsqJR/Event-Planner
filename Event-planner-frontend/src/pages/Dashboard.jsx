import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import OrganizedEvents from './OrganizedEvents'
import InvitedEvents from './InvitedEvents'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  return (
    <div className="dashboard-layout">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="dashboard-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/organized" replace />} />
          <Route path="/organized" element={<OrganizedEvents user={user} />} />
          <Route path="/invited" element={<InvitedEvents user={user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard

