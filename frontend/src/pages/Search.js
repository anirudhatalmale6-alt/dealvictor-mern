import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiGrid, FiList, FiBriefcase, FiStar, FiShoppingBag, FiUsers, FiX, FiChevronDown } from 'react-icons/fi';
import { projectsAPI, servicesAPI, productsAPI, usersAPI } from '../services/api';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [results, setResults] = useState({
    projects: [],
    services: [],
    products: [],
    freelancers: []
  });

  const [counts, setCounts] = useState({
    all: 0,
    projects: 0,
    services: 0,
    products: 0,
    freelancers: 0
  });

  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  });

  const fetchResults = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const [projectsRes, servicesRes, productsRes, freelancersRes] = await Promise.all([
        projectsAPI.getAll({ search: query, status: 'open', limit: 20 }).catch(() => ({ data: { data: [] } })),
        servicesAPI.getAll({ search: query, status: 'active', limit: 20 }).catch(() => ({ data: { data: [] } })),
        productsAPI.getAll({ search: query, limit: 20 }).catch(() => ({ data: { data: [] } })),
        usersAPI.getFreelancers({ search: query, limit: 20 }).catch(() => ({ data: { users: [] } }))
      ]);

      const projects = projectsRes.data?.data || projectsRes.data?.projects || [];
      const services = servicesRes.data?.data || [];
      const products = productsRes.data?.data || productsRes.data?.products || [];
      const freelancers = freelancersRes.data?.users || [];

      setResults({ projects, services, products, freelancers });
      setCounts({
        all: projects.length + services.length + products.length + freelancers.length,
        projects: projects.length,
        services: services.length,
        products: products.length,
        freelancers: freelancers.length
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance'
    });
  };

  const tabs = [
    { id: 'all', label: 'All Results', icon: FiSearch, count: counts.all },
    { id: 'projects', label: 'Projects', icon: FiBriefcase, count: counts.projects },
    { id: 'services', label: 'Services', icon: FiStar, count: counts.services },
    { id: 'products', label: 'Products', icon: FiShoppingBag, count: counts.products },
    { id: 'freelancers', label: 'Freelancers', icon: FiUsers, count: counts.freelancers }
  ];

  const renderProjectCard = (project) => (
    <div key={project._id} className="result-card project-card">
      <div className="card-header">
        <span className="result-type">Project</span>
        <span className="project-budget">
          ${project.budget?.min || 0} - ${project.budget?.max || 0}
        </span>
      </div>
      <Link to={`/project/${project._id}`} className="card-title">{project.title}</Link>
      <p className="card-description">{project.description?.substring(0, 120)}...</p>
      <div className="card-meta">
        <span className="category">{project.category?.name || 'Uncategorized'}</span>
        <span className="bids">{project.totalBids || 0} bids</span>
      </div>
      <div className="card-skills">
        {project.skills?.slice(0, 4).map((skill, i) => (
          <span key={i} className="skill-tag">{skill}</span>
        ))}
      </div>
    </div>
  );

  const renderServiceCard = (service) => (
    <div key={service._id} className="result-card service-card">
      <div className="card-image">
        {service.images?.[0] ? (
          <img src={service.images[0]} alt={service.title} />
        ) : (
          <div className="placeholder-image"><FiStar /></div>
        )}
      </div>
      <div className="card-content">
        <span className="result-type">Service</span>
        <Link to={`/service/${service._id}`} className="card-title">{service.title}</Link>
        <div className="seller-info">
          <img src={service.freelancer?.avatar || '/default-avatar.png'} alt="" className="seller-avatar" />
          <span>{service.freelancer?.firstName} {service.freelancer?.lastName}</span>
        </div>
        <div className="card-footer">
          <div className="rating">
            <FiStar className="star" />
            <span>{service.stats?.avgRating || 0}</span>
            <span className="reviews">({service.stats?.totalReviews || 0})</span>
          </div>
          <span className="price">From ${service.startingPrice || service.packages?.[0]?.price || 0}</span>
        </div>
      </div>
    </div>
  );

  const renderProductCard = (product) => (
    <div key={product._id} className="result-card product-card">
      <div className="card-image">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className="placeholder-image"><FiShoppingBag /></div>
        )}
      </div>
      <div className="card-content">
        <span className="result-type">Product</span>
        <Link to={`/product/${product._id}`} className="card-title">{product.name}</Link>
        <div className="card-footer">
          <div className="rating">
            <FiStar className="star" />
            <span>{product.rating || 0}</span>
          </div>
          <span className="price">${product.price || 0}</span>
        </div>
      </div>
    </div>
  );

  const renderFreelancerCard = (freelancer) => (
    <div key={freelancer._id} className="result-card freelancer-card">
      <div className="freelancer-header">
        <img
          src={freelancer.avatar || '/default-avatar.png'}
          alt={freelancer.firstName}
          className="freelancer-avatar"
        />
        <div className="online-indicator" data-online={freelancer.isOnline}></div>
      </div>
      <div className="card-content">
        <span className="result-type">Freelancer</span>
        <Link to={`/profile/${freelancer.username || freelancer._id}`} className="card-title">
          {freelancer.firstName} {freelancer.lastName}
        </Link>
        <p className="freelancer-title">{freelancer.freelancerProfile?.title || 'Freelancer'}</p>
        <div className="card-footer">
          <div className="rating">
            <FiStar className="star" />
            <span>{freelancer.rating || 0}</span>
            <span className="reviews">({freelancer.reviewCount || 0})</span>
          </div>
          <span className="rate">${freelancer.freelancerProfile?.hourlyRate || 0}/hr</span>
        </div>
        <div className="card-skills">
          {freelancer.freelancerProfile?.skills?.slice(0, 3).map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      );
    }

    if (counts.all === 0 && query) {
      return (
        <div className="empty-state">
          <FiSearch className="empty-icon" />
          <h3>No results found for "{query}"</h3>
          <p>Try different keywords or check your spelling</p>
        </div>
      );
    }

    if (!query) {
      return (
        <div className="empty-state">
          <FiSearch className="empty-icon" />
          <h3>Start your search</h3>
          <p>Search for projects, services, products or freelancers</p>
        </div>
      );
    }

    const getVisibleResults = () => {
      switch (activeTab) {
        case 'projects':
          return { projects: results.projects };
        case 'services':
          return { services: results.services };
        case 'products':
          return { products: results.products };
        case 'freelancers':
          return { freelancers: results.freelancers };
        default:
          return results;
      }
    };

    const visibleResults = getVisibleResults();

    return (
      <div className={`results-grid ${viewMode}`}>
        {visibleResults.projects?.map(renderProjectCard)}
        {visibleResults.services?.map(renderServiceCard)}
        {visibleResults.products?.map(renderProductCard)}
        {visibleResults.freelancers?.map(renderFreelancerCard)}
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="container">
          <form className="search-form-large" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects, services, products, freelancers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          {query && (
            <p className="search-meta">
              Found {counts.all} results for "<strong>{query}</strong>"
            </p>
          )}
        </div>
      </div>

      <div className="search-content">
        <div className="container">
          <div className="search-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon />
                <span>{tab.label}</span>
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="search-toolbar">
            <button
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
              <FiChevronDown className={showFilters ? 'rotated' : ''} />
            </button>

            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </button>
            </div>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="design">Design</option>
                  <option value="writing">Writing</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>

              <button className="clear-filters" onClick={clearFilters}>
                <FiX /> Clear Filters
              </button>
            </div>
          )}

          {renderResults()}
        </div>
      </div>
    </div>
  );
};

export default Search;
