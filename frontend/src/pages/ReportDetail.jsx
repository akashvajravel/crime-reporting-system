import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reportAPI } from '../services/api'

const ReportDetail = () => {
  const { id } = useParams()
  const { user, logout } = useAuth()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    const data = await reportAPI.getById(id)
    setReport(data)
    setLoading(false)
  }

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    await reportAPI.updateStatus(id, { status: newStatus })
    fetchReport()
    setUpdating(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await reportAPI.delete(id)
      navigate('/dashboard')
    }
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

  if (loading) return <div className="loading">Loading...</div>
  if (!report) return <div className="error">Report not found</div>

  return (
    <div className="report-detail-page">
      <header className="form-header">
        <div className="container">
          <div className="header-content">
            <Link to="/dashboard" className="back-link">&larr; Back to Dashboard</Link>
            <div className="user-info">
              <span>{user.name}</span>
              <button onClick={logout} className="btn btn-outline">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="detail-content">
        <div className="container">
          <div className="detail-container">
            <div className="detail-header">
              <h1>{report.title}</h1>
              <span 
                className="status-badge large" 
                style={{ backgroundColor: getStatusColor(report.status) }}
              >
                {report.status}
              </span>
            </div>

            <div className="detail-grid">
              <div className="detail-main">
                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{report.description}</p>
                </div>

                <div className="detail-section">
                  <h3>Incident Details</h3>
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span>{report.crime_type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span>{new Date(report.incident_date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Location:</span>
                    <span>{report.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Reported:</span>
                    <span>{new Date(report.created_at).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Last Updated:</span>
                    <span>{new Date(report.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="detail-sidebar">
                {(user.role === 'admin' || user.role === 'police') && (
                  <div className="sidebar-section">
                    <h3>Reporter Information</h3>
                    <p><strong>Name:</strong> {report.user_name}</p>
                    <p><strong>Email:</strong> {report.user_email}</p>
                    {report.user_phone && <p><strong>Phone:</strong> {report.user_phone}</p>}
                  </div>
                )}

                {report.assigned_to_name && (
                  <div className="sidebar-section">
                    <h3>Assigned To</h3>
                    <p>{report.assigned_to_name}</p>
                  </div>
                )}

                {(user.role === 'admin' || user.role === 'police') && (
                  <div className="sidebar-section">
                    <h3>Update Status</h3>
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={updating}
                      className="status-select-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}

                {user.role === 'admin' && (
                  <div className="sidebar-section">
                    <button onClick={handleDelete} className="btn btn-danger btn-block">
                      Delete Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ReportDetail
