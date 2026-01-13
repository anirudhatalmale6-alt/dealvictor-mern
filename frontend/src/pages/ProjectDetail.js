import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiMapPin, FiClock, FiDollarSign, FiUsers, FiStar, FiCheck,
  FiCalendar, FiPaperclip, FiShare2, FiHeart, FiFlag, FiChevronDown
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    amount: '',
    deliveryDays: '',
    proposal: ''
  });

  // Mock project data - will be replaced with API
  const project = {
    id: 1,
    title: 'Build a Modern E-commerce Website with React & Node.js',
    description: `We are looking for an experienced full-stack developer to build a complete e-commerce platform for our business.

**Project Requirements:**
- Modern, responsive design that works on all devices
- User authentication and authorization
- Product catalog with categories, search, and filters
- Shopping cart and wishlist functionality
- Secure payment integration (Stripe/PayPal)
- Order management and tracking
- Admin dashboard for product and order management
- Email notifications for orders
- SEO-friendly structure

**Technical Stack:**
- Frontend: React.js with Redux or Context API
- Backend: Node.js with Express
- Database: MongoDB
- Payment: Stripe API integration

**Nice to Have:**
- Multi-language support
- Analytics dashboard
- Inventory management
- Customer reviews and ratings

Please provide examples of similar projects you've completed. We prefer developers who can communicate regularly and provide progress updates.`,
    category: 'Web Development',
    subcategory: 'Full Stack',
    budget: { min: 2000, max: 5000, type: 'fixed', currency: 'USD' },
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'Redux', 'REST API'],
    postedBy: {
      name: 'TechCorp Inc',
      username: 'techcorp',
      location: 'San Francisco, United States',
      avatar: null,
      verified: true,
      rating: 4.8,
      reviews: 45,
      projectsPosted: 23,
      hireRate: 87,
      memberSince: 'Jan 2022'
    },
    bids: 24,
    postedAt: '2 hours ago',
    deadline: '30 days',
    visibility: 'public',
    attachments: [
      { name: 'requirements.pdf', size: '234 KB' },
      { name: 'wireframes.zip', size: '1.2 MB' }
    ]
  };

  // Mock bids data
  const existingBids = [
    {
      id: 1,
      freelancer: { name: 'Alex Chen', avatar: null, rating: 4.9, reviews: 127, level: 'Top Rated' },
      amount: 3500,
      deliveryDays: 25,
      proposal: 'Hi! I have 5+ years experience building e-commerce platforms with React and Node.js. I can deliver a high-quality solution...',
      postedAt: '1 hour ago'
    },
    {
      id: 2,
      freelancer: { name: 'Sarah Miller', avatar: null, rating: 4.7, reviews: 89, level: 'Pro' },
      amount: 4200,
      deliveryDays: 21,
      proposal: 'I specialize in full-stack e-commerce development. I\'ve built 15+ similar platforms including payment integration...',
      postedAt: '2 hours ago'
    },
    {
      id: 3,
      freelancer: { name: 'Raj Patel', avatar: null, rating: 4.8, reviews: 156, level: 'Top Rated' },
      amount: 2800,
      deliveryDays: 30,
      proposal: 'Hello! I can build your e-commerce platform with all the features mentioned. I have extensive experience with MERN stack...',
      postedAt: '3 hours ago'
    }
  ];

  const handleBidChange = (e) => {
    setBidData({ ...bidData, [e.target.name]: e.target.value });
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!bidData.amount || !bidData.deliveryDays || !bidData.proposal) {
      toast.error('Please fill in all fields');
      return;
    }
    // API call to submit bid
    toast.success('Bid submitted successfully!');
    setShowBidForm(false);
  };

  return (
    <div className="project-detail-page">
      <div className="container">
        <div className="project-detail-grid">
          {/* Main Content */}
          <div className="project-main">
            <div className="project-header-card">
              <div className="project-breadcrumb">
                <Link to="/projects">Projects</Link>
                <span>/</span>
                <span>{project.category}</span>
              </div>
              <h1 className="project-title">{project.title}</h1>
              <div className="project-meta-row">
                <span className="meta-item">
                  <FiClock /> Posted {project.postedAt}
                </span>
                <span className="meta-item">
                  <FiUsers /> {project.bids} bids
                </span>
                <span className="meta-item">
                  <FiCalendar /> {project.deadline} deadline
                </span>
              </div>
              <div className="project-actions">
                <button className="action-btn"><FiHeart /> Save</button>
                <button className="action-btn"><FiShare2 /> Share</button>
                <button className="action-btn report"><FiFlag /> Report</button>
              </div>
            </div>

            <div className="project-section">
              <h3>Project Description</h3>
              <div className="project-description">
                {project.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            <div className="project-section">
              <h3>Skills Required</h3>
              <div className="skills-list">
                {project.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            {project.attachments.length > 0 && (
              <div className="project-section">
                <h3>Attachments</h3>
                <div className="attachments-list">
                  {project.attachments.map((file, i) => (
                    <a key={i} href="#" className="attachment-item">
                      <FiPaperclip />
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{file.size}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Bids Section */}
            <div className="project-section bids-section">
              <div className="section-header">
                <h3>Bids ({existingBids.length})</h3>
                <select className="sort-select">
                  <option value="newest">Newest First</option>
                  <option value="lowest">Lowest Bid</option>
                  <option value="highest">Highest Bid</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
              <div className="bids-list">
                {existingBids.map(bid => (
                  <div className="bid-card" key={bid.id}>
                    <div className="bid-header">
                      <div className="freelancer-info">
                        <div className="freelancer-avatar">
                          {bid.freelancer.name.charAt(0)}
                        </div>
                        <div className="freelancer-details">
                          <div className="freelancer-name">
                            {bid.freelancer.name}
                            <span className={`level-badge ${bid.freelancer.level.toLowerCase().replace(' ', '-')}`}>
                              {bid.freelancer.level}
                            </span>
                          </div>
                          <div className="freelancer-rating">
                            <FiStar className="star-filled" />
                            <span>{bid.freelancer.rating}</span>
                            <span className="review-count">({bid.freelancer.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="bid-amount">
                        <span className="amount">${bid.amount.toLocaleString()}</span>
                        <span className="delivery">in {bid.deliveryDays} days</span>
                      </div>
                    </div>
                    <p className="bid-proposal">{bid.proposal}</p>
                    <div className="bid-footer">
                      <span className="bid-time">{bid.postedAt}</span>
                      <Link to={`/profile/${bid.freelancer.name.toLowerCase().replace(' ', '-')}`} className="view-profile-btn">
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="project-sidebar">
            {/* Budget Card */}
            <div className="sidebar-card budget-card">
              <h3>Budget</h3>
              <div className="budget-amount">
                ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
              </div>
              <span className="budget-type">{project.budget.type === 'fixed' ? 'Fixed Price' : 'Hourly'}</span>

              {!showBidForm ? (
                <button className="place-bid-btn" onClick={() => setShowBidForm(true)}>
                  Place a Bid
                </button>
              ) : (
                <form className="bid-form" onSubmit={handleSubmitBid}>
                  <div className="form-group">
                    <label>Your Bid Amount ($)</label>
                    <input
                      type="number"
                      name="amount"
                      value={bidData.amount}
                      onChange={handleBidChange}
                      placeholder="Enter your bid"
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Delivery Time (days)</label>
                    <input
                      type="number"
                      name="deliveryDays"
                      value={bidData.deliveryDays}
                      onChange={handleBidChange}
                      placeholder="Days to complete"
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Proposal</label>
                    <textarea
                      name="proposal"
                      value={bidData.proposal}
                      onChange={handleBidChange}
                      placeholder="Describe why you're the best fit for this project..."
                      rows={5}
                    />
                  </div>
                  <div className="bid-form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowBidForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-bid-btn">
                      Submit Bid
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Client Card */}
            <div className="sidebar-card client-card">
              <h3>About the Client</h3>
              <div className="client-header">
                <div className="client-avatar">
                  {project.postedBy.name.charAt(0)}
                </div>
                <div className="client-info">
                  <span className="client-name">
                    {project.postedBy.name}
                    {project.postedBy.verified && (
                      <span className="verified-badge" title="Verified">✓</span>
                    )}
                  </span>
                  <span className="client-location">
                    <FiMapPin /> {project.postedBy.location}
                  </span>
                </div>
              </div>

              <div className="client-stats">
                <div className="stat-item">
                  <FiStar className="star-filled" />
                  <span className="stat-value">{project.postedBy.rating}</span>
                  <span className="stat-label">({project.postedBy.reviews} reviews)</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{project.postedBy.projectsPosted}</span>
                  <span className="stat-label">Projects Posted</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{project.postedBy.hireRate}%</span>
                  <span className="stat-label">Hire Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Member since {project.postedBy.memberSince}</span>
                </div>
              </div>

              <Link to={`/client/${project.postedBy.username}`} className="view-profile-link">
                View Client Profile
              </Link>
            </div>

            {/* Similar Projects */}
            <div className="sidebar-card similar-projects-card">
              <h3>Similar Projects</h3>
              <div className="similar-projects-list">
                <Link to="/project/2" className="similar-project-item">
                  <span className="project-name">React Dashboard Development</span>
                  <span className="project-budget">$1,500 - $3,000</span>
                </Link>
                <Link to="/project/3" className="similar-project-item">
                  <span className="project-name">MERN Stack Application</span>
                  <span className="project-budget">$2,000 - $4,000</span>
                </Link>
                <Link to="/project/4" className="similar-project-item">
                  <span className="project-name">Node.js Backend API</span>
                  <span className="project-budget">$800 - $1,500</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
