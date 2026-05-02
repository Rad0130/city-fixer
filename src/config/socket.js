import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (token) => {
  // Get the API URL - use environment variable or localhost for development
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  socket = io(API_URL, {
    auth: { token },
    transports: ['websocket'],
    withCredentials: true,
  });
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

// Add default export
export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
};