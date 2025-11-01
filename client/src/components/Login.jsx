import { useState } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters long')
      return
    }

    setError('')
    onLogin(username.trim())
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💬 Socket.io Chat</h1>
        <p>Join the conversation in real-time</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Choose a username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              maxLength={20}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            disabled={!username.trim()}
            className="login-button"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login