import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket server
      const socketUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        withCredentials: true
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        // Join user's room
        newSocket.emit('join', user.id || user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      // Listen for new messages
      newSocket.on('newMessage', (message) => {
        setUnreadMessages(prev => prev + 1);
        // Dispatch custom event for message components
        window.dispatchEvent(new CustomEvent('newMessage', { detail: message }));
      });

      // Listen for notifications
      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
      });

      // Listen for typing indicator
      newSocket.on('userTyping', (data) => {
        window.dispatchEvent(new CustomEvent('userTyping', { detail: data }));
      });

      // Listen for online status
      newSocket.on('userOnline', (userId) => {
        window.dispatchEvent(new CustomEvent('userOnline', { detail: userId }));
      });

      newSocket.on('userOffline', (userId) => {
        window.dispatchEvent(new CustomEvent('userOffline', { detail: userId }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (receiverId, message) => {
    if (socket && connected) {
      socket.emit('sendMessage', {
        senderId: user.id || user._id,
        receiverId,
        message
      });
    }
  };

  const sendTyping = (receiverId) => {
    if (socket && connected) {
      socket.emit('typing', {
        senderId: user.id || user._id,
        receiverId
      });
    }
  };

  const markMessagesRead = () => {
    setUnreadMessages(0);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      notifications,
      unreadMessages,
      sendMessage,
      sendTyping,
      markMessagesRead,
      clearNotification,
      clearAllNotifications
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
