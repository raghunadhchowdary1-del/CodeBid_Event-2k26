let io;

module.exports = {
  init: (httpServer, options = {}) => {
    const defaultOptions = {
      cors: {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:3000',
          'http://localhost:3000'
        ],
        credentials: true
      }
    };
    const mergedOptions = { ...defaultOptions, ...options };
    if (options.cors) {
      mergedOptions.cors = { ...defaultOptions.cors, ...options.cors };
    }
    io = require('socket.io')(httpServer, mergedOptions);
    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
  }
};