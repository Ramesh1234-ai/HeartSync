import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AboutUs from './components/pages/us'
import ChatWindow from './components/chat/chatwindow'
import Dashboard from './components/dashboard/DashboardLayout'
import Login from './components/auth/Clerk'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </AuthProvider>
  )
}

export default App