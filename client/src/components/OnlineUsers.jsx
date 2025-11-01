import React, { useState } from 'react'
import './OnlineUsers.css'

const OnlineUsers = ({ users, currentUser, onPrivateMessage }) => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [privateMessage, setPrivateMessage] = useState('')

  const onlineUsers = users.filter(user => user.status === 'online' || !user.status)
  const offlineUsers = users.filter(user => user.status === 'offline')

  const handlePrivateMessageSubmit = (e) => {
    e.preventDefault()
    if (privateMessage.trim() && selectedUser) {
      onPrivateMessage(selectedUser.id, privateMessage.trim())
      setPrivateMessage('')
      setSelectedUser(null)
    }
  }

  const openPrivateChat = (user) => {
    if (user.id !== currentUser.id) {
      setSelectedUser(user)
    }
  }

  return (
    <div className="online-users">
      <div className="users-header">
        <h3>Online Users ({onlineUsers.length})</h3>
      </div>
      
      <div className="users-list">
        {onlineUsers.map(user => (
          <div 
            key={user.id} 
            className={`user-item ${user.id === currentUser.id ? 'current-user' : ''} ${user.status || 'online'}`}
            onClick={() => user.id !== currentUser.id && openPrivateChat(user)}
          >
            <span className="user-status-indicator"></span>
            <span className="user-username">
              {user.username}
              {user.id === currentUser.id && ' (You)'}
            </span>
            {user.id !== currentUser.id && (
              <button 
                className="pm-button"
                title="Send private message"
              >
                🔒
              </button>
            )}
          </div>
        ))}
        
        {offlineUsers.length > 0 && (
          <>
            <div className="offline-section">
              <h4>Offline ({offlineUsers.length})</h4>
            </div>
            {offlineUsers.map(user => (
              <div key={user.id} className="user-item offline">
                <span className="user-status-indicator"></span>
                <span className="user-username">{user.username}</span>
                <span className="offline-label">Offline</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Private Message Modal */}
      {selectedUser && (
        <div className="private-message-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Private message to {selectedUser.username}</h4>
              <button 
                className="close-modal"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePrivateMessageSubmit} className="private-message-form">
              <input
                type="text"
                value={privateMessage}
                onChange={(e) => setPrivateMessage(e.target.value)}
                placeholder={`Message ${selectedUser.username}...`}
                autoFocus
                maxLength={500}
                className="private-message-input"
              />
              <div className="modal-actions">
                <button 
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!privateMessage.trim()}
                  className="send-pm-btn"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OnlineUsers