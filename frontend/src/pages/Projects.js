import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiClock, FiDollarSign, FiUsers, FiGrid, FiList, FiX, FiChevronDown } from 'react-icons/fi';
import { projectsAPI, categoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Projects.css';

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
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
    category: searchParams.get('category') || '',
    budgetMin: searchParams.get('budgetMin') || '',
    budgetMax: searchParams.get('budgetMax') || '',
    skills: searchParams.get('skills') || '',
    budgetType: searchParams.get('budgetType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '-createdAt'
  });

  const budgetRanges = [
    { label: 'Any Budget', min: '', max: '' },
    { label: 'Under $500', min: '0', max: '500' },
    { label: '$500 - $1,000', min: '500', max: '1000' },
    { label: '$1,000 - $5,000', min: '1000', max: '5000' },
    { label: '$5,000 - $10,000', min: '5000', max: '10000' },
    { label: '$10,000+', min: '10000', max: '' }
  ];

  const experienceLevels = [
    { label: 'All Levels', value: '' },
    { label: 'Entry Level', value: 'entry' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Expert', value: 'expert' }
  ];

  const sortOptions = [
    { label: 'Newest First', value: '-createdAt' },
    { label: 'Oldest First', value: 'createdAt' },
    { label: 'Budget: High to Low', value: '-budget.max' },
    { label: 'Budget: Low to High', value: 'budget.min' },
    { label: 'Most Bids', value: '-totalBids' },
    { label: 'Fewest Bids', value: 'totalBids' }
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesAPI.getAll({ type: 'project' });
        setCategories(res.data.data || res.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: 'open'
      };

      if (filters.category) params.category = filters.category;
      if (filters.budgetMin) params.minBudget = filters.budgetMin;
      if (filters.budgetMax) params.maxBudget = filters.budgetMax;
      if (filters.skills) params.skills = filters.skills;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;

      const res = await projectsAPI.getAll(params);
      setProjects(res.data.projects || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.pagination?.total || 0,
        pages: res.data.pagination?.pages || 0
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBudgetRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      budgetMin: range.min,
      budgetMax: range.max
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      budgetMin: '',
      budgetMax: '',
      skills: '',
      budgetType: '',
      experienceLevel: '',
      search: '',
      sort: '-createdAt'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const formatBudget = (budget) => {
    if (!budget) return 'Budget not specified';
    const { min, max, type } = budget;
    const budgetType = type === 'hourly' ? '/hr' : '';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}${budgetType}`;
    if (min) return `From $${min.toLocaleString()}${budgetType}`;
    if (max) return `Up to $${max.toLocaleString()}${budgetType}`;
    return 'Budget not specified';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return posted.toLocaleDateString();
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '-createdAt').length;

  return (
    <div className="projects-page">
      {/* Header */}
      <div className="projects-header">
        <div className="container">
          <h1>Browse Projects</h1>
          <p>Find your next opportunity from thousands of projects posted daily</p>
        </div>
      </div>

      <div className="container">
        <div className="projects-content">
          {/* Search & Filters Bar */}
          <div className="search-filters-bar">
            <form onSubmit={handleSearch} className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search projects by keyword..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </form>
            <div className="filter-controls">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={`${filters.budgetMin}-${filters.budgetMax}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-');
                  handleBudgetRangeChange({ min, max });
                }}
                className="filter-select"
              >
                {budgetRanges.map((range, i) => (
                  <option key={i} value={`${range.min}-${range.max}`}>{range.label}</option>
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
                  <label>Project Type</label>
                  <select
                    value={filters.budgetType}
                    onChange={(e) => handleFilterChange('budgetType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Python..."
                    value={filters.skills}
                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                  />
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
              {loading ? 'Loading...' : `${pagination.total} projects found`}
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

          {/* Projects Grid/List */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="no-results">
              <h3>No projects found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={`projects-grid ${viewMode}`}>
              {projects.map(project => (
                <div className="project-card" key={project._id}>
                  <div className="project-header">
                    <span className="project-category">
                      {project.category?.name || 'Uncategorized'}
                    </span>
                    <span className="project-time">{formatTimeAgo(project.createdAt)}</span>
                  </div>
                  <h3 className="project-title">
                    <Link to={`/project/${project._id}`}>{project.title}</Link>
                  </h3>
                  <p className="project-description">
                    {project.description?.substring(0, 200)}
                    {project.description?.length > 200 ? '...' : ''}
                  </p>
                  <div className="project-skills">
                    {project.skills?.slice(0, 4).map((skill, i) => (
                      <span className="skill-tag" key={i}>{skill}</span>
                    ))}
                    {project.skills?.length > 4 && (
                      <span className="skill-more">+{project.skills.length - 4}</span>
                    )}
                  </div>
                  <div className="project-meta">
                    <div className="meta-item budget">
                      <FiDollarSign />
                      <span>{formatBudget(project.budget)}</span>
                    </div>
                    <div className="meta-item deadline">
                      <FiClock />
                      <span>{project.duration || 'Flexible'}</span>
                    </div>
                    <div className="meta-item bids">
                      <FiUsers />
                      <span>{project.totalBids || 0} bids</span>
                    </div>
                  </div>
                  <div className="project-footer">
                    <div className="client-info">
                      <div className="client-avatar">
                        {project.buyer?.firstName?.charAt(0) || project.client?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="client-details">
                        <span className="client-name">
                          {project.buyer?.firstName || project.client?.firstName || 'Unknown'} {project.buyer?.lastName?.charAt(0) || project.client?.lastName?.charAt(0) || ''}.
                          {(project.buyer?.isVerified || project.client?.isVerified) && (
                            <span className="verified-badge">✓</span>
                          )}
                        </span>
                        <span className="client-location">
                          <FiMapPin /> {project.buyer?.location?.country || project.client?.country || 'Remote'}
                        </span>
                      </div>
                    </div>
                    <Link to={`/project/${project._id}`} className="bid-btn">
                      Place Bid
                    </Link>
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

export default Projects;
