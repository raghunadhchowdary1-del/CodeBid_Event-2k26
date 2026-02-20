const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketManager = require('./sockets/socketManager');

dotenv.config();

const app = express();

// IMPORTANT: Get frontend URL from environment variable (set on Render)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Configure CORS for Express routes
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.log('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/team', require('./routes/team'));
app.use('/api/admin', require('./routes/admin'));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with the same frontend URL
const io = socketManager.init(server, {
  cors: {
    origin: [FRONTEND_URL, 'http://localhost:3000'],
    credentials: true
  }
});

// Socket.io rooms
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-admin', () => {
    socket.join('admin');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));