import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
  const { user, logout } = useAuth()

  return (
    <div className="landing">
      <header className="header">
        <div className="container">
          <h1>Crime Reporting System</h1>
          <p>Report crimes against women safely and securely</p>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <div className="nav-brand">Safety First</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={logout} className="btn btn-outline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <h2>Your Voice Matters</h2>
          <p>Report incidents safely and help create a safer community for everyone.</p>
          {!user && (
            <Link to="/register" className="btn btn-large">Report a Crime</Link>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Anonymous Reporting</h3>
              <p>Your identity is protected. Report crimes without fear of retaliation.</p>
            </div>
            <div className="feature-card">
              <h3>Quick Response</h3>
              <p>Reports are immediately forwarded to appropriate authorities.</p>
            </div>
            <div className="feature-card">
              <h3>Track Progress</h3>
              <p>Follow up on your report status anytime through your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="crime-types">
        <div className="container">
          <h2>Types of Crimes We Handle</h2>
          <div className="crime-list">
            <span>Domestic Violence</span>
            <span>Harassment</span>
            <span>Stalking</span>
            <span>Assault</span>
            <span>Cyber Crime</span>
            <span>Dowry Harassment</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>Emergency Helpline: 1091 | For immediate assistance</p>
          <p>&copy; 2024 Crime Reporting System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
