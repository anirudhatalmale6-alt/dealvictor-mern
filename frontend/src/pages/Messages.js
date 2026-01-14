import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messagesAPI } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiSearch, FiMoreVertical, FiPaperclip, FiSend, FiImage,
  FiSmile, FiPhone, FiVideo, FiInfo, FiCheck, FiCheckCircle,
  FiLoader
} from 'react-icons/fi';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const { socket, connected, sendMessage: socketSendMessage, sendTyping } = useSocket();
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await messagesAPI.getConversations();
      setConversations(res.data.conversations || res.data.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle URL param for direct messaging
  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId && conversations.length > 0) {
      const existingConv = conversations.find(c =>
        c.participant?._id === userId || c.participant?.id === userId
      );
      if (existingConv) {
        setSelectedConversation(existingConv);
      }
    }
  }, [searchParams, conversations]);

  // Fetch messages when conversation selected
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    try {
      const res = await messagesAPI.getMessages(conversationId);
      setMessages(res.data.messages || res.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const otherUserId = selectedConversation.participant?._id ||
        selectedConversation.participant?.id ||
        selectedConversation.otherUser?._id;
      fetchMessages(otherUserId);
    }
  }, [selectedConversation, fetchMessages]);

  // Listen for real-time events
  useEffect(() => {
    const handleNewMessage = (event) => {
      const message = event.detail;
      const senderId = message.senderId || message.sender;

      // Add message to current conversation if it matches
      if (selectedConversation) {
        const otherUserId = selectedConversation.participant?._id ||
          selectedConversation.participant?.id;
        if (senderId === otherUserId) {
          setMessages(prev => [...prev, {
            _id: Date.now(),
            content: message.message || message.content,
            sender: { _id: senderId },
            createdAt: message.timestamp || new Date(),
            status: 'delivered'
          }]);
        }
      }

      // Update conversation list
      fetchConversations();
    };

    const handleTyping = (event) => {
      const { senderId } = event.detail;
      setTypingUsers(prev => ({ ...prev, [senderId]: true }));
      setTimeout(() => {
        setTypingUsers(prev => ({ ...prev, [senderId]: false }));
      }, 3000);
    };

    const handleUserOnline = (event) => {
      const userId = event.detail;
      setOnlineUsers(prev => ({ ...prev, [userId]: true }));
    };

    const handleUserOffline = (event) => {
      const userId = event.detail;
      setOnlineUsers(prev => ({ ...prev, [userId]: false }));
    };

    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('userTyping', handleTyping);
    window.addEventListener('userOnline', handleUserOnline);
    window.addEventListener('userOffline', handleUserOffline);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('userTyping', handleTyping);
      window.removeEventListener('userOnline', handleUserOnline);
      window.removeEventListener('userOffline', handleUserOffline);
    };
  }, [selectedConversation, fetchConversations]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const receiverId = selectedConversation.participant?._id ||
      selectedConversation.participant?.id ||
      selectedConversation.otherUser?._id;

    const messageContent = messageInput.trim();
    setMessageInput('');

    // Optimistically add message
    const tempMessage = {
      _id: Date.now(),
      content: messageContent,
      sender: { _id: user._id || user.id },
      createdAt: new Date(),
      status: 'sending'
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      // Send via API
      const res = await messagesAPI.send({
        receiverId,
        content: messageContent
      });

      // Update message status
      setMessages(prev => prev.map(m =>
        m._id === tempMessage._id
          ? { ...res.data.message || res.data.data, status: 'sent' }
          : m
      ));

      // Send via socket for real-time
      if (connected) {
        socketSendMessage(receiverId, messageContent);
      }

      // Update conversations list
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove failed message
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      setMessageInput(messageContent);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Send typing indicator
    if (selectedConversation && connected) {
      const receiverId = selectedConversation.participant?._id ||
        selectedConversation.participant?.id;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      sendTyping(receiverId);

      typingTimeoutRef.current = setTimeout(() => {
        // Typing stopped
      }, 2000);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return d.toLocaleDateString([], { weekday: 'short' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const isUserOnline = (userId) => {
    return onlineUsers[userId] || false;
  };

  const isUserTyping = (userId) => {
    return typingUsers[userId] || false;
  };

  const filteredConversations = conversations.filter(conv => {
    const name = conv.participant?.firstName + ' ' + conv.participant?.lastName ||
      conv.participant?.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherUser = (conv) => {
    return conv.participant || conv.otherUser || {};
  };

  return (
    <div className="messages-page">
      {/* Conversations List */}
      <aside className="conversations-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          <div className="connection-status">
            <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
            <span className="status-text">{connected ? 'Connected' : 'Offline'}</span>
          </div>
        </div>

        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="conversations-list">
          {loading ? (
            <div className="loading-conversations">
              <FiLoader className="spinner" />
              <p>Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="no-conversations">
              <p>No conversations yet</p>
              <small>Start a conversation from a project or service page</small>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const otherUser = getOtherUser(conv);
              const otherUserId = otherUser._id || otherUser.id;
              const online = isUserOnline(otherUserId) || otherUser.isOnline;
              const typing = isUserTyping(otherUserId);

              return (
                <div
                  key={conv._id || conv.id}
                  className={`conversation-item ${selectedConversation?._id === conv._id || selectedConversation?.id === conv.id ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="conversation-avatar">
                    {otherUser.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.firstName} />
                    ) : (
                      otherUser.firstName?.charAt(0) || 'U'
                    )}
                    {online && <span className="online-indicator"></span>}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="participant-name">
                        {otherUser.firstName} {otherUser.lastName?.charAt(0) || ''}.
                      </span>
                      <span className="message-time">
                        {formatTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                      </span>
                    </div>
                    {conv.project && (
                      <p className="project-name">{conv.project.title || conv.project}</p>
                    )}
                    <p className="last-message">
                      {typing ? (
                        <span className="typing-indicator">typing...</span>
                      ) : (
                        <>
                          {conv.lastMessage?.sender?._id === (user._id || user.id) && (
                            <span className="message-status">
                              {conv.lastMessage?.status === 'read' ? <FiCheckCircle /> : <FiCheck />}
                            </span>
                          )}
                          {conv.lastMessage?.content || 'No messages yet'}
                        </>
                      )}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="chat-area">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-participant">
                {(() => {
                  const otherUser = getOtherUser(selectedConversation);
                  const otherUserId = otherUser._id || otherUser.id;
                  const online = isUserOnline(otherUserId) || otherUser.isOnline;
                  return (
                    <>
                      <div className="participant-avatar">
                        {otherUser.avatar ? (
                          <img src={otherUser.avatar} alt={otherUser.firstName} />
                        ) : (
                          otherUser.firstName?.charAt(0) || 'U'
                        )}
                        {online && <span className="online-indicator"></span>}
                      </div>
                      <div className="participant-info">
                        <h3>{otherUser.firstName} {otherUser.lastName}</h3>
                        <span className="participant-status">
                          {isUserTyping(otherUserId) ? (
                            <span className="typing">typing...</span>
                          ) : online ? (
                            'Active now'
                          ) : (
                            `Last seen ${formatTime(otherUser.lastSeen || otherUser.lastLogin)}`
                          )}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="chat-actions">
                <button className="action-btn" title="Voice Call"><FiPhone /></button>
                <button className="action-btn" title="Video Call"><FiVideo /></button>
                <button className="action-btn" title="Info"><FiInfo /></button>
                <button className="action-btn" title="More"><FiMoreVertical /></button>
              </div>
            </div>

            {/* Project Context */}
            {selectedConversation.project && (
              <div className="project-context">
                <span className="context-label">Project:</span>
                <span className="context-value">
                  {selectedConversation.project.title || selectedConversation.project}
                </span>
              </div>
            )}

            {/* Messages */}
            <div className="messages-container">
              {loadingMessages ? (
                <div className="loading-messages">
                  <FiLoader className="spinner" />
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet</p>
                  <small>Start the conversation!</small>
                </div>
              ) : (
                messages.map((message) => {
                  const isMine = (message.sender?._id || message.sender?.id || message.sender) ===
                    (user._id || user.id);
                  return (
                    <div
                      key={message._id || message.id}
                      className={`message ${isMine ? 'sent' : 'received'}`}
                    >
                      {!isMine && (
                        <div className="message-avatar">
                          {getOtherUser(selectedConversation).firstName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="message-content">
                        <p className="message-text">{message.content || message.text}</p>
                        <div className="message-meta">
                          <span className="message-time">
                            {formatTime(message.createdAt || message.timestamp)}
                          </span>
                          {isMine && (
                            <span className={`message-status ${message.status || 'sent'}`}>
                              {message.status === 'sending' ? (
                                <FiLoader className="spinner-small" />
                              ) : message.status === 'read' ? (
                                <FiCheckCircle />
                              ) : (
                                <FiCheck />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form className="message-input-area" onSubmit={handleSendMessage}>
              <div className="input-actions">
                <button type="button" className="input-action-btn" title="Attach File">
                  <FiPaperclip />
                </button>
                <button type="button" className="input-action-btn" title="Send Image">
                  <FiImage />
                </button>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={handleInputChange}
                />
                <button type="button" className="emoji-btn" title="Emoji">
                  <FiSmile />
                </button>
              </div>
              <button type="submit" className="send-btn" disabled={!messageInput.trim()}>
                <FiSend />
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation">
            <div className="no-conversation-content">
              <div className="no-conversation-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
