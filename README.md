💬 Real-Time Chat Application with Socket.io

A fully-featured real-time chat application built with React, Node.js, and Socket.io — enabling seamless communication with advanced real-time features.

## 🚀 Features

### Core Features
- ✅ Real-time messaging with Socket.io
- ✅ User authentication (username-based)
- ✅ Multiple chat rooms (General, Random, Tech, Gaming)
- ✅ Online/offline user status
- ✅ Typing indicators
- ✅ Message timestamps

### Advanced Features
- ✅ Private messaging between users
- ✅ Real-time notifications
- ✅ Browser notifications support
- ✅ Responsive design
- ✅ Message read receipts (basic)
- ✅ Reconnection handling
- ✅ File/link detection in messages

### User Experience
- ✅ Smooth animations
- ✅ Mobile-responsive design
- ✅ Notification system
- ✅ Character counters
- ✅ Auto-scroll to new messages
- ✅ Connection status indicators

🛠️ Setup Instructions
🔧 Prerequisites

Node.js v18 or higher

npm or yarn package manager

📦 Installation
1. **Clone the repository**
   ```bash
   git clone <real-time-communication-with-socket-io-Kavush>
   cd socketio-chat
2. Setup Server
cd server
npm install
npm run dev

3. Setup Client
cd client
npm install
npm run dev

4. Access the Application
Client: http://localhost:5173
Server: http://localhost:5000

📁 Project Structure
 ```socketio-chat/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── socket.js       # Socket.io client setup
│   │   └── main.jsx        # App entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── server.js           # Main server file
│   └── package.json
└── README.md
 ```

🔌 Socket Events
🧠 Client → Server
user_join - Join chat with username
send_message - Send message to room
private_message - Send private message
typing - Typing indicator
join_room - Join specific room
update_status - Update user status

⚡ Server → Client
receive_message - Receive new message

private_message - Receive private message

user_list - Online users list

user_joined - User joined notification

user_left - User left notification

typing_users - Users currently typing

available_rooms - List of available rooms

room_joined - Room join confirmation

🌐 API Endpoints
| Method | Endpoint        | Description           |
| :----: | :-------------- | :-------------------- |
|   GET  | `/api/messages` | Get room messages     |
|   GET  | `/api/users`    | Get online users      |
|   GET  | `/api/rooms`    | Get available rooms   |
|   GET  | `/api/stats`    | Get server statistics |


🚀 Deployment
Server Deployment (Render/Railway)
1. Push code to GitHub

2. Connect repository to deployment service

3. Set build command: npm install

4. Set start command: npm start

5. Add environment variables

💻Client Deployment (Vercel/Netlify)
1. Build client app:
   npm run build

2. Connect repository to deployment service

3. Build command: npm run build

4. Output directory: dist

🔧 Environment Variables
Server (.env)
PORT=5000
CLIENT_URL=http://localhost:5173


Client (.env)
VITE_SOCKET_URL=http://localhost:5000

📱 Mobile Support
The application is fully responsive and works on:

Desktop browsers

Tablets

Mobile devices

🔒 Features Implemented
Task 1: Project Setup

Task 2: Core Chat Functionality

Task 3: Advanced Chat Features (Private messaging, multiple rooms, typing indicators)

Task 4: Real-Time Notifications

Task 5: Performance and UX Optimization

🎨 Technologies Used
Frontend: React, Vite, Socket.io-client

Backend: Node.js, Express, Socket.io

Styling: CSS3 with CSS Variables

Real-time Communication: Socket.io


📄 License
MIT License - feel free to use this project for learning and development purposes.

👨‍💻 Author
Esther Alfred

GitHub: github.com/Kavush

Email: alfredesther141@gmail.com



