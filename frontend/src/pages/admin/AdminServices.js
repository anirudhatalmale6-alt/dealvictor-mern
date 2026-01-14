import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiSearch, FiFilter, FiCheck, FiX, FiEye, FiTrash2,
  FiAlertCircle, FiLoader, FiExternalLink
} from 'react-icons/fi';
import './AdminPages.css';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('pending');
  const [selectedService, setSelectedService] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20,
        search: searchTerm,
        status: statusFilter,
        approvalStatus: approvalFilter
      };
      const res = await adminAPI.getServices(params);
      setServices(res.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.pagination?.total || 0,
        pages: res.data.pagination?.pages || 0
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, searchTerm, statusFilter, approvalFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleApprove = async (serviceId) => {
    try {
      await adminAPI.approveService(serviceId);
      toast.success('Service approved successfully');
      fetchServices();
    } catch (error) {
      console.error('Error approving service:', error);
      toast.error('Failed to approve service');
    }
  };

  const handleReject = async () => {
    if (!selectedService || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await adminAPI.rejectService(selectedService._id, { reason: rejectReason });
      toast.success('Service rejected');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedService(null);
      fetchServices();
    } catch (error) {
      console.error('Error rejecting service:', error);
      toast.error('Failed to reject service');
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'badge-warning',
      active: 'badge-success',
      paused: 'badge-info',
      rejected: 'badge-danger',
      draft: 'badge-secondary'
    };
    return classes[status] || 'badge-secondary';
  };

  const getApprovalBadgeClass = (status) => {
    const classes = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger'
    };
    return classes[status] || 'badge-secondary';
  };

  return (
    <div className="admin-services">
      <div className="admin-header">
        <div className="header-left">
          <h2>Manage Services</h2>
          <p>Review and approve services submitted by freelancers</p>
        </div>
        <div className="header-stats">
          <div className="stat-card pending">
            <span className="stat-value">
              {services.filter(s => s.approvalStatus === 'pending').length}
            </span>
            <span className="stat-label">Pending Review</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
          >
            <option value="">All Approval Status</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="loading-state">
          <FiLoader className="spinner" />
          <p>Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <FiAlertCircle className="empty-icon" />
          <h3>No services found</h3>
          <p>No services match your current filters</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Freelancer</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id}>
                  <td>
                    <div className="service-cell">
                      <div className="service-image">
                        {service.images?.[0]?.url ? (
                          <img src={service.images[0].url} alt={service.title} />
                        ) : (
                          <span>{service.title?.charAt(0) || 'S'}</span>
                        )}
                      </div>
                      <div className="service-info">
                        <span className="service-title">{service.title}</span>
                        <span className="service-desc">
                          {service.description?.substring(0, 50)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <span className="user-name">
                        {service.freelancer?.firstName} {service.freelancer?.lastName}
                      </span>
                      <span className="user-email">{service.freelancer?.email}</span>
                    </div>
                  </td>
                  <td>{service.category?.name || 'Uncategorized'}</td>
                  <td>${service.startingPrice || service.packages?.[0]?.price || 0}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(service.status)}`}>
                      {service.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getApprovalBadgeClass(service.approvalStatus)}`}>
                      {service.approvalStatus}
                    </span>
                  </td>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <a
                        href={`/service/${service._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn view"
                        title="View Service"
                      >
                        <FiExternalLink />
                      </a>
                      {service.approvalStatus === 'pending' && (
                        <>
                          <button
                            className="action-btn approve"
                            title="Approve"
                            onClick={() => handleApprove(service._id)}
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="action-btn reject"
                            title="Reject"
                            onClick={() => {
                              setSelectedService(service);
                              setShowRejectModal(true);
                            }}
                          >
                            <FiX />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.pages}</span>
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Reject Service</h3>
              <button className="close-btn" onClick={() => setShowRejectModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>
                You are rejecting: <strong>{selectedService?.title}</strong>
              </p>
              <div className="form-group">
                <label>Rejection Reason (required)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                Reject Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
