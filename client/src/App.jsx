import { useState } from 'react'
import Login from './components/Login'
import ChatRoom from './components/ChatRoom'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (username) => {
    setUser({ username, id: `user_${Date.now()}` })
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatRoom user={user} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App