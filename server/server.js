const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = new Map();
const rooms = ['general', 'random', 'tech', 'gaming'];
const roomMessages = {
  general: [],
  random: [],
  tech: [],
  gaming: []
};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    if (!username || username.trim().length === 0) {
      socket.emit('join_error', 'Username is required');
      return;
    }

    // Check if username is already taken
    const existingUser = Array.from(users.values()).find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
    
    if (existingUser) {
      socket.emit('join_error', 'Username is already taken');
      return;
    }

    const userData = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: username.trim(),
      socketId: socket.id,
      status: 'online',
      joinedAt: new Date()
    };

    users.set(socket.id, userData);
    
    // Join default room
    socket.join('general');
    
    // Send user their data
    socket.emit('user_authenticated', userData);
    
    // Notify all clients
    io.emit('user_list', Array.from(users.values()));
    io.emit('user_joined', { 
      username: userData.username, 
      id: userData.id,
      timestamp: new Date().toISOString()
    });
    
    // Send available rooms
    socket.emit('available_rooms', rooms);
    
    // Send room messages for default room
    socket.emit('room_messages', roomMessages.general);
    
    console.log(`User ${userData.username} joined the chat`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now().toString(),
      content: messageData.content,
      sender: user.username,
      senderId: user.id,
      room: messageData.room || 'general',
      timestamp: new Date().toISOString()
    };
    
    // Store message in room
    const room = messageData.room || 'general';
    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }
    roomMessages[room].push(message);
    
    // Limit stored messages per room
    if (roomMessages[room].length > 200) {
      roomMessages[room].shift();
    }
    
    // Emit to room
    io.to(room).emit('receive_message', message);
  });

  // Handle room joining
  socket.on('join_room', (roomName) => {
    if (!rooms.includes(roomName)) {
      socket.emit('room_error', 'Room does not exist');
      return;
    }

    const user = users.get(socket.id);
    if (!user) return;

    // Leave all rooms except the new one
    rooms.forEach(room => {
      if (room !== roomName) {
        socket.leave(room);
      }
    });

    socket.join(roomName);
    socket.emit('room_joined', roomName);
    socket.emit('room_messages', roomMessages[roomName] || []);
    
    // Notify room
    socket.to(roomName).emit('user_joined_room', {
      username: user.username,
      room: roomName,
      timestamp: new Date().toISOString()
    });
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const room = data.room || 'general';
      socket.to(room).emit('user_typing', {
        username: user.username,
        room: room
      });
    }
  });

  // Handle stop typing
  socket.on('stop_typing', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const room = data.room || 'general';
      socket.to(room).emit('user_stop_typing', {
        username: user.username,
        room: room
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      
      io.emit('user_left', { 
        username: user.username, 
        id: user.id,
        timestamp: new Date().toISOString()
      });
      
      io.emit('user_list', Array.from(users.values()));
      console.log(`User ${user.username} disconnected`);
    }
  });
});

// API routes
app.get('/api/messages', (req, res) => {
  const room = req.query.room || 'general';
  res.json(roomMessages[room] || []);
});

app.get('/api/users', (req, res) => {
  res.json(Array.from(users.values()));
});

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    users: users.size,
    rooms: rooms.length
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Socket.io Chat Server is running',
    version: '1.0.0',
    endpoints: {
      '/api/messages': 'GET - Get messages for a room',
      '/api/users': 'GET - Get online users',
      '/api/rooms': 'GET - Get available rooms',
      '/api/health': 'GET - Health check'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

module.exports = { app, server, io };