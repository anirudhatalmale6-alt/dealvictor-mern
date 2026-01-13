import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft, FiCheck, FiX, FiPlus, FiUpload, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './PostProject.css';

const PostProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    skills: [],
    budgetType: 'fixed',
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    deadline: '',
    attachments: [],
    visibility: 'public',
    nda: false
  });
  const [skillInput, setSkillInput] = useState('');

  const categories = [
    {
      name: 'Web Development',
      subcategories: ['Frontend', 'Backend', 'Full Stack', 'WordPress', 'E-commerce', 'Web Design']
    },
    {
      name: 'Mobile Development',
      subcategories: ['iOS', 'Android', 'React Native', 'Flutter', 'Hybrid Apps']
    },
    {
      name: 'Design',
      subcategories: ['Logo Design', 'UI/UX', 'Graphic Design', 'Brand Identity', 'Illustration']
    },
    {
      name: 'Digital Marketing',
      subcategories: ['SEO', 'Social Media', 'PPC', 'Content Marketing', 'Email Marketing']
    },
    {
      name: 'Writing & Translation',
      subcategories: ['Copywriting', 'Technical Writing', 'Translation', 'Proofreading', 'Content Writing']
    },
    {
      name: 'Video & Animation',
      subcategories: ['Video Editing', '2D Animation', '3D Animation', 'Motion Graphics', 'Explainer Videos']
    },
    {
      name: 'Admin Support',
      subcategories: ['Data Entry', 'Virtual Assistant', 'Customer Service', 'Transcription', 'Research']
    },
    {
      name: 'Data Science',
      subcategories: ['Machine Learning', 'Data Analysis', 'Data Visualization', 'Python', 'R Programming']
    }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          toast.error('Please enter a project title');
          return false;
        }
        if (!formData.category) {
          toast.error('Please select a category');
          return false;
        }
        return true;
      case 2:
        if (!formData.description.trim() || formData.description.length < 50) {
          toast.error('Please provide a detailed description (minimum 50 characters)');
          return false;
        }
        if (formData.skills.length === 0) {
          toast.error('Please add at least one required skill');
          return false;
        }
        return true;
      case 3:
        if (!formData.budgetMin || !formData.budgetMax) {
          toast.error('Please enter budget range');
          return false;
        }
        if (Number(formData.budgetMin) > Number(formData.budgetMax)) {
          toast.error('Minimum budget cannot be greater than maximum');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      // API call to post project
      toast.success('Project posted successfully!');
      navigate('/my-projects');
    } catch (error) {
      toast.error('Failed to post project. Please try again.');
    }
  };

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  return (
    <div className="post-project-page">
      <div className="container">
        <div className="post-project-wrapper">
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">{step > 1 ? <FiCheck /> : '1'}</div>
              <span>Basic Info</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">{step > 2 ? <FiCheck /> : '2'}</div>
              <span>Details</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="step-number">{step > 3 ? <FiCheck /> : '3'}</div>
              <span>Budget</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <span>Review</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="form-card">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="form-step">
                <h2>Tell us about your project</h2>
                <p className="step-subtitle">Start with the basics - what do you need done?</p>

                <div className="form-group">
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Build an e-commerce website with React"
                    className="form-input"
                    maxLength={100}
                  />
                  <span className="char-count">{formData.title.length}/100</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <div className="category-grid">
                    {categories.map((cat, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`category-btn ${formData.category === cat.name ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.name, subcategory: '' }))}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCategory && (
                  <div className="form-group">
                    <label className="form-label">Subcategory</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select a subcategory</option>
                      {selectedCategory.subcategories.map((sub, i) => (
                        <option key={i} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="form-step">
                <h2>Project Details</h2>
                <p className="step-subtitle">Provide more information to attract the right freelancers</p>

                <div className="form-group">
                  <label className="form-label">Project Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project in detail. Include what you need, your goals, any specific requirements, and how you'll measure success..."
                    className="form-textarea"
                    rows={8}
                  />
                  <span className="char-count">{formData.description.length} characters (minimum 50)</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills *</label>
                  <div className="skills-input-wrapper">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a skill and press Enter"
                      className="form-input"
                    />
                    <button type="button" className="add-skill-btn" onClick={addSkill}>
                      <FiPlus /> Add
                    </button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="skills-list">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)}>
                            <FiX />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Attachments (Optional)</label>
                  <div className="upload-zone">
                    <FiUpload className="upload-icon" />
                    <p>Drag & drop files here or click to browse</p>
                    <span>PDF, DOC, images up to 10MB each</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <div className="form-step">
                <h2>Set Your Budget</h2>
                <p className="step-subtitle">Define how you'd like to pay for this project</p>

                <div className="form-group">
                  <label className="form-label">Budget Type</label>
                  <div className="budget-type-selector">
                    <button
                      type="button"
                      className={`budget-type-btn ${formData.budgetType === 'fixed' ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, budgetType: 'fixed' }))}
                    >
                      <strong>Fixed Price</strong>
                      <span>Pay a fixed amount for the entire project</span>
                    </button>
                    <button
                      type="button"
                      className={`budget-type-btn ${formData.budgetType === 'hourly' ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, budgetType: 'hourly' }))}
                    >
                      <strong>Hourly Rate</strong>
                      <span>Pay per hour worked on the project</span>
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="form-select"
                    >
                      {currencies.map(curr => (
                        <option key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.code} - {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Minimum Budget {formData.budgetType === 'hourly' && '(per hour)'}
                    </label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">
                        {currencies.find(c => c.code === formData.currency)?.symbol}
                      </span>
                      <input
                        type="number"
                        name="budgetMin"
                        value={formData.budgetMin}
                        onChange={handleChange}
                        placeholder="0"
                        className="form-input"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Maximum Budget {formData.budgetType === 'hourly' && '(per hour)'}
                    </label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">
                        {currencies.find(c => c.code === formData.currency)?.symbol}
                      </span>
                      <input
                        type="number"
                        name="budgetMax"
                        value={formData.budgetMax}
                        onChange={handleChange}
                        placeholder="0"
                        className="form-input"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Project Visibility</label>
                  <div className="visibility-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={formData.visibility === 'public'}
                        onChange={handleChange}
                      />
                      <span className="radio-custom"></span>
                      <div>
                        <strong>Public</strong>
                        <p>Visible to all freelancers</p>
                      </div>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={formData.visibility === 'private'}
                        onChange={handleChange}
                      />
                      <span className="radio-custom"></span>
                      <div>
                        <strong>Private</strong>
                        <p>Only invited freelancers can view</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="nda"
                      checked={formData.nda}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span>Require NDA (Non-Disclosure Agreement)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="form-step">
                <h2>Review Your Project</h2>
                <p className="step-subtitle">Make sure everything looks good before posting</p>

                <div className="review-section">
                  <h3>Basic Information</h3>
                  <div className="review-item">
                    <span className="review-label">Title:</span>
                    <span className="review-value">{formData.title}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Category:</span>
                    <span className="review-value">{formData.category} {formData.subcategory && `> ${formData.subcategory}`}</span>
                  </div>
                </div>

                <div className="review-section">
                  <h3>Description</h3>
                  <p className="review-description">{formData.description}</p>
                </div>

                <div className="review-section">
                  <h3>Required Skills</h3>
                  <div className="skills-list review">
                    {formData.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="review-section">
                  <h3>Budget & Timeline</h3>
                  <div className="review-item">
                    <span className="review-label">Budget Type:</span>
                    <span className="review-value">{formData.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Budget Range:</span>
                    <span className="review-value">
                      {currencies.find(c => c.code === formData.currency)?.symbol}
                      {Number(formData.budgetMin).toLocaleString()} - {currencies.find(c => c.code === formData.currency)?.symbol}
                      {Number(formData.budgetMax).toLocaleString()}
                      {formData.budgetType === 'hourly' && ' per hour'}
                    </span>
                  </div>
                  {formData.deadline && (
                    <div className="review-item">
                      <span className="review-label">Deadline:</span>
                      <span className="review-value">{new Date(formData.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="review-item">
                    <span className="review-label">Visibility:</span>
                    <span className="review-value">{formData.visibility === 'public' ? 'Public' : 'Private'}</span>
                  </div>
                  {formData.nda && (
                    <div className="review-item">
                      <span className="review-label">NDA Required:</span>
                      <span className="review-value">Yes</span>
                    </div>
                  )}
                </div>

                <div className="terms-notice">
                  <FiInfo />
                  <p>By posting this project, you agree to our Terms of Service and Project Guidelines.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {step > 1 && (
                <button type="button" className="btn btn-outline" onClick={prevStep}>
                  <FiChevronLeft /> Previous
                </button>
              )}
              {step < 4 ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next <FiChevronRight />
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Post Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProject;
