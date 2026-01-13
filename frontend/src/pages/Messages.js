import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FiSearch, FiMoreVertical, FiPaperclip, FiSend, FiImage,
  FiFile, FiSmile, FiPhone, FiVideo, FiInfo, FiCheck, FiCheckCircle
} from 'react-icons/fi';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Mock conversations data
  const [conversations] = useState([
    {
      id: 1,
      participant: {
        name: 'John Smith',
        avatar: null,
        online: true,
        lastSeen: 'Active now'
      },
      project: 'E-commerce Website Development',
      lastMessage: {
        text: 'Great! I\'ll send you the updated mockups tomorrow morning.',
        time: '2 min ago',
        isRead: false,
        sender: 'them'
      },
      unreadCount: 2
    },
    {
      id: 2,
      participant: {
        name: 'Sarah Wilson',
        avatar: null,
        online: false,
        lastSeen: '15 min ago'
      },
      project: 'Logo Design Project',
      lastMessage: {
        text: 'Thank you for the feedback! I appreciate it.',
        time: '1 hour ago',
        isRead: true,
        sender: 'me'
      },
      unreadCount: 0
    },
    {
      id: 3,
      participant: {
        name: 'Mike Johnson',
        avatar: null,
        online: true,
        lastSeen: 'Active now'
      },
      project: 'SEO Optimization',
      lastMessage: {
        text: 'Can we schedule a call to discuss the progress?',
        time: '3 hours ago',
        isRead: true,
        sender: 'them'
      },
      unreadCount: 1
    },
    {
      id: 4,
      participant: {
        name: 'Emily Davis',
        avatar: null,
        online: false,
        lastSeen: '2 days ago'
      },
      project: 'Video Editing',
      lastMessage: {
        text: 'The final video has been delivered. Let me know if you need any changes.',
        time: '2 days ago',
        isRead: true,
        sender: 'me'
      },
      unreadCount: 0
    }
  ]);

  // Mock messages for selected conversation
  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: 'Hi! I\'m interested in your e-commerce project.', sender: 'me', time: '10:30 AM', status: 'read' },
      { id: 2, text: 'Hello! Thanks for reaching out. What\'s your timeline for this project?', sender: 'them', time: '10:32 AM' },
      { id: 3, text: 'We\'re looking to launch in about 6 weeks. Is that feasible?', sender: 'me', time: '10:35 AM', status: 'read' },
      { id: 4, text: 'Yes, that works. I can have the first prototype ready in 2 weeks.', sender: 'them', time: '10:38 AM' },
      { id: 5, text: 'Perfect! Can you share some mockups so we can review?', sender: 'me', time: '10:40 AM', status: 'read' },
      { id: 6, text: 'Great! I\'ll send you the updated mockups tomorrow morning.', sender: 'them', time: '10:45 AM' },
    ],
    2: [
      { id: 1, text: 'I\'ve reviewed the logo concepts you sent.', sender: 'me', time: 'Yesterday 2:30 PM', status: 'read' },
      { id: 2, text: 'Great! What do you think?', sender: 'them', time: 'Yesterday 2:35 PM' },
      { id: 3, text: 'I really like option 2 with the blue color scheme.', sender: 'me', time: 'Yesterday 2:40 PM', status: 'read' },
      { id: 4, text: 'Thank you for the feedback! I appreciate it.', sender: 'them', time: 'Yesterday 2:45 PM' },
    ]
  });

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
    }));
    setMessageInput('');
  };

  const getConversationMessages = () => {
    if (!selectedConversation) return [];
    return messages[selectedConversation.id] || [];
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page">
      {/* Conversations List */}
      <aside className="conversations-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          <button className="new-message-btn">+</button>
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
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="conversation-avatar">
                {conv.participant.name.charAt(0)}
                {conv.participant.online && <span className="online-indicator"></span>}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <span className="participant-name">{conv.participant.name}</span>
                  <span className="message-time">{conv.lastMessage.time}</span>
                </div>
                <p className="project-name">{conv.project}</p>
                <p className="last-message">
                  {conv.lastMessage.sender === 'me' && (
                    <span className="message-status">
                      {conv.lastMessage.isRead ? <FiCheckCircle /> : <FiCheck />}
                    </span>
                  )}
                  {conv.lastMessage.text}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="unread-badge">{conv.unreadCount}</span>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="chat-area">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-participant">
                <div className="participant-avatar">
                  {selectedConversation.participant.name.charAt(0)}
                  {selectedConversation.participant.online && <span className="online-indicator"></span>}
                </div>
                <div className="participant-info">
                  <h3>{selectedConversation.participant.name}</h3>
                  <span className="participant-status">
                    {selectedConversation.participant.online ? 'Active now' : selectedConversation.participant.lastSeen}
                  </span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-btn" title="Voice Call"><FiPhone /></button>
                <button className="action-btn" title="Video Call"><FiVideo /></button>
                <button className="action-btn" title="Project Info"><FiInfo /></button>
                <button className="action-btn" title="More"><FiMoreVertical /></button>
              </div>
            </div>

            {/* Project Context */}
            <div className="project-context">
              <span className="context-label">Project:</span>
              <span className="context-value">{selectedConversation.project}</span>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {getConversationMessages().map((message, index) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                >
                  {message.sender === 'them' && (
                    <div className="message-avatar">
                      {selectedConversation.participant.name.charAt(0)}
                    </div>
                  )}
                  <div className="message-content">
                    <p className="message-text">{message.text}</p>
                    <div className="message-meta">
                      <span className="message-time">{message.time}</span>
                      {message.sender === 'me' && message.status && (
                        <span className={`message-status ${message.status}`}>
                          {message.status === 'read' ? <FiCheckCircle /> : <FiCheck />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                  onChange={(e) => setMessageInput(e.target.value)}
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
