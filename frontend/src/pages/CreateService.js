import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiX, FiUpload, FiDollarSign, FiClock, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { servicesAPI, categoriesAPI } from '../services/api';
import './CreateService.css';

const CreateService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    packages: [
      {
        name: 'basic',
        title: 'Basic',
        description: '',
        price: '',
        deliveryTime: { value: '', unit: 'days' },
        revisions: 1,
        features: ['']
      },
      {
        name: 'standard',
        title: 'Standard',
        description: '',
        price: '',
        deliveryTime: { value: '', unit: 'days' },
        revisions: 2,
        features: ['']
      },
      {
        name: 'premium',
        title: 'Premium',
        description: '',
        price: '',
        deliveryTime: { value: '', unit: 'days' },
        revisions: 3,
        features: ['']
      }
    ],
    requirements: [''],
    faqs: [{ question: '', answer: '' }]
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll({ type: 'service' });
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (packageIndex, field, value) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newPackages[packageIndex][parent][child] = value;
      } else {
        newPackages[packageIndex][field] = value;
      }
      return { ...prev, packages: newPackages };
    });
  };

  const handlePackageFeature = (packageIndex, featureIndex, value) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[packageIndex].features[featureIndex] = value;
      return { ...prev, packages: newPackages };
    });
  };

  const addPackageFeature = (packageIndex) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[packageIndex].features.push('');
      return { ...prev, packages: newPackages };
    });
  };

  const removePackageFeature = (packageIndex, featureIndex) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[packageIndex].features.splice(featureIndex, 1);
      return { ...prev, packages: newPackages };
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index, value) => {
    setFormData(prev => {
      const newReqs = [...prev.requirements];
      newReqs[index] = value;
      return { ...prev, requirements: newReqs };
    });
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    setFormData(prev => {
      const newFaqs = [...prev.faqs];
      newFaqs[index][field] = value;
      return { ...prev, faqs: newFaqs };
    });
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          toast.error('Please enter a service title');
          return false;
        }
        if (!formData.category) {
          toast.error('Please select a category');
          return false;
        }
        if (!formData.description.trim()) {
          toast.error('Please enter a description');
          return false;
        }
        return true;
      case 2:
        const basicPackage = formData.packages[0];
        if (!basicPackage.description || !basicPackage.price || !basicPackage.deliveryTime.value) {
          toast.error('Please complete at least the Basic package');
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      // Clean up packages - remove empty ones
      const cleanPackages = formData.packages
        .filter(pkg => pkg.price && pkg.deliveryTime.value)
        .map(pkg => ({
          ...pkg,
          price: parseFloat(pkg.price),
          deliveryTime: {
            value: parseInt(pkg.deliveryTime.value),
            unit: pkg.deliveryTime.unit
          },
          revisions: parseInt(pkg.revisions),
          features: pkg.features.filter(f => f.trim())
        }));

      // Clean up requirements and FAQs
      const cleanRequirements = formData.requirements.filter(r => r.trim());
      const cleanFaqs = formData.faqs.filter(f => f.question.trim() && f.answer.trim());

      const submitData = {
        ...formData,
        packages: cleanPackages,
        requirements: cleanRequirements,
        faqs: cleanFaqs
      };

      await servicesAPI.create(submitData);
      toast.success('Service created successfully! It will be visible after admin approval.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error(error.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-page">
      <div className="container">
        <div className="page-header">
          <h1>Create a Service</h1>
          <p>Offer your skills and expertise to clients worldwide</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
              <div className="step-number">
                {currentStep > step ? <FiCheck /> : step}
              </div>
              <span className="step-label">
                {step === 1 ? 'Overview' : step === 2 ? 'Pricing' : 'Requirements'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="service-form">
          {/* Step 1: Overview */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Service Overview</h2>

              <div className="form-group">
                <label>Service Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="I will create a professional..."
                  maxLength={80}
                />
                <span className="char-count">{formData.title.length}/80</span>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your service in detail..."
                  rows={6}
                  maxLength={1200}
                />
                <span className="char-count">{formData.description.length}/1200</span>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-input">
                  <div className="tags-list">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button type="button" onClick={() => removeTag(index)}><FiX /></button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-wrapper">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag and press Enter"
                    />
                    <button type="button" className="add-tag-btn" onClick={addTag}>
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Pricing Packages</h2>
              <p className="step-description">Create up to 3 packages with different price points</p>

              <div className="packages-grid">
                {formData.packages.map((pkg, pkgIndex) => (
                  <div key={pkg.name} className={`package-card ${pkg.name}`}>
                    <h3>{pkg.title}</h3>

                    <div className="form-group">
                      <label>Package Description</label>
                      <input
                        type="text"
                        value={pkg.description}
                        onChange={(e) => handlePackageChange(pkgIndex, 'description', e.target.value)}
                        placeholder="Brief description"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label><FiDollarSign /> Price (USD)</label>
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(pkgIndex, 'price', e.target.value)}
                          placeholder="0"
                          min="5"
                        />
                      </div>

                      <div className="form-group">
                        <label><FiClock /> Delivery Time</label>
                        <div className="delivery-input">
                          <input
                            type="number"
                            value={pkg.deliveryTime.value}
                            onChange={(e) => handlePackageChange(pkgIndex, 'deliveryTime.value', e.target.value)}
                            placeholder="0"
                            min="1"
                          />
                          <select
                            value={pkg.deliveryTime.unit}
                            onChange={(e) => handlePackageChange(pkgIndex, 'deliveryTime.unit', e.target.value)}
                          >
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label><FiRefreshCw /> Revisions</label>
                      <select
                        value={pkg.revisions}
                        onChange={(e) => handlePackageChange(pkgIndex, 'revisions', e.target.value)}
                      >
                        {[1, 2, 3, 4, 5, 'Unlimited'].map(num => (
                          <option key={num} value={num === 'Unlimited' ? 99 : num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Features</label>
                      {pkg.features.map((feature, fIndex) => (
                        <div key={fIndex} className="feature-input">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handlePackageFeature(pkgIndex, fIndex, e.target.value)}
                            placeholder="Add a feature"
                          />
                          {pkg.features.length > 1 && (
                            <button type="button" onClick={() => removePackageFeature(pkgIndex, fIndex)}>
                              <FiX />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="add-feature-btn" onClick={() => addPackageFeature(pkgIndex)}>
                        <FiPlus /> Add Feature
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Requirements */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Requirements & FAQs</h2>

              <div className="form-section">
                <h3>Buyer Requirements</h3>
                <p className="section-desc">What information do you need from buyers?</p>

                {formData.requirements.map((req, index) => (
                  <div key={index} className="requirement-input">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="e.g., Please provide your logo in vector format"
                    />
                    {formData.requirements.length > 1 && (
                      <button type="button" onClick={() => removeRequirement(index)}>
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="add-btn" onClick={addRequirement}>
                  <FiPlus /> Add Requirement
                </button>
              </div>

              <div className="form-section">
                <h3>Frequently Asked Questions</h3>
                <p className="section-desc">Add FAQs to help buyers understand your service</p>

                {formData.faqs.map((faq, index) => (
                  <div key={index} className="faq-input">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      placeholder="Question"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      placeholder="Answer"
                      rows={2}
                    />
                    {formData.faqs.length > 1 && (
                      <button type="button" className="remove-faq" onClick={() => removeFaq(index)}>
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="add-btn" onClick={addFaq}>
                  <FiPlus /> Add FAQ
                </button>
              </div>

              <div className="info-box">
                <strong>Note:</strong> Your service will be reviewed by our team and will be published after approval.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={prevStep}>
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" className="btn-primary" onClick={nextStep}>
                Continue
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Service'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
