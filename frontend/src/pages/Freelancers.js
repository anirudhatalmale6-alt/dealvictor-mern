import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiGrid, FiList, FiStar, FiMapPin,
  FiDollarSign, FiClock, FiBriefcase, FiCheckCircle, FiX,
  FiMessageCircle, FiHeart
} from 'react-icons/fi';
import { usersAPI, categoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Freelancers.css';

const Freelancers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [freelancers, setFreelancers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const [filters, setFilters] = useState({
    skills: searchParams.get('skills') || '',
    hourlyRateMin: searchParams.get('hourlyRateMin') || '',
    hourlyRateMax: searchParams.get('hourlyRateMax') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    country: searchParams.get('country') || '',
    availability: searchParams.get('availability') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '-stats.avgRating',
    isOnline: searchParams.get('isOnline') || ''
  });

  const hourlyRates = [
    { label: 'Any Rate', min: '', max: '' },
    { label: 'Under $25/hr', min: '0', max: '25' },
    { label: '$25 - $50/hr', min: '25', max: '50' },
    { label: '$50 - $100/hr', min: '50', max: '100' },
    { label: '$100+/hr', min: '100', max: '' }
  ];

  const experienceLevels = [
    { label: 'All Levels', value: '' },
    { label: 'Entry Level', value: 'entry' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Expert', value: 'expert' }
  ];

  const availabilityOptions = [
    { label: 'Any Availability', value: '' },
    { label: 'Full-time', value: 'full-time' },
    { label: 'Part-time', value: 'part-time' },
    { label: 'Hourly', value: 'hourly' }
  ];

  const countries = [
    'Any Location', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'India', 'Germany', 'France', 'Netherlands', 'Philippines', 'Pakistan',
    'Bangladesh', 'Ukraine', 'Brazil', 'Argentina', 'Other'
  ];

  const sortOptions = [
    { label: 'Top Rated', value: '-stats.avgRating' },
    { label: 'Most Reviews', value: '-stats.totalReviews' },
    { label: 'Newest Members', value: '-createdAt' },
    { label: 'Lowest Rate', value: 'freelancerProfile.hourlyRate' },
    { label: 'Highest Rate', value: '-freelancerProfile.hourlyRate' },
    { label: 'Most Projects', value: '-stats.completedProjects' }
  ];

  // Fetch categories for skill filtering
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesAPI.getAll();
        setCategories(res.data.data || res.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch freelancers
  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        role: 'freelancer'
      };

      if (filters.skills) params.skills = filters.skills;
      if (filters.hourlyRateMin) params.minRate = filters.hourlyRateMin;
      if (filters.hourlyRateMax) params.maxRate = filters.hourlyRateMax;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
      if (filters.country && filters.country !== 'Any Location') params.country = filters.country;
      if (filters.availability) params.availability = filters.availability;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      if (filters.isOnline) params.isOnline = filters.isOnline;

      const res = await usersAPI.getFreelancers ?
        await usersAPI.getFreelancers(params) :
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/users/freelancers?${new URLSearchParams(params)}`).then(r => r.json());

      setFreelancers(res.data?.users || res.users || res.data || []);
      setPagination(prev => ({
        ...prev,
        total: res.data?.pagination?.total || res.pagination?.total || 0,
        pages: res.data?.pagination?.pages || res.pagination?.pages || 0
      }));
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      toast.error('Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '-stats.avgRating') params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRateRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      hourlyRateMin: range.min,
      hourlyRateMax: range.max
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      skills: '',
      hourlyRateMin: '',
      hourlyRateMax: '',
      experienceLevel: '',
      country: '',
      availability: '',
      search: '',
      sort: '-stats.avgRating',
      isOnline: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  const getExperienceLabel = (exp) => {
    const labels = {
      entry: 'Entry Level',
      intermediate: 'Intermediate',
      expert: 'Expert'
    };
    return labels[exp] || 'Professional';
  };

  const formatLastSeen = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMins = Math.floor((now - lastSeen) / 60000);

    if (diffMins < 5) return 'Online now';
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    if (diffMins < 1440) return `Active ${Math.floor(diffMins / 60)}h ago`;
    return `Active ${Math.floor(diffMins / 1440)}d ago`;
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '-stats.avgRating').length;

  return (
    <div className="freelancers-page">
      {/* Header */}
      <div className="freelancers-header">
        <div className="container">
          <h1>Find Freelancers</h1>
          <p>Browse top talent and hire the perfect freelancer for your project</p>
        </div>
      </div>

      <div className="container">
        <div className="freelancers-content">
          {/* Search & Filters Bar */}
          <div className="search-filters-bar">
            <form onSubmit={handleSearch} className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search freelancers by skills, name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </form>
            <div className="filter-controls">
              <select
                value={`${filters.hourlyRateMin}-${filters.hourlyRateMax}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-');
                  handleRateRangeChange({ min, max });
                }}
                className="filter-select"
              >
                {hourlyRates.map((rate, i) => (
                  <option key={i} value={`${rate.min}-${rate.max}`}>{rate.label}</option>
                ))}
              </select>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="filter-select"
              >
                {countries.map((country, i) => (
                  <option key={i} value={i === 0 ? '' : country}>{country}</option>
                ))}
              </select>
              <button
                className={`filter-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> More Filters
                {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
              </button>
            </div>
            <div className="view-toggles">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="advanced-filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Experience Level</label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  >
                    {experienceLevels.map((level, i) => (
                      <option key={i} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Availability</label>
                  <select
                    value={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                  >
                    {availabilityOptions.map((opt, i) => (
                      <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Python, Design..."
                    value={filters.skills}
                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={filters.isOnline}
                    onChange={(e) => handleFilterChange('isOnline', e.target.value)}
                  >
                    <option value="">All Users</option>
                    <option value="true">Online Now</option>
                  </select>
                </div>
              </div>
              <div className="filter-actions">
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <FiX /> Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="results-info">
            <span className="results-count">
              {loading ? 'Loading...' : `${pagination.total} freelancers found`}
            </span>
            <div className="sort-by">
              <span>Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {sortOptions.map((option, i) => (
                  <option key={i} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Freelancers Grid/List */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading freelancers...</p>
            </div>
          ) : freelancers.length === 0 ? (
            <div className="no-results">
              <h3>No freelancers found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={`freelancers-grid ${viewMode}`}>
              {freelancers.map(freelancer => (
                <div className="freelancer-card" key={freelancer._id}>
                  <div className="freelancer-header">
                    <div className="avatar-container">
                      <div className="avatar">
                        {freelancer.avatar ? (
                          <img src={freelancer.avatar} alt={freelancer.firstName} />
                        ) : (
                          <span>{freelancer.firstName?.charAt(0) || 'F'}</span>
                        )}
                      </div>
                      <span className={`status-indicator ${freelancer.isOnline ? 'online' : 'offline'}`}></span>
                    </div>
                    <div className="freelancer-actions">
                      <button className="action-btn"><FiHeart /></button>
                    </div>
                  </div>

                  <div className="freelancer-info">
                    <h3 className="freelancer-name">
                      <Link to={`/profile/${freelancer._id}`}>
                        {freelancer.firstName} {freelancer.lastName?.charAt(0)}.
                        {freelancer.isVerified && <FiCheckCircle className="verified-icon" />}
                      </Link>
                    </h3>
                    <p className="freelancer-title">
                      {freelancer.freelancerProfile?.title || 'Freelancer'}
                    </p>

                    <div className="freelancer-meta">
                      <div className="meta-item rating">
                        <FiStar className="star-icon" />
                        <span>{freelancer.stats?.avgRating?.toFixed(1) || '5.0'}</span>
                        <span className="review-count">({freelancer.stats?.totalReviews || 0})</span>
                      </div>
                      <div className="meta-item location">
                        <FiMapPin />
                        <span>{freelancer.location?.country || 'Remote'}</span>
                      </div>
                    </div>

                    <div className="freelancer-stats">
                      <div className="stat">
                        <FiBriefcase />
                        <span>{freelancer.stats?.completedProjects || 0} projects</span>
                      </div>
                      <div className="stat">
                        <FiClock />
                        <span>{formatLastSeen(freelancer.lastSeen || freelancer.lastLogin)}</span>
                      </div>
                    </div>

                    <div className="freelancer-skills">
                      {freelancer.freelancerProfile?.skills?.slice(0, 4).map((skill, i) => (
                        <span className="skill-tag" key={i}>{skill}</span>
                      ))}
                      {freelancer.freelancerProfile?.skills?.length > 4 && (
                        <span className="skill-more">+{freelancer.freelancerProfile.skills.length - 4}</span>
                      )}
                    </div>
                  </div>

                  <div className="freelancer-footer">
                    <div className="hourly-rate">
                      <FiDollarSign />
                      <span className="rate-value">
                        ${freelancer.freelancerProfile?.hourlyRate || 25}
                      </span>
                      <span className="rate-label">/hr</span>
                    </div>
                    <div className="footer-actions">
                      <Link to={`/messages?user=${freelancer._id}`} className="contact-btn">
                        <FiMessageCircle /> Contact
                      </Link>
                      <Link to={`/profile/${freelancer._id}`} className="view-btn">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </button>
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                <>
                  <span className="page-dots">...</span>
                  <button
                    className="page-btn"
                    onClick={() => setPagination(prev => ({ ...prev, page: pagination.pages }))}
                  >
                    {pagination.pages}
                  </button>
                </>
              )}
              <button
                className="page-btn"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Freelancers;
