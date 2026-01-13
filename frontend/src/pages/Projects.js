import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiClock, FiDollarSign, FiUsers, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import './Projects.css';

const Projects = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    budget: '',
    skills: [],
    location: '',
    projectType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - will be replaced with API
  const projects = [
    {
      id: 1,
      title: 'Build a Modern E-commerce Website with React & Node.js',
      description: 'Looking for an experienced developer to build a full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.',
      budget: { min: 2000, max: 5000, type: 'fixed' },
      skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'Web Development',
      postedBy: { name: 'TechCorp Inc', location: 'United States', avatar: null, verified: true },
      bids: 24,
      postedAt: '2 hours ago',
      deadline: '30 days'
    },
    {
      id: 2,
      title: 'Mobile App UI/UX Design for Fitness Application',
      description: 'Need a creative designer to create modern UI/UX designs for a fitness tracking mobile application. Must have experience with health/fitness apps.',
      budget: { min: 500, max: 1500, type: 'fixed' },
      skills: ['Figma', 'UI Design', 'Mobile Design', 'Prototyping'],
      category: 'Design',
      postedBy: { name: 'FitLife Startup', location: 'Canada', avatar: null, verified: true },
      bids: 45,
      postedAt: '5 hours ago',
      deadline: '14 days'
    },
    {
      id: 3,
      title: 'SEO Optimization & Content Marketing Strategy',
      description: 'Seeking an SEO expert to improve our website rankings and develop a comprehensive content marketing strategy for our SaaS product.',
      budget: { min: 50, max: 100, type: 'hourly' },
      skills: ['SEO', 'Content Marketing', 'Google Analytics', 'Keyword Research'],
      category: 'Digital Marketing',
      postedBy: { name: 'SaaS Solutions', location: 'United Kingdom', avatar: null, verified: false },
      bids: 18,
      postedAt: '1 day ago',
      deadline: '60 days'
    },
    {
      id: 4,
      title: 'WordPress Website Development with Custom Theme',
      description: 'Need a WordPress developer to create a custom theme for our business website. Must be responsive, fast-loading, and SEO optimized.',
      budget: { min: 800, max: 1500, type: 'fixed' },
      skills: ['WordPress', 'PHP', 'CSS', 'JavaScript'],
      category: 'Web Development',
      postedBy: { name: 'LocalBiz Store', location: 'Australia', avatar: null, verified: true },
      bids: 32,
      postedAt: '3 hours ago',
      deadline: '21 days'
    },
    {
      id: 5,
      title: 'Video Editing for YouTube Channel',
      description: 'Looking for a video editor for ongoing YouTube content. Need someone who can edit gaming videos with effects, transitions, and engaging thumbnails.',
      budget: { min: 30, max: 50, type: 'hourly' },
      skills: ['Video Editing', 'Adobe Premiere', 'After Effects', 'Thumbnail Design'],
      category: 'Video & Animation',
      postedBy: { name: 'Gaming Channel', location: 'Germany', avatar: null, verified: true },
      bids: 56,
      postedAt: '6 hours ago',
      deadline: 'Ongoing'
    },
    {
      id: 6,
      title: 'Data Entry & Virtual Assistant Tasks',
      description: 'Need a reliable virtual assistant for data entry, email management, and basic administrative tasks. Long-term position available.',
      budget: { min: 10, max: 20, type: 'hourly' },
      skills: ['Data Entry', 'Excel', 'Email Management', 'Admin Support'],
      category: 'Admin Support',
      postedBy: { name: 'Remote Business', location: 'India', avatar: null, verified: false },
      bids: 89,
      postedAt: '12 hours ago',
      deadline: 'Ongoing'
    }
  ];

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile Development',
    'Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Admin Support',
    'Data Science',
    'Engineering'
  ];

  const budgetRanges = [
    { label: 'Any Budget', value: '' },
    { label: 'Under $500', value: '0-500' },
    { label: '$500 - $1,000', value: '500-1000' },
    { label: '$1,000 - $5,000', value: '1000-5000' },
    { label: '$5,000 - $10,000', value: '5000-10000' },
    { label: '$10,000+', value: '10000+' }
  ];

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
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search projects by keyword..." />
            </div>
            <div className="filter-controls">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="filter-select"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={i === 0 ? '' : cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filters.budget}
                onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                className="filter-select"
              >
                {budgetRanges.map((range, i) => (
                  <option key={i} value={range.value}>{range.label}</option>
                ))}
              </select>
              <button
                className="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> More Filters
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

          {/* Results Info */}
          <div className="results-info">
            <span className="results-count">{projects.length} projects found</span>
            <div className="sort-by">
              <span>Sort by:</span>
              <select>
                <option value="newest">Newest First</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
                <option value="bids-low">Fewest Bids</option>
              </select>
            </div>
          </div>

          {/* Projects Grid/List */}
          <div className={`projects-grid ${viewMode}`}>
            {projects.map(project => (
              <div className="project-card" key={project.id}>
                <div className="project-header">
                  <span className="project-category">{project.category}</span>
                  <span className="project-time">{project.postedAt}</span>
                </div>
                <h3 className="project-title">
                  <Link to={`/project/${project.id}`}>{project.title}</Link>
                </h3>
                <p className="project-description">{project.description}</p>
                <div className="project-skills">
                  {project.skills.slice(0, 4).map((skill, i) => (
                    <span className="skill-tag" key={i}>{skill}</span>
                  ))}
                  {project.skills.length > 4 && (
                    <span className="skill-more">+{project.skills.length - 4}</span>
                  )}
                </div>
                <div className="project-meta">
                  <div className="meta-item budget">
                    <FiDollarSign />
                    <span>
                      ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                      <small> ({project.budget.type})</small>
                    </span>
                  </div>
                  <div className="meta-item deadline">
                    <FiClock />
                    <span>{project.deadline}</span>
                  </div>
                  <div className="meta-item bids">
                    <FiUsers />
                    <span>{project.bids} bids</span>
                  </div>
                </div>
                <div className="project-footer">
                  <div className="client-info">
                    <div className="client-avatar">
                      {project.postedBy.name.charAt(0)}
                    </div>
                    <div className="client-details">
                      <span className="client-name">
                        {project.postedBy.name}
                        {project.postedBy.verified && <span className="verified-badge">✓</span>}
                      </span>
                      <span className="client-location">
                        <FiMapPin /> {project.postedBy.location}
                      </span>
                    </div>
                  </div>
                  <Link to={`/project/${project.id}`} className="bid-btn">
                    Place Bid
                  </Link>
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

export default Projects;
