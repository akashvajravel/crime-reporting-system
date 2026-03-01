import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ReportForm from './pages/ReportForm'
import ReportDetail from './pages/ReportDetail'

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <div className="loading">Loading...</div>
  
  if (!user) return <Navigate to="/login" />
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/report/new" element={
          <PrivateRoute>
            <ReportForm />
          </PrivateRoute>
        } />
        <Route path="/report/:id" element={
          <PrivateRoute>
            <ReportDetail />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
