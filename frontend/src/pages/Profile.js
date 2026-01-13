import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiStar, FiMapPin, FiCalendar, FiClock, FiCheck, FiAward,
  FiMessageCircle, FiHeart, FiShare2, FiExternalLink, FiGrid,
  FiBriefcase, FiDollarSign, FiUsers
} from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('services');

  // Mock user data
  const user = {
    id: 1,
    firstName: 'Alex',
    lastName: 'Johnson',
    username: 'alexdev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    title: 'Full Stack Developer | MERN Specialist',
    bio: `Passionate full-stack developer with 5+ years of experience building scalable web applications. I specialize in React, Node.js, and MongoDB, creating solutions that drive business growth.

I believe in clean code, attention to detail, and delivering projects that exceed expectations. Let's build something amazing together!`,
    location: 'San Francisco, USA',
    memberSince: 'January 2021',
    lastActive: '2 hours ago',
    isOnline: true,
    isVerified: true,
    level: 'Top Rated',
    rating: 4.9,
    reviewCount: 234,
    completedProjects: 312,
    successRate: 98,
    responseTime: '< 1 hour',
    languages: ['English (Native)', 'Spanish (Fluent)'],
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'GraphQL', 'AWS', 'Docker'],
    education: [
      { degree: 'B.S. Computer Science', institution: 'Stanford University', year: '2018' }
    ],
    certifications: [
      'AWS Certified Developer',
      'MongoDB Certified Developer'
    ],
    socialLinks: {
      website: 'https://alexjohnson.dev',
      github: 'alexdev',
      linkedin: 'alexjohnson'
    },
    stats: {
      totalEarnings: '$125K+',
      projectsCompleted: 312,
      happyClients: 285,
      repeatClients: '45%'
    }
  };

  const services = [
    {
      id: 1,
      title: 'I will create a professional React website',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      price: 150,
      rating: 4.9,
      reviews: 87,
      deliveryDays: 7
    },
    {
      id: 2,
      title: 'I will build a full-stack MERN application',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      price: 350,
      rating: 4.8,
      reviews: 62,
      deliveryDays: 14
    },
    {
      id: 3,
      title: 'I will fix bugs in your React or Node.js app',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
      price: 50,
      rating: 5.0,
      reviews: 45,
      deliveryDays: 2
    }
  ];

  const reviews = [
    {
      id: 1,
      user: { name: 'Michael T.', avatar: 'https://i.pravatar.cc/100?img=11', country: 'USA' },
      rating: 5,
      date: '1 week ago',
      comment: 'Alex is an exceptional developer! Delivered my project ahead of schedule with perfect quality.',
      project: 'E-commerce Website'
    },
    {
      id: 2,
      user: { name: 'Sarah K.', avatar: 'https://i.pravatar.cc/100?img=12', country: 'UK' },
      rating: 5,
      date: '2 weeks ago',
      comment: 'Best developer I\'ve worked with. Great communication and amazing results.',
      project: 'SaaS Dashboard'
    },
    {
      id: 3,
      user: { name: 'David L.', avatar: 'https://i.pravatar.cc/100?img=13', country: 'Canada' },
      rating: 5,
      date: '1 month ago',
      comment: 'Professional, responsive, and delivered exactly what I needed. Highly recommended!',
      project: 'Mobile App Backend'
    }
  ];

  const portfolio = [
    { id: 1, title: 'E-commerce Platform', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', category: 'Web App' },
    { id: 2, title: 'SaaS Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', category: 'Dashboard' },
    { id: 3, title: 'Social Media App', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400', category: 'Mobile' },
    { id: 4, title: 'Booking System', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', category: 'Web App' }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar key={i} className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'} />
    ));
  };

  return (
    <div className="profile-page">
      {/* Cover Image */}
      <div className="profile-cover" style={{ backgroundImage: `url(${user.coverImage})` }}>
        <div className="cover-overlay"></div>
      </div>

      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-header">
                <div className="avatar-wrapper">
                  <img src={user.avatar} alt={user.firstName} className="profile-avatar" />
                  {user.isOnline && <span className="online-badge"></span>}
                </div>
                <h1>{user.firstName} {user.lastName}</h1>
                <p className="username">@{user.username}</p>
                <div className="badges">
                  {user.isVerified && <span className="badge verified"><FiCheck /> Verified</span>}
                  <span className="badge level">{user.level}</span>
                </div>
              </div>

              <div className="profile-rating">
                <div className="stars">{renderStars(user.rating)}</div>
                <span className="rating-value">{user.rating}</span>
                <span className="review-count">({user.reviewCount} reviews)</span>
              </div>

              <p className="profile-title">{user.title}</p>

              <div className="profile-actions">
                <button className="btn-contact"><FiMessageCircle /> Contact Me</button>
                <button className="btn-save"><FiHeart /></button>
                <button className="btn-share"><FiShare2 /></button>
              </div>

              <div className="profile-stats">
                <div className="stat">
                  <FiBriefcase />
                  <div>
                    <strong>{user.completedProjects}</strong>
                    <span>Projects</span>
                  </div>
                </div>
                <div className="stat">
                  <FiUsers />
                  <div>
                    <strong>{user.stats.happyClients}</strong>
                    <span>Clients</span>
                  </div>
                </div>
                <div className="stat">
                  <FiAward />
                  <div>
                    <strong>{user.successRate}%</strong>
                    <span>Success</span>
                  </div>
                </div>
              </div>

              <div className="profile-info">
                <div className="info-item">
                  <FiMapPin />
                  <span>{user.location}</span>
                </div>
                <div className="info-item">
                  <FiCalendar />
                  <span>Member since {user.memberSince}</span>
                </div>
                <div className="info-item">
                  <FiClock />
                  <span>Avg. response: {user.responseTime}</span>
                </div>
              </div>

              <div className="profile-section">
                <h3>Languages</h3>
                <ul className="languages-list">
                  {user.languages.map((lang, i) => (
                    <li key={i}>{lang}</li>
                  ))}
                </ul>
              </div>

              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list">
                  {user.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="profile-section">
                <h3>Education</h3>
                {user.education.map((edu, i) => (
                  <div key={i} className="education-item">
                    <strong>{edu.degree}</strong>
                    <span>{edu.institution}, {edu.year}</span>
                  </div>
                ))}
              </div>

              <div className="profile-section">
                <h3>Certifications</h3>
                <ul className="cert-list">
                  {user.certifications.map((cert, i) => (
                    <li key={i}><FiAward /> {cert}</li>
                  ))}
                </ul>
              </div>

              {user.socialLinks && (
                <div className="profile-section">
                  <h3>Links</h3>
                  <div className="social-links">
                    {user.socialLinks.website && (
                      <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <FiExternalLink /> Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="profile-main">
            <div className="profile-bio-card">
              <h2>About Me</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{user.bio}</p>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
              <div className="tabs-header">
                <button
                  className={activeTab === 'services' ? 'active' : ''}
                  onClick={() => setActiveTab('services')}
                >
                  Services ({services.length})
                </button>
                <button
                  className={activeTab === 'portfolio' ? 'active' : ''}
                  onClick={() => setActiveTab('portfolio')}
                >
                  Portfolio ({portfolio.length})
                </button>
                <button
                  className={activeTab === 'reviews' ? 'active' : ''}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({user.reviewCount})
                </button>
              </div>

              <div className="tabs-content">
                {activeTab === 'services' && (
                  <div className="services-grid">
                    {services.map(service => (
                      <Link to={`/service/${service.id}`} key={service.id} className="service-card">
                        <div className="service-image">
                          <img src={service.image} alt={service.title} />
                        </div>
                        <div className="service-content">
                          <h4>{service.title}</h4>
                          <div className="service-meta">
                            <span className="rating">
                              <FiStar className="star-filled" /> {service.rating} ({service.reviews})
                            </span>
                          </div>
                          <div className="service-footer">
                            <span className="delivery"><FiClock /> {service.deliveryDays} days</span>
                            <span className="price">From ${service.price}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div className="portfolio-grid">
                    {portfolio.map(item => (
                      <div key={item.id} className="portfolio-item">
                        <img src={item.image} alt={item.title} />
                        <div className="portfolio-overlay">
                          <h4>{item.title}</h4>
                          <span>{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
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
                        <span className="project-label">{review.project}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
