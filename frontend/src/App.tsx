import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Booking from './pages/Booking'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import BookingRequests from './pages/BookingRequests'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Booking />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path="/booking/:id" element={<BookingRequests />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
