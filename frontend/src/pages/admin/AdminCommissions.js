import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiInfo } from 'react-icons/fi';
import './AdminPages.css';

const AdminCommissions = () => {
  const [commissionSettings, setCommissionSettings] = useState({
    projectCommission: {
      free: 10,
      starter: 7,
      pro: 5,
      business: 3
    },
    serviceCommission: {
      free: 15,
      starter: 12,
      pro: 8,
      business: 5
    },
    productCommission: {
      free: 12,
      starter: 10,
      pro: 7,
      business: 4
    },
    withdrawalFee: 2.5,
    minimumWithdrawal: 50,
    paymentProcessingFee: 2.9
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState(commissionSettings);

  const handleSave = () => {
    setCommissionSettings(editedSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSettings(commissionSettings);
    setIsEditing(false);
  };

  const updateCommission = (type, tier, value) => {
    setEditedSettings({
      ...editedSettings,
      [type]: {
        ...editedSettings[type],
        [tier]: Number(value)
      }
    });
  };

  const tiers = ['free', 'starter', 'pro', 'business'];
  const tierLabels = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business'
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2>Commission Settings</h2>
          <p>Configure platform commission rates by membership tier</p>
        </div>
        {!isEditing ? (
          <button className="btn-add" onClick={() => setIsEditing(true)}>
            <FiEdit2 /> Edit Settings
          </button>
        ) : (
          <div className="header-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              <FiX /> Cancel
            </button>
            <button className="btn-save" onClick={handleSave}>
              <FiSave /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="commission-grid">
        {/* Project Commissions */}
        <div className="commission-card">
          <div className="card-title">
            <h3>Project Commissions</h3>
            <span className="info-icon" title="Fee charged when freelancer completes a project">
              <FiInfo />
            </span>
          </div>
          <p className="card-description">Percentage charged on completed project payments</p>
          <div className="commission-tiers">
            {tiers.map(tier => (
              <div className="tier-row" key={tier}>
                <span className={`tier-label ${tier}`}>{tierLabels[tier]}</span>
                {isEditing ? (
                  <div className="tier-input">
                    <input
                      type="number"
                      value={editedSettings.projectCommission[tier]}
                      onChange={(e) => updateCommission('projectCommission', tier, e.target.value)}
                      min="0"
                      max="100"
                      step="0.5"
                    />
                    <span>%</span>
                  </div>
                ) : (
                  <span className="tier-value">{commissionSettings.projectCommission[tier]}%</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Commissions */}
        <div className="commission-card">
          <div className="card-title">
            <h3>Service Commissions</h3>
            <span className="info-icon" title="Fee charged when seller completes a service order">
              <FiInfo />
            </span>
          </div>
          <p className="card-description">Percentage charged on completed service orders</p>
          <div className="commission-tiers">
            {tiers.map(tier => (
              <div className="tier-row" key={tier}>
                <span className={`tier-label ${tier}`}>{tierLabels[tier]}</span>
                {isEditing ? (
                  <div className="tier-input">
                    <input
                      type="number"
                      value={editedSettings.serviceCommission[tier]}
                      onChange={(e) => updateCommission('serviceCommission', tier, e.target.value)}
                      min="0"
                      max="100"
                      step="0.5"
                    />
                    <span>%</span>
                  </div>
                ) : (
                  <span className="tier-value">{commissionSettings.serviceCommission[tier]}%</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Commissions */}
        <div className="commission-card">
          <div className="card-title">
            <h3>Product Commissions</h3>
            <span className="info-icon" title="Fee charged on product sales">
              <FiInfo />
            </span>
          </div>
          <p className="card-description">Percentage charged on product sales</p>
          <div className="commission-tiers">
            {tiers.map(tier => (
              <div className="tier-row" key={tier}>
                <span className={`tier-label ${tier}`}>{tierLabels[tier]}</span>
                {isEditing ? (
                  <div className="tier-input">
                    <input
                      type="number"
                      value={editedSettings.productCommission[tier]}
                      onChange={(e) => updateCommission('productCommission', tier, e.target.value)}
                      min="0"
                      max="100"
                      step="0.5"
                    />
                    <span>%</span>
                  </div>
                ) : (
                  <span className="tier-value">{commissionSettings.productCommission[tier]}%</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Other Fees */}
        <div className="commission-card fees-card">
          <div className="card-title">
            <h3>Additional Fees</h3>
          </div>
          <p className="card-description">Other platform fees and charges</p>
          <div className="fees-list">
            <div className="fee-row">
              <div className="fee-info">
                <span className="fee-label">Withdrawal Fee</span>
                <span className="fee-description">Fee charged on each withdrawal request</span>
              </div>
              {isEditing ? (
                <div className="tier-input">
                  <input
                    type="number"
                    value={editedSettings.withdrawalFee}
                    onChange={(e) => setEditedSettings({ ...editedSettings, withdrawalFee: Number(e.target.value) })}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span>%</span>
                </div>
              ) : (
                <span className="tier-value">{commissionSettings.withdrawalFee}%</span>
              )}
            </div>
            <div className="fee-row">
              <div className="fee-info">
                <span className="fee-label">Minimum Withdrawal</span>
                <span className="fee-description">Minimum amount required to withdraw</span>
              </div>
              {isEditing ? (
                <div className="tier-input">
                  <span>$</span>
                  <input
                    type="number"
                    value={editedSettings.minimumWithdrawal}
                    onChange={(e) => setEditedSettings({ ...editedSettings, minimumWithdrawal: Number(e.target.value) })}
                    min="0"
                    step="1"
                  />
                </div>
              ) : (
                <span className="tier-value">${commissionSettings.minimumWithdrawal}</span>
              )}
            </div>
            <div className="fee-row">
              <div className="fee-info">
                <span className="fee-label">Payment Processing Fee</span>
                <span className="fee-description">Gateway fee passed to buyers</span>
              </div>
              {isEditing ? (
                <div className="tier-input">
                  <input
                    type="number"
                    value={editedSettings.paymentProcessingFee}
                    onChange={(e) => setEditedSettings({ ...editedSettings, paymentProcessingFee: Number(e.target.value) })}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span>%</span>
                </div>
              ) : (
                <span className="tier-value">{commissionSettings.paymentProcessingFee}%</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Commission Preview */}
      <div className="commission-preview">
        <h3>Commission Preview</h3>
        <p>Example: $1,000 project completion</p>
        <div className="preview-grid">
          {tiers.map(tier => {
            const commission = isEditing ? editedSettings.projectCommission[tier] : commissionSettings.projectCommission[tier];
            const fee = (1000 * commission) / 100;
            const payout = 1000 - fee;
            return (
              <div className="preview-card" key={tier}>
                <span className={`tier-badge ${tier}`}>{tierLabels[tier]}</span>
                <div className="preview-values">
                  <div className="preview-row">
                    <span>Project Value</span>
                    <span>$1,000.00</span>
                  </div>
                  <div className="preview-row fee">
                    <span>Platform Fee ({commission}%)</span>
                    <span>-${fee.toFixed(2)}</span>
                  </div>
                  <div className="preview-row total">
                    <span>Freelancer Receives</span>
                    <span>${payout.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminCommissions;
