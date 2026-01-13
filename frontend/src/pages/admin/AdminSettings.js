import React, { useState } from 'react';
import {
  FiGlobe, FiDollarSign, FiMail, FiShield, FiBell,
  FiSave, FiRefreshCw, FiToggleLeft, FiToggleRight
} from 'react-icons/fi';
import './AdminPages.css';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'DealVictor',
      siteTagline: 'Your Global Marketplace',
      siteEmail: 'support@dealvictor.com',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      maintenanceMode: false
    },
    currency: {
      defaultCurrency: 'USD',
      enableMultiCurrency: true,
      autoDetectCurrency: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'INR', 'CAD'],
      exchangeRateProvider: 'openexchangerates'
    },
    bidding: {
      enableBidding: true,
      minBidAmount: 5,
      maxBidAmount: 100000,
      bidExpiryDays: 14,
      allowBidRetraction: true,
      autoRechargeEnabled: true,
      monthlyRechargeDay: 1
    },
    payment: {
      escrowEnabled: true,
      escrowReleaseDays: 14,
      autoPayoutEnabled: false,
      payoutThreshold: 100,
      paymentMethods: ['stripe', 'paypal', 'bank_transfer']
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: true
    },
    security: {
      twoFactorAuth: false,
      loginAttempts: 5,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireEmailVerification: true
    }
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleToggle = (section, field) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: !settings[section][field]
      }
    });
    setUnsavedChanges(true);
  };

  const handleChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // API call to save settings
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FiGlobe /> },
    { id: 'currency', label: 'Currency', icon: <FiDollarSign /> },
    { id: 'bidding', label: 'Bidding', icon: <FiRefreshCw /> },
    { id: 'payment', label: 'Payment', icon: <FiDollarSign /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'security', label: 'Security', icon: <FiShield /> }
  ];

  const Toggle = ({ checked, onChange }) => (
    <button className={`toggle-btn ${checked ? 'active' : ''}`} onClick={onChange}>
      {checked ? <FiToggleRight /> : <FiToggleLeft />}
    </button>
  );

  return (
    <div className="admin-page settings-page">
      <div className="page-header">
        <div>
          <h2>Platform Settings</h2>
          <p>Configure your marketplace settings</p>
        </div>
        {unsavedChanges && (
          <button className="btn-save" onClick={handleSave}>
            <FiSave /> Save Changes
          </button>
        )}
      </div>

      <div className="settings-layout">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Site Tagline</label>
                  <input
                    type="text"
                    value={settings.general.siteTagline}
                    onChange={(e) => handleChange('general', 'siteTagline', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Support Email</label>
                  <input
                    type="email"
                    value={settings.general.siteEmail}
                    onChange={(e) => handleChange('general', 'siteEmail', e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Kolkata">India</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date Format</label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => handleChange('general', 'dateFormat', e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Maintenance Mode</span>
                    <span className="toggle-desc">Temporarily disable site access for visitors</span>
                  </div>
                  <Toggle
                    checked={settings.general.maintenanceMode}
                    onChange={() => handleToggle('general', 'maintenanceMode')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Currency Settings */}
          {activeTab === 'currency' && (
            <div className="settings-section">
              <h3>Currency Settings</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Default Currency</label>
                  <select
                    value={settings.currency.defaultCurrency}
                    onChange={(e) => handleChange('currency', 'defaultCurrency', e.target.value)}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Enable Multi-Currency</span>
                    <span className="toggle-desc">Allow users to view prices in their local currency</span>
                  </div>
                  <Toggle
                    checked={settings.currency.enableMultiCurrency}
                    onChange={() => handleToggle('currency', 'enableMultiCurrency')}
                  />
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Auto-Detect Currency</span>
                    <span className="toggle-desc">Automatically detect user's currency based on location</span>
                  </div>
                  <Toggle
                    checked={settings.currency.autoDetectCurrency}
                    onChange={() => handleToggle('currency', 'autoDetectCurrency')}
                  />
                </div>
                <div className="form-group">
                  <label>Exchange Rate Provider</label>
                  <select
                    value={settings.currency.exchangeRateProvider}
                    onChange={(e) => handleChange('currency', 'exchangeRateProvider', e.target.value)}
                  >
                    <option value="openexchangerates">Open Exchange Rates</option>
                    <option value="fixer">Fixer.io</option>
                    <option value="currencylayer">CurrencyLayer</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Bidding Settings */}
          {activeTab === 'bidding' && (
            <div className="settings-section">
              <h3>Bidding Settings</h3>
              <div className="settings-form">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Enable Bidding System</span>
                    <span className="toggle-desc">Allow freelancers to bid on projects</span>
                  </div>
                  <Toggle
                    checked={settings.bidding.enableBidding}
                    onChange={() => handleToggle('bidding', 'enableBidding')}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Minimum Bid Amount ($)</label>
                    <input
                      type="number"
                      value={settings.bidding.minBidAmount}
                      onChange={(e) => handleChange('bidding', 'minBidAmount', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Maximum Bid Amount ($)</label>
                    <input
                      type="number"
                      value={settings.bidding.maxBidAmount}
                      onChange={(e) => handleChange('bidding', 'maxBidAmount', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Bid Expiry (Days)</label>
                  <input
                    type="number"
                    value={settings.bidding.bidExpiryDays}
                    onChange={(e) => handleChange('bidding', 'bidExpiryDays', Number(e.target.value))}
                  />
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Allow Bid Retraction</span>
                    <span className="toggle-desc">Allow freelancers to withdraw their bids</span>
                  </div>
                  <Toggle
                    checked={settings.bidding.allowBidRetraction}
                    onChange={() => handleToggle('bidding', 'allowBidRetraction')}
                  />
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Auto-Recharge Bids</span>
                    <span className="toggle-desc">Automatically recharge bid balance monthly for subscribers</span>
                  </div>
                  <Toggle
                    checked={settings.bidding.autoRechargeEnabled}
                    onChange={() => handleToggle('bidding', 'autoRechargeEnabled')}
                  />
                </div>
                <div className="form-group">
                  <label>Monthly Recharge Day</label>
                  <select
                    value={settings.bidding.monthlyRechargeDay}
                    onChange={(e) => handleChange('bidding', 'monthlyRechargeDay', Number(e.target.value))}
                  >
                    {[...Array(28)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="settings-section">
              <h3>Payment Settings</h3>
              <div className="settings-form">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Enable Escrow</span>
                    <span className="toggle-desc">Hold payments in escrow until project completion</span>
                  </div>
                  <Toggle
                    checked={settings.payment.escrowEnabled}
                    onChange={() => handleToggle('payment', 'escrowEnabled')}
                  />
                </div>
                <div className="form-group">
                  <label>Escrow Release Period (Days)</label>
                  <input
                    type="number"
                    value={settings.payment.escrowReleaseDays}
                    onChange={(e) => handleChange('payment', 'escrowReleaseDays', Number(e.target.value))}
                  />
                  <span className="input-hint">Days after completion before auto-release</span>
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Auto Payout</span>
                    <span className="toggle-desc">Automatically send payouts when threshold is reached</span>
                  </div>
                  <Toggle
                    checked={settings.payment.autoPayoutEnabled}
                    onChange={() => handleToggle('payment', 'autoPayoutEnabled')}
                  />
                </div>
                <div className="form-group">
                  <label>Payout Threshold ($)</label>
                  <input
                    type="number"
                    value={settings.payment.payoutThreshold}
                    onChange={(e) => handleChange('payment', 'payoutThreshold', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              <div className="settings-form">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Email Notifications</span>
                    <span className="toggle-desc">Send email notifications to users</span>
                  </div>
                  <Toggle
                    checked={settings.notifications.emailNotifications}
                    onChange={() => handleToggle('notifications', 'emailNotifications')}
                  />
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">SMS Notifications</span>
                    <span className="toggle-desc">Send SMS notifications for important updates</span>
                  </div>
                  <Toggle
                    checked={settings.notifications.smsNotifications}
                    onChange={() => handleToggle('notifications', 'smsNotifications')}
                  />
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Push Notifications</span>
                    <span className="toggle-desc">Enable browser push notifications</span>
                  </div>
                  <Toggle
                    checked={settings.notifications.pushNotifications}
                    onChange={() => handleToggle('notifications', 'pushNotifications')}
                  />
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Marketing Emails</span>
                    <span className="toggle-desc">Send promotional emails to users</span>
                  </div>
                  <Toggle
                    checked={settings.notifications.marketingEmails}
                    onChange={() => handleToggle('notifications', 'marketingEmails')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <div className="settings-form">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Two-Factor Authentication</span>
                    <span className="toggle-desc">Require 2FA for all admin accounts</span>
                  </div>
                  <Toggle
                    checked={settings.security.twoFactorAuth}
                    onChange={() => handleToggle('security', 'twoFactorAuth')}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Max Login Attempts</label>
                    <input
                      type="number"
                      value={settings.security.loginAttempts}
                      onChange={(e) => handleChange('security', 'loginAttempts', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleChange('security', 'sessionTimeout', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Minimum Password Length</label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleChange('security', 'passwordMinLength', Number(e.target.value))}
                  />
                </div>
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <span className="toggle-label">Require Email Verification</span>
                    <span className="toggle-desc">Users must verify email before accessing platform</span>
                  </div>
                  <Toggle
                    checked={settings.security.requireEmailVerification}
                    onChange={() => handleToggle('security', 'requireEmailVerification')}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
