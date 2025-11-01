import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './ChatRoom.css'

const ChatRoom = ({ user, onLogout }) => {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState('general')
  const [rooms] = useState(['general', 'random', 'tech', 'gaming'])

  useEffect(() => {
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setIsConnected(true)
      newSocket.emit('user_join', user.username)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('user_list', (users) => {
      setOnlineUsers(users)
    })

    newSocket.on('user_joined', (userData) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        system: true,
        message: `${userData.username} joined the chat`,
        timestamp: new Date()
      }])
    })

    newSocket.on('user_left', (userData) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        system: true,
        message: `${userData.username} left the chat`,
        timestamp: new Date()
      }])
    })

    newSocket.on('room_messages', (roomMessages) => {
      setMessages(roomMessages)
    })

    newSocket.on('room_joined', (roomName) => {
      setCurrentRoom(roomName)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [user.username])

  const sendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() && socket) {
      socket.emit('send_message', {
        content: newMessage.trim(),
        room: currentRoom
      })
      setNewMessage('')
    }
  }

  const joinRoom = (roomName) => {
    if (socket && roomName !== currentRoom) {
      socket.emit('join_room', roomName)
      setMessages([])
    }
  }

  return (
    <div className="chat-room">
      <header className="chat-header">
        <div className="header-left">
          <h1>💬 Real-Time Chat</h1>
          <div className="connection-status">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="header-center">
          <span className="current-room"># {currentRoom}</span>
          <span className="online-count">{onlineUsers.length} online</span>
        </div>
        <div className="header-right">
          <span className="username">Welcome, {user.username}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="chat-container">
        <aside className="sidebar">
          <div className="chat-rooms">
            <h3>Rooms</h3>
            <div className="rooms-list">
              {rooms.map(room => (
                <button
                  key={room}
                  className={`room-item ${room === currentRoom ? 'active' : ''}`}
                  onClick={() => joinRoom(room)}
                >
                  # {room}
                </button>
              ))}
            </div>
          </div>
          
          <div className="users-list">
  {onlineUsers.map(onlineUser => (
    <div key={onlineUser.id} className="user-item">
      <span className="user-status"></span>
      <div style={{flex: 1}}>
        <div style={{fontWeight: 'bold'}}>
          {onlineUser.username}
          {onlineUser.id === user.id && ' (You)'}
        </div>
        <div style={{fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace'}}>
          ID: {onlineUser.id.substring(0, 10)}...
        </div>
      </div>
    </div>
  ))}
          </div>
        </aside>

        <main className="chat-main">
          <div className="messages-container">
            {messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.system ? 'system-message' : ''}`}
              >
                {!message.system && (
                  <div className="message-header">
                    <span className="message-sender">{message.sender}</span>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                <div className="message-content">
                  {message.content || message.message}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${currentRoom}...`}
              className="message-input"
              disabled={!isConnected}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!newMessage.trim() || !isConnected}
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}

export default ChatRoom