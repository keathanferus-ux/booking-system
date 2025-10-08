import { Router, Route } from 'preact-router'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Rooms from './pages/Rooms'
import Teams from './pages/Teams'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/login" component={Login} />
        <Route path="/" component={Layout}>
          <Route path="/" component={Dashboard} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/rooms" component={Rooms} />
          <Route path="/teams" component={Teams} />
          <Route path="/admin" component={Admin} />
        </Route>
      </Router>
    </AuthProvider>
  )
}
