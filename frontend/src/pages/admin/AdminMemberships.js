import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX, FiSave } from 'react-icons/fi';
import './AdminPages.css';

const AdminMemberships = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      bidsPerMonth: 10,
      platformFee: 10,
      features: ['Basic Support', '10 Bids/Month', '10% Platform Fee'],
      isActive: true
    },
    {
      id: 2,
      name: 'Starter',
      monthlyPrice: 19,
      annualPrice: 149,
      bidsPerMonth: 50,
      platformFee: 7,
      features: ['Priority Support', '50 Bids/Month', '7% Platform Fee', 'Featured Badge'],
      isActive: true
    },
    {
      id: 3,
      name: 'Pro',
      monthlyPrice: 49,
      annualPrice: 399,
      bidsPerMonth: 150,
      platformFee: 5,
      features: ['24/7 Support', '150 Bids/Month', '5% Platform Fee', 'Top Ranking', 'Analytics'],
      isActive: true
    },
    {
      id: 4,
      name: 'Business',
      monthlyPrice: 99,
      annualPrice: 799,
      bidsPerMonth: -1, // Unlimited
      platformFee: 3,
      features: ['Dedicated Manager', 'Unlimited Bids', '3% Platform Fee', 'Premium Badge', 'API Access'],
      isActive: true
    }
  ]);

  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    monthlyPrice: 0,
    annualPrice: 0,
    bidsPerMonth: 10,
    platformFee: 10,
    features: [],
    isActive: true
  });
  const [newFeature, setNewFeature] = useState('');

  const handleEditPlan = (plan) => {
    setEditingPlan({ ...plan });
  };

  const handleSavePlan = () => {
    setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
    setEditingPlan(null);
  };

  const handleDeletePlan = (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    setPlans(plans.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleAddPlan = () => {
    const newId = Math.max(...plans.map(p => p.id)) + 1;
    setPlans([...plans, { ...newPlan, id: newId }]);
    setShowAddModal(false);
    setNewPlan({
      name: '',
      monthlyPrice: 0,
      annualPrice: 0,
      bidsPerMonth: 10,
      platformFee: 10,
      features: [],
      isActive: true
    });
  };

  const addFeature = (isEditing = false) => {
    if (newFeature.trim()) {
      if (isEditing) {
        setEditingPlan({
          ...editingPlan,
          features: [...editingPlan.features, newFeature.trim()]
        });
      } else {
        setNewPlan({
          ...newPlan,
          features: [...newPlan.features, newFeature.trim()]
        });
      }
      setNewFeature('');
    }
  };

  const removeFeature = (index, isEditing = false) => {
    if (isEditing) {
      setEditingPlan({
        ...editingPlan,
        features: editingPlan.features.filter((_, i) => i !== index)
      });
    } else {
      setNewPlan({
        ...newPlan,
        features: newPlan.features.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2>Membership Plans</h2>
          <p>Manage subscription plans and pricing</p>
        </div>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          <FiPlus /> Add New Plan
        </button>
      </div>

      <div className="plans-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Monthly Price</th>
              <th>Annual Price</th>
              <th>Bids/Month</th>
              <th>Platform Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id} className={!plan.isActive ? 'inactive' : ''}>
                <td>
                  <span className="plan-name">{plan.name}</span>
                </td>
                <td>${plan.monthlyPrice}</td>
                <td>${plan.annualPrice}</td>
                <td>{plan.bidsPerMonth === -1 ? 'Unlimited' : plan.bidsPerMonth}</td>
                <td>{plan.platformFee}%</td>
                <td>
                  <button
                    className={`status-toggle ${plan.isActive ? 'active' : ''}`}
                    onClick={() => handleToggleActive(plan.id)}
                  >
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon edit" onClick={() => handleEditPlan(plan)}>
                      <FiEdit2 />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDeletePlan(plan.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingPlan && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Plan: {editingPlan.name}</h3>
              <button className="close-btn" onClick={() => setEditingPlan(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Price ($)</label>
                  <input
                    type="number"
                    value={editingPlan.monthlyPrice}
                    onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Annual Price ($)</label>
                  <input
                    type="number"
                    value={editingPlan.annualPrice}
                    onChange={(e) => setEditingPlan({ ...editingPlan, annualPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bids Per Month (-1 for unlimited)</label>
                  <input
                    type="number"
                    value={editingPlan.bidsPerMonth}
                    onChange={(e) => setEditingPlan({ ...editingPlan, bidsPerMonth: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Platform Fee (%)</label>
                  <input
                    type="number"
                    value={editingPlan.platformFee}
                    onChange={(e) => setEditingPlan({ ...editingPlan, platformFee: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Features</label>
                <div className="features-list">
                  {editingPlan.features.map((feature, index) => (
                    <div className="feature-tag" key={index}>
                      {feature}
                      <button onClick={() => removeFeature(index, true)}><FiX /></button>
                    </div>
                  ))}
                </div>
                <div className="feature-input">
                  <input
                    type="text"
                    placeholder="Add feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature(true)}
                  />
                  <button onClick={() => addFeature(true)}><FiPlus /></button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditingPlan(null)}>Cancel</button>
              <button className="btn-save" onClick={handleSavePlan}>
                <FiSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Plan Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Plan</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Plan Name</label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="Enter plan name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Price ($)</label>
                  <input
                    type="number"
                    value={newPlan.monthlyPrice}
                    onChange={(e) => setNewPlan({ ...newPlan, monthlyPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Annual Price ($)</label>
                  <input
                    type="number"
                    value={newPlan.annualPrice}
                    onChange={(e) => setNewPlan({ ...newPlan, annualPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bids Per Month (-1 for unlimited)</label>
                  <input
                    type="number"
                    value={newPlan.bidsPerMonth}
                    onChange={(e) => setNewPlan({ ...newPlan, bidsPerMonth: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Platform Fee (%)</label>
                  <input
                    type="number"
                    value={newPlan.platformFee}
                    onChange={(e) => setNewPlan({ ...newPlan, platformFee: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Features</label>
                <div className="features-list">
                  {newPlan.features.map((feature, index) => (
                    <div className="feature-tag" key={index}>
                      {feature}
                      <button onClick={() => removeFeature(index)}><FiX /></button>
                    </div>
                  ))}
                </div>
                <div className="feature-input">
                  <input
                    type="text"
                    placeholder="Add feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <button onClick={() => addFeature()}><FiPlus /></button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddPlan}>
                <FiPlus /> Add Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberships;
