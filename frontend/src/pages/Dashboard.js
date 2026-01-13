import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiBriefcase, FiFileText, FiShoppingBag, FiMessageSquare,
  FiStar, FiDollarSign, FiSettings, FiCrown, FiCreditCard, FiTrendingUp,
  FiUsers, FiCheckCircle, FiClock, FiAlertCircle, FiPlus, FiArrowRight
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - will be replaced with API calls
  const stats = {
    totalEarnings: 12450,
    thisMonth: 2340,
    pendingBalance: 850,
    completedProjects: 47,
    activeProjects: 3,
    totalBids: 156,
    wonBids: 52,
    pendingBids: 8,
    successRate: 33
  };

  const membership = {
    plan: 'FREE',
    bidsRemaining: 15,
    bidsTotal: 20,
    features: ['Basic Support', '5% Platform Fee', '20 Bids/Month']
  };

  const recentProjects = [
    { id: 1, title: 'E-commerce Website Development', client: 'TechCorp', budget: 2500, status: 'in_progress', dueDate: '2024-02-15' },
    { id: 2, title: 'Mobile App UI Design', client: 'StartupX', budget: 1200, status: 'completed', dueDate: '2024-01-20' },
    { id: 3, title: 'SEO Optimization', client: 'LocalBiz', budget: 800, status: 'pending', dueDate: '2024-02-28' }
  ];

  const recentMessages = [
    { id: 1, from: 'John Smith', message: 'Hi, I wanted to discuss the project timeline...', time: '2 hours ago', unread: true },
    { id: 2, from: 'Sarah Wilson', message: 'Thanks for the delivery! Great work!', time: '5 hours ago', unread: false },
    { id: 3, from: 'Mike Johnson', message: 'Can you send me the updated mockups?', time: '1 day ago', unread: false }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      in_progress: { class: 'status-progress', label: 'In Progress', icon: <FiClock /> },
      completed: { class: 'status-completed', label: 'Completed', icon: <FiCheckCircle /> },
      pending: { class: 'status-pending', label: 'Pending', icon: <FiAlertCircle /> }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar-large">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <h3>{user?.name || 'User'}</h3>
              <span className="user-role">{user?.role || 'Freelancer'}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-label">Main</span>
            <ul>
              <li className={activeTab === 'overview' ? 'active' : ''}>
                <button onClick={() => setActiveTab('overview')}>
                  <FiHome /> <span>Overview</span>
                </button>
              </li>
              <li className={activeTab === 'projects' ? 'active' : ''}>
                <button onClick={() => setActiveTab('projects')}>
                  <FiBriefcase /> <span>My Projects</span>
                </button>
              </li>
              <li className={activeTab === 'bids' ? 'active' : ''}>
                <button onClick={() => setActiveTab('bids')}>
                  <FiFileText /> <span>My Bids</span>
                </button>
              </li>
              <li className={activeTab === 'services' ? 'active' : ''}>
                <button onClick={() => setActiveTab('services')}>
                  <FiStar /> <span>My Services</span>
                </button>
              </li>
              <li className={activeTab === 'orders' ? 'active' : ''}>
                <button onClick={() => setActiveTab('orders')}>
                  <FiShoppingBag /> <span>Orders</span>
                </button>
              </li>
              <li className={activeTab === 'messages' ? 'active' : ''}>
                <button onClick={() => setActiveTab('messages')}>
                  <FiMessageSquare /> <span>Messages</span>
                  <span className="badge">3</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <span className="nav-label">Finance</span>
            <ul>
              <li className={activeTab === 'earnings' ? 'active' : ''}>
                <button onClick={() => setActiveTab('earnings')}>
                  <FiDollarSign /> <span>Earnings</span>
                </button>
              </li>
              <li className={activeTab === 'reviews' ? 'active' : ''}>
                <button onClick={() => setActiveTab('reviews')}>
                  <FiStar /> <span>Reviews</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <span className="nav-label">Membership</span>
            <ul>
              <li className="upgrade-item">
                <Link to="/membership">
                  <FiCrown /> <span>Upgrade Plan</span>
                </Link>
              </li>
              <li>
                <Link to="/buy-bids">
                  <FiCreditCard /> <span>Buy Bids</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <span className="nav-label">Account</span>
            <ul>
              <li className={activeTab === 'settings' ? 'active' : ''}>
                <button onClick={() => setActiveTab('settings')}>
                  <FiSettings /> <span>Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
            <p>Here's what's happening with your account today.</p>
          </div>
          <Link to="/post-project" className="btn btn-primary">
            <FiPlus /> Post a Project
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card earnings">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Earnings</span>
              <span className="stat-value">${stats.totalEarnings.toLocaleString()}</span>
              <span className="stat-change positive">+12% from last month</span>
            </div>
          </div>

          <div className="stat-card projects">
            <div className="stat-icon">
              <FiBriefcase />
            </div>
            <div className="stat-content">
              <span className="stat-label">Active Projects</span>
              <span className="stat-value">{stats.activeProjects}</span>
              <span className="stat-sub">{stats.completedProjects} completed</span>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-content">
              <span className="stat-label">Pending Balance</span>
              <span className="stat-value">${stats.pendingBalance}</span>
              <span className="stat-sub">Awaiting release</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <span className="stat-label">Success Rate</span>
              <span className="stat-value">{stats.successRate}%</span>
              <span className="stat-sub">{stats.wonBids} won / {stats.totalBids} total</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Membership & Bids Card */}
          <div className="dashboard-card membership-card">
            <div className="card-header">
              <h3><FiCrown /> Membership</h3>
              <span className={`plan-badge ${membership.plan.toLowerCase()}`}>{membership.plan}</span>
            </div>
            <div className="card-body">
              <div className="upgrade-promo">
                <h4>Upgrade to Pro</h4>
                <ul className="pro-features">
                  <li><FiCheckCircle /> Unlimited Bids</li>
                  <li><FiCheckCircle /> Featured Profile</li>
                  <li><FiCheckCircle /> Priority Support</li>
                  <li><FiCheckCircle /> Lower Fees (3%)</li>
                </ul>
                <Link to="/membership" className="btn btn-accent">
                  Upgrade Now - $19/mo
                </Link>
              </div>
            </div>
          </div>

          {/* Bids Stats Card */}
          <div className="dashboard-card bids-card">
            <div className="card-header">
              <h3><FiFileText /> Bids Overview</h3>
              <Link to="/bids" className="view-all-link">View All <FiArrowRight /></Link>
            </div>
            <div className="card-body">
              <div className="bids-stats">
                <div className="bid-stat">
                  <span className="bid-stat-value">{stats.totalBids}</span>
                  <span className="bid-stat-label">Total Bids</span>
                </div>
                <div className="bid-stat won">
                  <span className="bid-stat-value">{stats.wonBids}</span>
                  <span className="bid-stat-label">Won</span>
                </div>
                <div className="bid-stat pending">
                  <span className="bid-stat-value">{stats.pendingBids}</span>
                  <span className="bid-stat-label">Pending</span>
                </div>
                <div className="bid-stat rate">
                  <span className="bid-stat-value">{stats.successRate}%</span>
                  <span className="bid-stat-label">Success Rate</span>
                </div>
              </div>
              <div className="bids-remaining">
                <div className="bids-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(membership.bidsRemaining / membership.bidsTotal) * 100}%` }}
                    ></div>
                  </div>
                  <span className="bids-count">
                    <strong>{membership.bidsRemaining}</strong> / {membership.bidsTotal} bids remaining
                  </span>
                </div>
                <Link to="/buy-bids" className="buy-bids-link">Buy More</Link>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="dashboard-card projects-card">
            <div className="card-header">
              <h3><FiBriefcase /> Recent Projects</h3>
              <Link to="/projects" className="view-all-link">View All <FiArrowRight /></Link>
            </div>
            <div className="card-body">
              <div className="projects-list">
                {recentProjects.map(project => (
                  <div className="project-item" key={project.id}>
                    <div className="project-info">
                      <h4>{project.title}</h4>
                      <span className="project-client">{project.client}</span>
                    </div>
                    <div className="project-meta">
                      <span className="project-budget">${project.budget}</span>
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="dashboard-card messages-card">
            <div className="card-header">
              <h3><FiMessageSquare /> Recent Messages</h3>
              <Link to="/messages" className="view-all-link">View All <FiArrowRight /></Link>
            </div>
            <div className="card-body">
              <div className="messages-list">
                {recentMessages.map(message => (
                  <div className={`message-item ${message.unread ? 'unread' : ''}`} key={message.id}>
                    <div className="message-avatar">
                      {message.from.charAt(0)}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-from">{message.from}</span>
                        <span className="message-time">{message.time}</span>
                      </div>
                      <p className="message-preview">{message.message}</p>
                    </div>
                    {message.unread && <span className="unread-dot"></span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
