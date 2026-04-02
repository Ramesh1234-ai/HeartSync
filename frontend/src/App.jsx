import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AboutUs from './components/pages/us'
import ChatWindow from './components/chat/chatwindow'
import Dashboard from './components/dashboard/DashboardLayout'
import Login from './components/auth/Clerk'
import Projects from './components/pages/project'
import Editor from './components/editor/Editor'
import History from './pages/History'
import ChatDetail from './pages/ChatDetail'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/chat/:id" element={<ChatDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </AuthProvider>
  )
}
export default App