import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reportAPI } from '../services/api'

const ReportForm = () => {
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incident_date: '',
    location: '',
    crime_type: ''
  })
  const [crimeTypes, setCrimeTypes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCrimeTypes()
  }, [])

  const fetchCrimeTypes = async () => {
    const data = await reportAPI.getTypes()
    setCrimeTypes(data)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await reportAPI.create(formData)
    
    if (result.id) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Failed to submit report')
    }
    setLoading(false)
  }

  return (
    <div className="report-form-page">
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

      <main className="form-content">
        <div className="container">
          <div className="form-container">
            <h2>Report a Crime</h2>
            <p className="form-subtitle">Your report is confidential and will be handled by appropriate authorities.</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="crime-form">
              <div className="form-group">
                <label>Incident Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief description of the incident"
                  required
                />
              </div>

              <div className="form-group">
                <label>Type of Crime *</label>
                <select
                  name="crime_type"
                  value={formData.crime_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select crime type</option>
                  {crimeTypes.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date of Incident *</label>
                <input
                  type="date"
                  name="incident_date"
                  value={formData.incident_date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where did the incident occur?"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide as much detail as possible about the incident..."
                  rows={6}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>

            <div className="confidential-note">
              <p>Your information is kept confidential. Only authorized personnel can view your report.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ReportForm
