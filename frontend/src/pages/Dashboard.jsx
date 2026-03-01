import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reportAPI } from '../services/api'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchReports()
    if (user.role === 'admin' || user.role === 'police') {
      fetchStatistics()
    }
  }, [filter])

  const fetchReports = async () => {
    setLoading(true)
    const filters = filter !== 'all' ? { status: filter } : {}
    const data = await reportAPI.getAll(filters)
    setReports(data)
    setLoading(false)
  }

  const fetchStatistics = async () => {
    const data = await reportAPI.getStatistics()
    setStats(data)
  }

  const handleStatusChange = async (id, newStatus) => {
    await reportAPI.updateStatus(id, { status: newStatus })
    fetchReports()
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      verified: '#3b82f6',
      'in-progress': '#8b5cf6',
      resolved: '#10b981',
      rejected: '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>Dashboard</h1>
            <div className="user-info">
              <span>Welcome, {user.name} ({user.role})</span>
              <Link to="/report/new" className="btn btn-primary">Report Crime</Link>
              <button onClick={logout} className="btn btn-outline">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="container">
          {stats && (user.role === 'admin' || user.role === 'police') && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Reports</h3>
                <p className="stat-number">{stats.total}</p>
              </div>
              {stats.byStatus.map(s => (
                <div key={s.status} className="stat-card">
                  <h3>{s.status}</h3>
                  <p className="stat-number">{s.count}</p>
                </div>
              ))}
            </div>
          )}

          <div className="filters">
            <label>Filter by Status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading reports...</div>
          ) : (
            <div className="reports-list">
              {reports.length === 0 ? (
                <p className="no-reports">No reports found.</p>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="report-card">
                    <div className="report-header">
                      <h3>{report.title}</h3>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(report.status) }}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div className="report-info">
                      <p><strong>Type:</strong> {report.crime_type}</p>
                      <p><strong>Location:</strong> {report.location}</p>
                      <p><strong>Date:</strong> {new Date(report.incident_date).toLocaleDateString()}</p>
                      {report.user_name && user.role !== 'citizen' && (
                        <p><strong>Reported by:</strong> {report.user_name}</p>
                      )}
                    </div>
                    <div className="report-actions">
                      <button 
                        onClick={() => navigate(`/report/${report.id}`)}
                        className="btn btn-small"
                      >
                        View Details
                      </button>
                      {(user.role === 'admin' || user.role === 'police') && (
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
