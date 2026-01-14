import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiGrid, FiList, FiStar, FiHeart,
  FiClock, FiRefreshCw, FiShare2, FiX
} from 'react-icons/fi';
import { servicesAPI, categoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Services.css';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
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
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    deliveryTime: searchParams.get('deliveryTime') || '',
    sellerLevel: searchParams.get('sellerLevel') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '-stats.avgRating'
  });

  const priceRanges = [
    { label: 'Any Price', min: '', max: '' },
    { label: 'Under $50', min: '0', max: '50' },
    { label: '$50 - $100', min: '50', max: '100' },
    { label: '$100 - $200', min: '100', max: '200' },
    { label: '$200 - $500', min: '200', max: '500' },
    { label: '$500+', min: '500', max: '' }
  ];

  const deliveryTimes = [
    { label: 'Any', value: '' },
    { label: 'Up to 24 hours', value: '1' },
    { label: 'Up to 3 days', value: '3' },
    { label: 'Up to 7 days', value: '7' },
    { label: 'Up to 14 days', value: '14' }
  ];

  const sellerLevels = [
    { label: 'All Levels', value: '' },
    { label: 'Top Rated', value: 'top-rated' },
    { label: 'Pro', value: 'pro' },
    { label: 'Verified', value: 'verified' },
    { label: 'New Seller', value: 'new' }
  ];

  const sortOptions = [
    { label: 'Recommended', value: '-stats.avgRating' },
    { label: 'Best Selling', value: '-stats.orders' },
    { label: 'Newest', value: '-createdAt' },
    { label: 'Price: Low to High', value: 'startingPrice' },
    { label: 'Price: High to Low', value: '-startingPrice' }
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesAPI.getAll({ type: 'service' });
        setCategories(res.data.data || res.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: 'active'
      };

      if (filters.category) params.category = filters.category;
      if (filters.priceMin) params.minPrice = filters.priceMin;
      if (filters.priceMax) params.maxPrice = filters.priceMax;
      if (filters.deliveryTime) params.deliveryTime = filters.deliveryTime;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const res = await servicesAPI.getAll(params);
      setServices(res.data.services || res.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.pagination?.total || 0,
        pages: res.data.pagination?.pages || 0
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Update URL params
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

  const handlePriceRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceMin: range.min,
      priceMax: range.max
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      deliveryTime: '',
      sellerLevel: '',
      search: '',
      sort: '-stats.avgRating'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const getLevelBadgeClass = (level) => {
    if (!level) return '';
    return level.toLowerCase().replace(' ', '-');
  };

  const getSellerLevel = (seller) => {
    if (!seller) return 'New';
    if (seller.stats?.avgRating >= 4.8 && seller.stats?.totalReviews >= 50) return 'Top Rated';
    if (seller.isVerified) return 'Pro';
    if (seller.stats?.totalReviews >= 10) return 'Verified';
    return 'New Seller';
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '-stats.avgRating').length;

  return (
    <div className="services-page">
      {/* Header */}
      <div className="services-header">
        <div className="container">
          <h1>Explore Services</h1>
          <p>Find the perfect freelance service for your project</p>
        </div>
      </div>

      <div className="container">
        <div className="services-content">
          {/* Filters Bar */}
          <div className="filters-bar">
            <div className="filter-group">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={`${filters.priceMin}-${filters.priceMax}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-');
                  handlePriceRangeChange({ min, max });
                }}
              >
                {priceRanges.map((range, i) => (
                  <option key={i} value={`${range.min}-${range.max}`}>{range.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={filters.deliveryTime}
                onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
              >
                <option value="">Delivery Time</option>
                {deliveryTimes.map((time, i) => (
                  <option key={i} value={time.value}>{time.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={filters.sellerLevel}
                onChange={(e) => handleFilterChange('sellerLevel', e.target.value)}
              >
                <option value="">Seller Level</option>
                {sellerLevels.map((level, i) => (
                  <option key={i} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
            <form onSubmit={handleSearch} className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search services..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </form>
            {activeFiltersCount > 0 && (
              <button className="clear-btn" onClick={clearFilters}>
                <FiX /> Clear
              </button>
            )}
          </div>

          {/* Results Bar */}
          <div className="results-bar">
            <span className="results-count">
              {loading ? 'Loading...' : `${pagination.total} services available`}
            </span>
            <div className="results-controls">
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
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="no-results">
              <h3>No services found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={`services-grid ${viewMode}`}>
              {services.map(service => (
                <div className="service-card" key={service._id}>
                  <div className="service-image">
                    <img
                      src={service.images?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.title)}&background=random&size=400`}
                      alt={service.title}
                    />
                    <div className="service-actions">
                      <button className="action-btn wishlist"><FiHeart /></button>
                      <button className="action-btn share"><FiShare2 /></button>
                    </div>
                    {service.stats?.orders > 0 && (
                      <span className="queue-badge">{service.stats.orders} orders</span>
                    )}
                  </div>
                  <div className="service-content">
                    <div className="seller-row">
                      <div className="seller-info">
                        <div className="seller-avatar">
                          {service.freelancer?.avatar ? (
                            <img src={service.freelancer.avatar} alt={service.freelancer.firstName} />
                          ) : (
                            service.freelancer?.firstName?.charAt(0) || 'F'
                          )}
                        </div>
                        <div className="seller-details">
                          <Link
                            to={`/profile/${service.freelancer?._id}`}
                            className="seller-name"
                          >
                            {service.freelancer?.firstName} {service.freelancer?.lastName?.charAt(0)}.
                            {service.freelancer?.isVerified && <span className="verified">✓</span>}
                          </Link>
                          <span className={`seller-level ${getLevelBadgeClass(getSellerLevel(service.freelancer))}`}>
                            {getSellerLevel(service.freelancer)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <h3 className="service-title">
                      <Link to={`/service/${service._id}`}>{service.title}</Link>
                    </h3>
                    <div className="service-rating">
                      <FiStar className="star-filled" />
                      <span className="rating-value">{service.stats?.avgRating?.toFixed(1) || '5.0'}</span>
                      <span className="review-count">({service.stats?.totalReviews || 0})</span>
                    </div>
                  </div>
                  <div className="service-footer">
                    <div className="service-meta">
                      <span className="delivery-info">
                        <FiClock /> {service.packages?.[0]?.deliveryTime?.value || 3} day delivery
                      </span>
                      <span className="revisions-info">
                        <FiRefreshCw /> {service.packages?.[0]?.revisions || 2} revisions
                      </span>
                    </div>
                    <div className="service-price">
                      <span className="price-label">Starting at</span>
                      <span className="price-value">${service.startingPrice || service.packages?.[0]?.price || 50}</span>
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

export default Services;
