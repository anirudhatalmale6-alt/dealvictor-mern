import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiCode, FiPenTool, FiTrendingUp, FiVideo, FiMusic, FiFileText, FiShoppingBag, FiStar, FiHeart, FiShare2, FiShoppingCart, FiCheck, FiUsers, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { icon: <FiCode />, name: 'Web Development', count: '15,234' },
    { icon: <FiPenTool />, name: 'Graphic Design', count: '12,567' },
    { icon: <FiTrendingUp />, name: 'Digital Marketing', count: '8,432' },
    { icon: <FiVideo />, name: 'Video & Animation', count: '6,789' },
    { icon: <FiMusic />, name: 'Music & Audio', count: '4,321' },
    { icon: <FiFileText />, name: 'Writing & Translation', count: '9,876' },
    { icon: <FiShoppingBag />, name: 'E-Commerce', count: '7,654' },
    { icon: <FiBriefcase />, name: 'Business', count: '5,432' },
  ];

  const featuredServices = [
    {
      id: 1,
      title: 'Professional Website Development with React',
      seller: { name: 'John Smith', avatar: null, level: 'Pro', rating: 4.9, reviews: 234 },
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
      price: 150,
      deliveryTime: '3 days'
    },
    {
      id: 2,
      title: 'Modern Logo Design for Your Brand',
      seller: { name: 'Sarah Wilson', avatar: null, level: 'Top Rated', rating: 5.0, reviews: 456 },
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
      price: 75,
      deliveryTime: '2 days'
    },
    {
      id: 3,
      title: 'SEO Optimization & Digital Marketing',
      seller: { name: 'Mike Johnson', avatar: null, level: 'Pro', rating: 4.8, reviews: 189 },
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400',
      price: 200,
      deliveryTime: '7 days'
    },
    {
      id: 4,
      title: 'Professional Video Editing Services',
      seller: { name: 'Emily Davis', avatar: null, level: 'Verified', rating: 4.7, reviews: 98 },
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
      price: 100,
      deliveryTime: '5 days'
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      title: 'Wireless Bluetooth Headphones',
      seller: 'TechStore',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      price: 79.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviews: 1234
    },
    {
      id: 2,
      title: 'Smart Watch Pro Series',
      seller: 'GadgetHub',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviews: 876
    },
    {
      id: 3,
      title: 'Premium Laptop Stand',
      seller: 'OfficeEssentials',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.6,
      reviews: 543
    },
    {
      id: 4,
      title: 'Ergonomic Wireless Mouse',
      seller: 'TechStore',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.4,
      reviews: 321
    },
  ];

  const stats = [
    { icon: <FiUsers />, value: '2M+', label: 'Active Users' },
    { icon: <FiBriefcase />, value: '500K+', label: 'Projects Completed' },
    { icon: <FiDollarSign />, value: '$50M+', label: 'Paid to Freelancers' },
    { icon: <FiStar />, value: '4.9', label: 'Average Rating' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Find the perfect <span>freelance</span> services for your business
          </h1>
          <p className="hero-subtitle">
            Connect with talented professionals worldwide. Get quality work done on time and within budget.
          </p>
          <div className="hero-search">
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for any service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-btn">Search</button>
            </div>
            <div className="popular-searches">
              <span>Popular:</span>
              <Link to="/search?q=web-design">Web Design</Link>
              <Link to="/search?q=logo-design">Logo Design</Link>
              <Link to="/search?q=wordpress">WordPress</Link>
              <Link to="/search?q=seo">SEO</Link>
            </div>
          </div>
        </div>
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse Categories</h2>
            <p>Explore our most popular service categories</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link to={`/services/${category.name.toLowerCase().replace(' ', '-')}`} className="category-card" key={index}>
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <span>{category.count} services</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Services</h2>
            <Link to="/services" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="services-grid">
            {featuredServices.map((service) => (
              <div className="service-card" key={service.id}>
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                  <button className="wishlist-btn"><FiHeart /></button>
                  <div className="share-btn-wrapper">
                    <button className="share-btn"><FiShare2 /></button>
                  </div>
                </div>
                <div className="service-content">
                  <div className="seller-info">
                    <div className="seller-avatar">
                      {service.seller.name.charAt(0)}
                    </div>
                    <div className="seller-details">
                      <span className="seller-name">{service.seller.name}</span>
                      <span className={`seller-level level-${service.seller.level.toLowerCase().replace(' ', '-')}`}>
                        {service.seller.level}
                      </span>
                    </div>
                  </div>
                  <h3 className="service-title">
                    <Link to={`/service/${service.id}`}>{service.title}</Link>
                  </h3>
                  <div className="service-rating">
                    <FiStar className="star-icon filled" />
                    <span className="rating-value">{service.seller.rating}</span>
                    <span className="rating-count">({service.seller.reviews})</span>
                  </div>
                </div>
                <div className="service-footer">
                  <span className="delivery-time">Delivery: {service.deliveryTime}</span>
                  <span className="service-price">From ${service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop Popular Products</h2>
            <Link to="/shop" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                  <button className="wishlist-btn"><FiHeart /></button>
                  {product.originalPrice > product.price && (
                    <span className="discount-badge">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="product-content">
                  <span className="product-seller">{product.seller}</span>
                  <h3 className="product-title">
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </h3>
                  <div className="product-rating">
                    <FiStar className="star-icon filled" />
                    <span>{product.rating}</span>
                    <span className="rating-count">({product.reviews})</span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">${product.originalPrice}</span>
                    )}
                  </div>
                </div>
                <button className="add-to-cart-btn">
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in 3 simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <FiSearch />
              </div>
              <h3>Find Services</h3>
              <p>Browse through thousands of services or post a project to find the perfect freelancer.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <FiUsers />
              </div>
              <h3>Hire Talent</h3>
              <p>Review profiles, portfolios, and reviews to select the best professional for your needs.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <FiCheck />
              </div>
              <h3>Get Work Done</h3>
              <p>Work together seamlessly with our secure payment and communication tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to get started?</h2>
            <p>Join millions of businesses and freelancers who trust DealVictor</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                Get Started Free
              </Link>
              <Link to="/how-it-works" className="btn btn-outline-white">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
