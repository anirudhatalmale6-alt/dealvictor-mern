import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiDollarSign, FiSettings, FiBarChart2,
  FiShoppingBag, FiBriefcase, FiStar, FiCreditCard, FiPercent,
  FiGlobe, FiMail, FiShield, FiMenu, FiX, FiBell, FiLogOut
} from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: <FiHome />, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/admin/projects', icon: <FiBriefcase />, label: 'Projects' },
    { path: '/admin/services', icon: <FiStar />, label: 'Services' },
    { path: '/admin/products', icon: <FiShoppingBag />, label: 'Products' },
    { path: '/admin/orders', icon: <FiCreditCard />, label: 'Orders' },
    { path: '/admin/memberships', icon: <FiDollarSign />, label: 'Memberships' },
    { path: '/admin/commissions', icon: <FiPercent />, label: 'Commissions' },
    { path: '/admin/payouts', icon: <FiDollarSign />, label: 'Payouts' },
    { path: '/admin/reports', icon: <FiBarChart2 />, label: 'Reports' },
    { path: '/admin/currencies', icon: <FiGlobe />, label: 'Currencies' },
    { path: '/admin/email', icon: <FiMail />, label: 'Email Templates' },
    { path: '/admin/security', icon: <FiShield />, label: 'Security' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Mock stats
  const stats = {
    totalUsers: 12458,
    activeProjects: 1234,
    totalRevenue: 158740,
    pendingPayouts: 23400
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="admin-logo">
            {sidebarOpen ? (
              <>Deal<span>Victor</span> Admin</>
            ) : (
              'DV'
            )}
          </Link>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="back-to-site">
            <FiLogOut />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>Admin Panel</h1>
          </div>
          <div className="topbar-right">
            <button className="notification-btn">
              <FiBell />
              <span className="notification-badge">5</span>
            </button>
            <div className="admin-user">
              <div className="admin-avatar">A</div>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {location.pathname === '/admin' ? (
            <AdminOverview stats={stats} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview = ({ stats }) => {
  const recentActivity = [
    { type: 'user', action: 'New user registered', user: 'John Smith', time: '2 min ago' },
    { type: 'project', action: 'New project posted', user: 'TechCorp', time: '5 min ago' },
    { type: 'payment', action: 'Payment received', amount: '$450', time: '10 min ago' },
    { type: 'order', action: 'Order completed', user: 'Sarah W.', time: '15 min ago' },
    { type: 'user', action: 'Membership upgraded', user: 'Mike J.', time: '30 min ago' },
  ];

  return (
    <div className="admin-overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon"><FiUsers /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalUsers.toLocaleString()}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <span className="stat-change positive">+12% this month</span>
        </div>

        <div className="stat-card projects">
          <div className="stat-icon"><FiBriefcase /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.activeProjects.toLocaleString()}</span>
            <span className="stat-label">Active Projects</span>
          </div>
          <span className="stat-change positive">+8% this month</span>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon"><FiDollarSign /></div>
          <div className="stat-info">
            <span className="stat-value">${stats.totalRevenue.toLocaleString()}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
          <span className="stat-change positive">+15% this month</span>
        </div>

        <div className="stat-card payouts">
          <div className="stat-icon"><FiCreditCard /></div>
          <div className="stat-info">
            <span className="stat-value">${stats.pendingPayouts.toLocaleString()}</span>
            <span className="stat-label">Pending Payouts</span>
          </div>
          <span className="stat-change">23 requests</span>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="overview-grid">
        <div className="overview-card quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/admin/users" className="action-btn">
              <FiUsers />
              <span>Manage Users</span>
            </Link>
            <Link to="/admin/memberships" className="action-btn">
              <FiDollarSign />
              <span>Membership Plans</span>
            </Link>
            <Link to="/admin/commissions" className="action-btn">
              <FiPercent />
              <span>Commissions</span>
            </Link>
            <Link to="/admin/settings" className="action-btn">
              <FiSettings />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        <div className="overview-card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div className="activity-item" key={index}>
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'user' && <FiUsers />}
                  {activity.type === 'project' && <FiBriefcase />}
                  {activity.type === 'payment' && <FiDollarSign />}
                  {activity.type === 'order' && <FiShoppingBag />}
                </div>
                <div className="activity-info">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-detail">
                    {activity.user || activity.amount}
                  </span>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
