import React, { useState } from 'react';
import {
  FiSearch, FiFilter, FiMoreVertical, FiEdit2, FiTrash2,
  FiLock, FiUnlock, FiMail, FiUser, FiCheck, FiX, FiDownload
} from 'react-icons/fi';
import './AdminPages.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      role: 'freelancer',
      membership: 'Pro',
      status: 'active',
      verified: true,
      joined: '2024-01-15',
      earnings: 12500,
      projects: 47
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'client',
      membership: 'Business',
      status: 'active',
      verified: true,
      joined: '2024-01-10',
      earnings: 0,
      projects: 23
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'both',
      membership: 'Starter',
      status: 'active',
      verified: false,
      joined: '2024-02-01',
      earnings: 3200,
      projects: 12
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'freelancer',
      membership: 'Free',
      status: 'suspended',
      verified: true,
      joined: '2023-12-20',
      earnings: 850,
      projects: 5
    },
    {
      id: 5,
      name: 'Alex Chen',
      email: 'alex@example.com',
      role: 'seller',
      membership: 'Pro',
      status: 'active',
      verified: true,
      joined: '2024-01-25',
      earnings: 8900,
      projects: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleUserSelection = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    setActiveDropdown(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
    setActiveDropdown(null);
  };

  const getRoleBadge = (role) => {
    const roles = {
      freelancer: { label: 'Freelancer', class: 'role-freelancer' },
      client: { label: 'Client', class: 'role-client' },
      seller: { label: 'Seller', class: 'role-seller' },
      both: { label: 'Both', class: 'role-both' }
    };
    return roles[role] || { label: role, class: '' };
  };

  const getMembershipBadge = (membership) => {
    const memberships = {
      Free: 'membership-free',
      Starter: 'membership-starter',
      Pro: 'membership-pro',
      Business: 'membership-business'
    };
    return memberships[membership] || '';
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2>User Management</h2>
          <p>Manage all platform users</p>
        </div>
        <button className="btn-add">
          <FiDownload /> Export Users
        </button>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FiFilter />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
            <option value="seller">Seller</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedUsers.length} user(s) selected</span>
          <button className="btn-bulk">
            <FiMail /> Send Email
          </button>
          <button className="btn-bulk warning">
            <FiLock /> Suspend
          </button>
          <button className="btn-bulk danger">
            <FiTrash2 /> Delete
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="table-container">
        <table className="admin-table users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleAllUsers}
                />
              </th>
              <th>User</th>
              <th>Role</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Earnings</th>
              <th>Projects</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className={user.status === 'suspended' ? 'suspended' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                </td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="user-details">
                      <span className="user-name">
                        {user.name}
                        {user.verified && <FiCheck className="verified-icon" />}
                      </span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${getRoleBadge(user.role).class}`}>
                    {getRoleBadge(user.role).label}
                  </span>
                </td>
                <td>
                  <span className={`membership-badge ${getMembershipBadge(user.membership)}`}>
                    {user.membership}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>${user.earnings.toLocaleString()}</td>
                <td>{user.projects}</td>
                <td>{new Date(user.joined).toLocaleDateString()}</td>
                <td>
                  <div className="actions-dropdown">
                    <button
                      className="dropdown-trigger"
                      onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                    >
                      <FiMoreVertical />
                    </button>
                    {activeDropdown === user.id && (
                      <div className="dropdown-menu">
                        <button>
                          <FiUser /> View Profile
                        </button>
                        <button>
                          <FiEdit2 /> Edit User
                        </button>
                        <button>
                          <FiMail /> Send Email
                        </button>
                        {user.status === 'active' ? (
                          <button className="warning" onClick={() => handleStatusChange(user.id, 'suspended')}>
                            <FiLock /> Suspend
                          </button>
                        ) : (
                          <button className="success" onClick={() => handleStatusChange(user.id, 'active')}>
                            <FiUnlock /> Activate
                          </button>
                        )}
                        <button className="danger" onClick={() => handleDeleteUser(user.id)}>
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span className="pagination-info">Showing 1-5 of 1,234 users</span>
        <div className="pagination-controls">
          <button className="page-btn" disabled>Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <span>...</span>
          <button className="page-btn">247</button>
          <button className="page-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
