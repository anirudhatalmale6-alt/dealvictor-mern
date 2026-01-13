import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiMessageSquare, FiBell, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">Deal<span className="logo-accent">Victor</span></span>
          </Link>

          <div className="navbar-links">
            <Link to="/projects" className="nav-link">Find Work</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/how-it-works" className="nav-link">How It Works</Link>
          </div>
        </div>

        <div className="navbar-center">
          <form className="search-form" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search services, projects, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <Link to="/messages" className="nav-icon-btn">
                <FiMessageSquare />
                <span className="notification-badge">3</span>
              </Link>
              <Link to="/notifications" className="nav-icon-btn">
                <FiBell />
                <span className="notification-badge">5</span>
              </Link>
              <Link to="/cart" className="nav-icon-btn">
                <FiShoppingCart />
                <span className="notification-badge">2</span>
              </Link>

              <div className="user-menu-container">
                <button
                  className="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <FiUser />
                    )}
                  </div>
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown className={`chevron ${userMenuOpen ? 'rotated' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <span className="user-fullname">{user?.name}</span>
                        <span className="user-email">{user?.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/my-projects" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      My Projects
                    </Link>
                    <Link to="/my-orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      My Orders
                    </Link>
                    <Link to="/earnings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      Earnings
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      Settings
                    </Link>
                    {user?.role === 'admin' && (
                      <>
                        <div className="dropdown-divider" />
                        <Link to="/admin" className="dropdown-item admin-link" onClick={() => setUserMenuOpen(false)}>
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>

              <Link to="/post-project" className="btn btn-primary post-btn">
                Post a Project
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search-form" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link to="/projects" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Find Work</Link>
          <Link to="/services" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link to="/shop" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          <Link to="/how-it-works" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
          {!isAuthenticated && (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
