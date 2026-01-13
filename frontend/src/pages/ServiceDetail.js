import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiStar, FiHeart, FiShare2, FiClock, FiRefreshCw, FiCheck,
  FiChevronRight, FiMessageCircle, FiMapPin, FiCalendar,
  FiAward, FiUsers, FiPlay
} from 'react-icons/fi';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [activeTab, setActiveTab] = useState('description');

  // Mock service data
  const service = {
    id: 1,
    title: 'I will create a professional website using React and Node.js',
    description: `Are you looking for a modern, responsive, and high-performance website? You're in the right place!

I'm a full-stack developer with 5+ years of experience building web applications using cutting-edge technologies.

**What you'll get:**
• Clean, modern, and responsive design
• React.js frontend with smooth animations
• Node.js/Express backend with REST API
• MongoDB database integration
• User authentication system
• Admin dashboard
• SEO optimization
• Mobile-friendly design
• Cross-browser compatibility

**My Process:**
1. Understanding your requirements
2. Design mockup approval
3. Development phase
4. Testing & bug fixes
5. Deployment & handover

**Technologies I use:**
React, Node.js, Express, MongoDB, Redux, Tailwind CSS, Material-UI

Let's work together to bring your vision to life!`,
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800'
    ],
    video: null,
    seller: {
      id: 1,
      name: 'Alex Johnson',
      username: 'alexdev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      level: 'Top Rated',
      rating: 4.9,
      reviews: 234,
      completedOrders: 312,
      responseTime: '1 hour',
      location: 'San Francisco, USA',
      memberSince: 'Jan 2021',
      languages: ['English', 'Spanish'],
      lastDelivery: '2 days ago',
      bio: 'Full-stack developer passionate about creating amazing web experiences. Specialized in MERN stack.'
    },
    category: 'Web Development',
    subcategory: 'Full Stack Development',
    tags: ['react', 'nodejs', 'mongodb', 'web development', 'mern stack'],
    packages: {
      basic: {
        name: 'Basic',
        price: 150,
        description: 'Simple 3-page website',
        deliveryDays: 7,
        revisions: 2,
        features: [
          '3 pages',
          'Responsive design',
          'Contact form',
          'Source code'
        ]
      },
      standard: {
        name: 'Standard',
        price: 350,
        description: 'Complete 5-page website with backend',
        deliveryDays: 14,
        revisions: 5,
        features: [
          '5 pages',
          'Responsive design',
          'Contact form',
          'Admin panel',
          'Database integration',
          'Source code',
          'Deployment'
        ]
      },
      premium: {
        name: 'Premium',
        price: 750,
        description: 'Full e-commerce or complex web app',
        deliveryDays: 30,
        revisions: -1,
        features: [
          'Unlimited pages',
          'E-commerce features',
          'Payment integration',
          'User authentication',
          'Admin dashboard',
          'API integration',
          'SEO optimization',
          'Source code',
          'Deployment',
          '3 months support'
        ]
      }
    },
    rating: 4.9,
    reviewCount: 234,
    ordersInQueue: 3
  };

  const reviews = [
    {
      id: 1,
      user: { name: 'Michael T.', avatar: 'https://i.pravatar.cc/100?img=11', country: 'United States' },
      rating: 5,
      date: '1 week ago',
      comment: 'Excellent work! Alex delivered exactly what I needed. The website looks amazing and works perfectly. Very professional and responsive communication throughout the project.',
      project: 'E-commerce Website'
    },
    {
      id: 2,
      user: { name: 'Emma S.', avatar: 'https://i.pravatar.cc/100?img=12', country: 'United Kingdom' },
      rating: 5,
      date: '2 weeks ago',
      comment: 'Best developer I\'ve worked with on this platform. Understood my requirements perfectly and delivered ahead of schedule. Highly recommended!',
      project: 'Portfolio Website'
    },
    {
      id: 3,
      user: { name: 'David L.', avatar: 'https://i.pravatar.cc/100?img=13', country: 'Canada' },
      rating: 4,
      date: '3 weeks ago',
      comment: 'Great communication and quality work. Minor revisions were handled quickly. Will definitely work with Alex again.',
      project: 'Business Dashboard'
    }
  ];

  const faqs = [
    { q: 'What information do you need to start?', a: 'I\'ll need your requirements document, design preferences, branding materials (logo, colors), and any specific features you want.' },
    { q: 'Do you provide hosting?', a: 'I can help you set up hosting on platforms like Vercel, Netlify, or AWS. Hosting costs are separate.' },
    { q: 'Can you work with existing designs?', a: 'Yes! I can implement designs from Figma, Sketch, or any other design tool.' },
    { q: 'What about ongoing maintenance?', a: 'I offer maintenance packages. The Premium plan includes 3 months of free support.' }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar key={i} className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'} />
    ));
  };

  const pkg = service.packages[selectedPackage];

  return (
    <div className="service-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <Link to="/services">Services</Link>
          <FiChevronRight />
          <Link to={`/services?category=${service.category}`}>{service.category}</Link>
          <FiChevronRight />
          <span>{service.title.substring(0, 40)}...</span>
        </div>
      </div>

      <div className="container">
        <div className="service-layout">
          {/* Main Content */}
          <div className="service-main">
            {/* Header */}
            <div className="service-header">
              <h1>{service.title}</h1>
              <div className="service-meta">
                <Link to={`/user/${service.seller.username}`} className="seller-mini">
                  <img src={service.seller.avatar} alt={service.seller.name} />
                  <span>{service.seller.name}</span>
                  <span className="seller-level">{service.seller.level}</span>
                </Link>
                <div className="rating">
                  <div className="stars">{renderStars(service.rating)}</div>
                  <span>{service.rating}</span>
                  <span className="review-count">({service.reviewCount})</span>
                </div>
                <span className="orders-queue">{service.ordersInQueue} orders in queue</span>
              </div>
            </div>

            {/* Gallery */}
            <div className="service-gallery">
              <div className="main-image">
                <img src={service.images[0]} alt={service.title} />
              </div>
              <div className="thumbnail-row">
                {service.images.map((img, i) => (
                  <div key={i} className={`thumbnail ${i === 0 ? 'active' : ''}`}>
                    <img src={img} alt={`Preview ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="service-tabs">
              <div className="tabs-header">
                <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>
                  Description
                </button>
                <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
                  Reviews ({service.reviewCount})
                </button>
                <button className={activeTab === 'faq' ? 'active' : ''} onClick={() => setActiveTab('faq')}>
                  FAQ
                </button>
              </div>

              <div className="tabs-content">
                {activeTab === 'description' && (
                  <div className="tab-description">
                    <div className="description-content" style={{ whiteSpace: 'pre-line' }}>
                      {service.description}
                    </div>
                    <div className="tags">
                      {service.tags.map((tag, i) => (
                        <span key={i} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="tab-reviews">
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="big-rating">
                          <span>{service.rating}</span>
                          <div className="stars">{renderStars(service.rating)}</div>
                          <span className="total-reviews">{service.reviewCount} reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="reviews-list">
                      {reviews.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <img src={review.user.avatar} alt={review.user.name} />
                            <div className="review-user-info">
                              <h5>{review.user.name}</h5>
                              <span className="country">{review.user.country}</span>
                            </div>
                            <div className="review-meta">
                              <div className="stars">{renderStars(review.rating)}</div>
                              <span className="date">{review.date}</span>
                            </div>
                          </div>
                          <p>{review.comment}</p>
                          <span className="project-label">Project: {review.project}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="tab-faq">
                    {faqs.map((faq, i) => (
                      <div key={i} className="faq-item">
                        <h4>{faq.q}</h4>
                        <p>{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="seller-section">
              <h3>About the Seller</h3>
              <div className="seller-card">
                <div className="seller-header">
                  <img src={service.seller.avatar} alt={service.seller.name} className="seller-avatar" />
                  <div className="seller-info">
                    <h4>{service.seller.name}</h4>
                    <p className="seller-title">{service.category} Expert</p>
                    <div className="seller-rating">
                      <div className="stars">{renderStars(service.seller.rating)}</div>
                      <span>{service.seller.rating}</span>
                      <span>({service.seller.reviews})</span>
                    </div>
                  </div>
                  <button className="contact-btn"><FiMessageCircle /> Contact Me</button>
                </div>
                <div className="seller-stats">
                  <div className="stat">
                    <FiMapPin />
                    <span>{service.seller.location}</span>
                  </div>
                  <div className="stat">
                    <FiCalendar />
                    <span>Member since {service.seller.memberSince}</span>
                  </div>
                  <div className="stat">
                    <FiClock />
                    <span>Avg. response time: {service.seller.responseTime}</span>
                  </div>
                  <div className="stat">
                    <FiAward />
                    <span>Last delivery: {service.seller.lastDelivery}</span>
                  </div>
                </div>
                <p className="seller-bio">{service.seller.bio}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Package Selection */}
          <div className="service-sidebar">
            <div className="package-card">
              <div className="package-tabs">
                <button
                  className={selectedPackage === 'basic' ? 'active' : ''}
                  onClick={() => setSelectedPackage('basic')}
                >
                  Basic
                </button>
                <button
                  className={selectedPackage === 'standard' ? 'active' : ''}
                  onClick={() => setSelectedPackage('standard')}
                >
                  Standard
                </button>
                <button
                  className={selectedPackage === 'premium' ? 'active' : ''}
                  onClick={() => setSelectedPackage('premium')}
                >
                  Premium
                </button>
              </div>

              <div className="package-content">
                <div className="package-header">
                  <h3>{pkg.name}</h3>
                  <span className="package-price">${pkg.price}</span>
                </div>
                <p className="package-description">{pkg.description}</p>

                <div className="package-meta">
                  <span><FiClock /> {pkg.deliveryDays} days delivery</span>
                  <span><FiRefreshCw /> {pkg.revisions === -1 ? 'Unlimited' : pkg.revisions} revisions</span>
                </div>

                <ul className="package-features">
                  {pkg.features.map((feature, i) => (
                    <li key={i}><FiCheck /> {feature}</li>
                  ))}
                </ul>

                <button className="btn-continue">Continue (${pkg.price})</button>
                <button className="btn-compare">Compare Packages</button>
              </div>
            </div>

            <button className="contact-seller-btn">
              <FiMessageCircle /> Contact Seller
            </button>

            <div className="action-buttons-small">
              <button><FiHeart /> Save</button>
              <button><FiShare2 /> Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
