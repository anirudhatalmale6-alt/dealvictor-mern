import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiGrid, FiList, FiStar, FiHeart,
  FiShoppingCart, FiChevronDown, FiShare2
} from 'react-icons/fi';
import './Shop.css';

const Shop = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
    sortBy: 'newest'
  });

  // Mock products data
  const products = [
    {
      id: 1,
      title: 'Wireless Bluetooth Headphones Pro',
      description: 'Premium noise-cancelling wireless headphones with 40-hour battery life',
      price: 79.99,
      originalPrice: 129.99,
      currency: 'USD',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      seller: { name: 'TechStore', rating: 4.8, sales: 1234, verified: true },
      rating: 4.5,
      reviews: 328,
      category: 'Electronics',
      stock: 50,
      freeShipping: true
    },
    {
      id: 2,
      title: 'Smart Watch Series X',
      description: 'Advanced fitness tracking, heart rate monitor, GPS enabled',
      price: 199.99,
      originalPrice: 249.99,
      currency: 'USD',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
      seller: { name: 'GadgetHub', rating: 4.9, sales: 876, verified: true },
      rating: 4.8,
      reviews: 542,
      category: 'Electronics',
      stock: 25,
      freeShipping: true
    },
    {
      id: 3,
      title: 'Premium Laptop Stand - Aluminum',
      description: 'Ergonomic design, adjustable height, heat dissipation',
      price: 49.99,
      originalPrice: 69.99,
      currency: 'USD',
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'],
      seller: { name: 'OfficeEssentials', rating: 4.6, sales: 543, verified: false },
      rating: 4.6,
      reviews: 189,
      category: 'Office',
      stock: 100,
      freeShipping: false
    },
    {
      id: 4,
      title: 'Ergonomic Wireless Mouse',
      description: 'Vertical design, reduces wrist strain, 6 buttons',
      price: 34.99,
      originalPrice: 49.99,
      currency: 'USD',
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'],
      seller: { name: 'TechStore', rating: 4.8, sales: 1234, verified: true },
      rating: 4.4,
      reviews: 267,
      category: 'Electronics',
      stock: 75,
      freeShipping: true
    },
    {
      id: 5,
      title: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit, Cherry MX switches, programmable keys',
      price: 89.99,
      originalPrice: 119.99,
      currency: 'USD',
      images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'],
      seller: { name: 'GameGear', rating: 4.7, sales: 654, verified: true },
      rating: 4.7,
      reviews: 412,
      category: 'Gaming',
      stock: 30,
      freeShipping: true
    },
    {
      id: 6,
      title: 'Portable Power Bank 20000mAh',
      description: 'Fast charging, USB-C, 3 output ports, LED display',
      price: 29.99,
      originalPrice: 39.99,
      currency: 'USD',
      images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'],
      seller: { name: 'PowerTech', rating: 4.5, sales: 2341, verified: true },
      rating: 4.3,
      reviews: 876,
      category: 'Electronics',
      stock: 200,
      freeShipping: false
    }
  ];

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Office',
    'Gaming',
    'Books',
    'Beauty'
  ];

  const priceRanges = [
    { label: 'Any Price', value: '' },
    { label: 'Under $25', value: '0-25' },
    { label: '$25 - $50', value: '25-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: '$200+', value: '200+' }
  ];

  const getDiscountPercent = (price, originalPrice) => {
    return Math.round((1 - price / originalPrice) * 100);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={i <= Math.floor(rating) ? 'star-filled' : 'star-empty'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-header">
        <div className="container">
          <h1>Shop</h1>
          <p>Discover amazing products from sellers worldwide</p>
        </div>
      </div>

      <div className="container">
        <div className="shop-content">
          {/* Sidebar Filters */}
          <aside className="shop-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <ul className="category-list">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <button
                      className={filters.category === (i === 0 ? '' : cat) ? 'active' : ''}
                      onClick={() => setFilters({ ...filters, category: i === 0 ? '' : cat })}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <ul className="price-list">
                {priceRanges.map((range, i) => (
                  <li key={i}>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={filters.priceRange === range.value}
                        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      />
                      <span className="radio-custom"></span>
                      {range.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-section">
              <h3>Rating</h3>
              <ul className="rating-list">
                {[4, 3, 2, 1].map(rating => (
                  <li key={rating}>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === String(rating)}
                        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                      />
                      <span className="radio-custom"></span>
                      <span className="rating-stars">
                        {renderStars(rating)}
                      </span>
                      <span>& Up</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <button className="clear-filters-btn" onClick={() => setFilters({ category: '', priceRange: '', rating: '', sortBy: 'newest' })}>
              Clear All Filters
            </button>
          </aside>

          {/* Main Content */}
          <main className="shop-main">
            {/* Search & Sort Bar */}
            <div className="shop-toolbar">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input type="text" placeholder="Search products..." />
              </div>
              <div className="toolbar-right">
                <div className="sort-by">
                  <span>Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="bestselling">Best Selling</option>
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

            <div className="results-info">
              <span>{products.length} products found</span>
            </div>

            {/* Products Grid */}
            <div className={`products-grid ${viewMode}`}>
              {products.map(product => (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    <img src={product.images[0]} alt={product.title} />
                    <div className="product-badges">
                      {product.originalPrice > product.price && (
                        <span className="discount-badge">
                          -{getDiscountPercent(product.price, product.originalPrice)}%
                        </span>
                      )}
                      {product.freeShipping && (
                        <span className="shipping-badge">Free Shipping</span>
                      )}
                    </div>
                    <div className="product-actions">
                      <button className="action-btn wishlist"><FiHeart /></button>
                      <button className="action-btn share"><FiShare2 /></button>
                    </div>
                    <Link to={`/product/${product.id}`} className="quick-view-btn">
                      Quick View
                    </Link>
                  </div>
                  <div className="product-content">
                    <Link to={`/store/${product.seller.name.toLowerCase()}`} className="seller-link">
                      {product.seller.name}
                      {product.seller.verified && <span className="verified">✓</span>}
                    </Link>
                    <h3 className="product-title">
                      <Link to={`/product/${product.id}`}>{product.title}</Link>
                    </h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-rating">
                      <div className="stars">{renderStars(product.rating)}</div>
                      <span className="rating-value">{product.rating}</span>
                      <span className="review-count">({product.reviews})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                      {product.originalPrice > product.price && (
                        <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button className="add-to-cart-btn">
                      <FiShoppingCart /> Add to Cart
                    </button>
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
