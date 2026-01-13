import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiGrid, FiList, FiStar, FiHeart,
  FiClock, FiRefreshCw, FiShare2
} from 'react-icons/fi';
import './Services.css';

const Services = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    deliveryTime: '',
    sellerLevel: '',
    sortBy: 'recommended'
  });

  // Mock services data
  const services = [
    {
      id: 1,
      title: 'I will create a professional React website for your business',
      description: 'Full-stack web development with React, Node.js, and modern UI/UX design',
      images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'],
      seller: {
        name: 'Alex Chen',
        avatar: null,
        level: 'Top Rated',
        rating: 4.9,
        reviews: 234,
        verified: true
      },
      category: 'Web Development',
      packages: {
        basic: { price: 150, delivery: 3, revisions: 2 },
        standard: { price: 300, delivery: 5, revisions: 5 },
        premium: { price: 500, delivery: 7, revisions: 'unlimited' }
      },
      ordersInQueue: 5
    },
    {
      id: 2,
      title: 'I will design a modern logo and brand identity for your company',
      description: 'Creative logo design with brand guidelines, color palette, and typography',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'],
      seller: {
        name: 'Sarah Wilson',
        avatar: null,
        level: 'Pro',
        rating: 5.0,
        reviews: 456,
        verified: true
      },
      category: 'Logo Design',
      packages: {
        basic: { price: 50, delivery: 2, revisions: 3 },
        standard: { price: 100, delivery: 3, revisions: 5 },
        premium: { price: 200, delivery: 5, revisions: 'unlimited' }
      },
      ordersInQueue: 12
    },
    {
      id: 3,
      title: 'I will boost your SEO rankings with proven strategies',
      description: 'Complete SEO audit, keyword research, on-page optimization, and backlink building',
      images: ['https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400'],
      seller: {
        name: 'Mike Johnson',
        avatar: null,
        level: 'Verified',
        rating: 4.8,
        reviews: 189,
        verified: true
      },
      category: 'SEO',
      packages: {
        basic: { price: 100, delivery: 7, revisions: 1 },
        standard: { price: 250, delivery: 14, revisions: 2 },
        premium: { price: 500, delivery: 30, revisions: 3 }
      },
      ordersInQueue: 3
    },
    {
      id: 4,
      title: 'I will edit your videos professionally for YouTube',
      description: 'High-quality video editing with effects, transitions, color grading, and sound design',
      images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400'],
      seller: {
        name: 'Emily Davis',
        avatar: null,
        level: 'Pro',
        rating: 4.7,
        reviews: 98,
        verified: false
      },
      category: 'Video Editing',
      packages: {
        basic: { price: 75, delivery: 3, revisions: 2 },
        standard: { price: 150, delivery: 5, revisions: 4 },
        premium: { price: 300, delivery: 7, revisions: 'unlimited' }
      },
      ordersInQueue: 7
    },
    {
      id: 5,
      title: 'I will develop a mobile app for iOS and Android',
      description: 'Cross-platform mobile app development using React Native with modern UI',
      images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'],
      seller: {
        name: 'David Park',
        avatar: null,
        level: 'Top Rated',
        rating: 4.9,
        reviews: 312,
        verified: true
      },
      category: 'Mobile Development',
      packages: {
        basic: { price: 500, delivery: 14, revisions: 2 },
        standard: { price: 1000, delivery: 21, revisions: 5 },
        premium: { price: 2000, delivery: 30, revisions: 'unlimited' }
      },
      ordersInQueue: 2
    },
    {
      id: 6,
      title: 'I will write SEO-optimized blog posts and articles',
      description: 'Engaging content writing for blogs, websites, and marketing materials',
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      seller: {
        name: 'Jessica Brown',
        avatar: null,
        level: 'Verified',
        rating: 4.6,
        reviews: 156,
        verified: true
      },
      category: 'Content Writing',
      packages: {
        basic: { price: 25, delivery: 2, revisions: 2 },
        standard: { price: 50, delivery: 3, revisions: 3 },
        premium: { price: 100, delivery: 5, revisions: 'unlimited' }
      },
      ordersInQueue: 8
    }
  ];

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile Development',
    'Logo Design',
    'UI/UX Design',
    'SEO',
    'Digital Marketing',
    'Video Editing',
    'Content Writing',
    'Virtual Assistant'
  ];

  const priceRanges = [
    { label: 'Any Price', value: '' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: '$200 - $500', value: '200-500' },
    { label: '$500+', value: '500+' }
  ];

  const deliveryTimes = [
    { label: 'Any', value: '' },
    { label: 'Up to 24 hours', value: '1' },
    { label: 'Up to 3 days', value: '3' },
    { label: 'Up to 7 days', value: '7' },
    { label: 'Any time', value: 'any' }
  ];

  const sellerLevels = [
    { label: 'All Levels', value: '' },
    { label: 'Top Rated', value: 'top-rated' },
    { label: 'Pro', value: 'pro' },
    { label: 'Verified', value: 'verified' },
    { label: 'New Seller', value: 'new' }
  ];

  const getLevelBadgeClass = (level) => {
    return level.toLowerCase().replace(' ', '-');
  };

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
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                {categories.map((cat, i) => (
                  <option key={i} value={i === 0 ? '' : cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                <option value="">Budget</option>
                {priceRanges.map((range, i) => (
                  <option key={i} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={filters.deliveryTime}
                onChange={(e) => setFilters({ ...filters, deliveryTime: e.target.value })}
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
                onChange={(e) => setFilters({ ...filters, sellerLevel: e.target.value })}
              >
                <option value="">Seller Level</option>
                {sellerLevels.map((level, i) => (
                  <option key={i} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search services..." />
            </div>
          </div>

          {/* Results Info */}
          <div className="results-bar">
            <span className="results-count">{services.length} services available</span>
            <div className="results-controls">
              <div className="sort-by">
                <span>Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <option value="recommended">Recommended</option>
                  <option value="bestselling">Best Selling</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
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
          <div className={`services-grid ${viewMode}`}>
            {services.map(service => (
              <div className="service-card" key={service.id}>
                <div className="service-image">
                  <img src={service.images[0]} alt={service.title} />
                  <div className="service-actions">
                    <button className="action-btn wishlist"><FiHeart /></button>
                    <button className="action-btn share"><FiShare2 /></button>
                  </div>
                  {service.ordersInQueue > 0 && (
                    <span className="queue-badge">{service.ordersInQueue} in queue</span>
                  )}
                </div>
                <div className="service-content">
                  <div className="seller-row">
                    <div className="seller-info">
                      <div className="seller-avatar">
                        {service.seller.name.charAt(0)}
                      </div>
                      <div className="seller-details">
                        <Link to={`/profile/${service.seller.name.toLowerCase().replace(' ', '-')}`} className="seller-name">
                          {service.seller.name}
                          {service.seller.verified && <span className="verified">✓</span>}
                        </Link>
                        <span className={`seller-level ${getLevelBadgeClass(service.seller.level)}`}>
                          {service.seller.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="service-title">
                    <Link to={`/service/${service.id}`}>{service.title}</Link>
                  </h3>
                  <div className="service-rating">
                    <FiStar className="star-filled" />
                    <span className="rating-value">{service.seller.rating}</span>
                    <span className="review-count">({service.seller.reviews})</span>
                  </div>
                </div>
                <div className="service-footer">
                  <div className="service-meta">
                    <span className="delivery-info">
                      <FiClock /> {service.packages.basic.delivery} day delivery
                    </span>
                    <span className="revisions-info">
                      <FiRefreshCw /> {service.packages.basic.revisions} revisions
                    </span>
                  </div>
                  <div className="service-price">
                    <span className="price-label">Starting at</span>
                    <span className="price-value">${service.packages.basic.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button className="page-btn" disabled>Previous</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">10</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
