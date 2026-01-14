import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiSearch, FiCheck, FiX, FiExternalLink, FiAlertCircle, FiLoader
} from 'react-icons/fi';
import './AdminPages.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('pending');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20,
        search: searchTerm,
        status: statusFilter,
        approvalStatus: approvalFilter
      };
      const res = await adminAPI.getProjects(params);
      setProjects(res.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.pagination?.total || 0,
        pages: res.data.pagination?.pages || 0
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, searchTerm, statusFilter, approvalFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleApprove = async (projectId) => {
    try {
      await adminAPI.approveProject(projectId);
      toast.success('Project approved successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error approving project:', error);
      toast.error('Failed to approve project');
    }
  };

  const handleReject = async () => {
    if (!selectedProject || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await adminAPI.rejectProject(selectedProject._id, { reason: rejectReason });
      toast.success('Project rejected');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast.error('Failed to reject project');
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'badge-warning',
      open: 'badge-success',
      in_progress: 'badge-info',
      completed: 'badge-primary',
      cancelled: 'badge-secondary',
      rejected: 'badge-danger'
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

  const formatBudget = (budget) => {
    if (!budget) return 'N/A';
    const { min, max, type } = budget;
    const suffix = type === 'hourly' ? '/hr' : '';
    if (min && max) return `$${min} - $${max}${suffix}`;
    if (min) return `From $${min}${suffix}`;
    if (max) return `Up to $${max}${suffix}`;
    return 'N/A';
  };

  return (
    <div className="admin-projects">
      <div className="admin-header">
        <div className="header-left">
          <h2>Manage Projects</h2>
          <p>Review and approve projects submitted by clients</p>
        </div>
        <div className="header-stats">
          <div className="stat-card pending">
            <span className="stat-value">
              {projects.filter(p => p.approvalStatus === 'pending').length}
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
            placeholder="Search projects..."
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="loading-state">
          <FiLoader className="spinner" />
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <FiAlertCircle className="empty-icon" />
          <h3>No projects found</h3>
          <p>No projects match your current filters</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Bids</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id}>
                  <td>
                    <div className="project-cell">
                      <span className="project-title">{project.title}</span>
                      <span className="project-desc">
                        {project.description?.substring(0, 50)}...
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <span className="user-name">
                        {project.buyer?.firstName} {project.buyer?.lastName}
                      </span>
                      <span className="user-email">{project.buyer?.email}</span>
                    </div>
                  </td>
                  <td>{project.category?.name || 'Uncategorized'}</td>
                  <td>{formatBudget(project.budget)}</td>
                  <td>{project.totalBids || 0}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                      {project.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getApprovalBadgeClass(project.approvalStatus)}`}>
                      {project.approvalStatus}
                    </span>
                  </td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <a
                        href={`/project/${project._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn view"
                        title="View Project"
                      >
                        <FiExternalLink />
                      </a>
                      {project.approvalStatus === 'pending' && (
                        <>
                          <button
                            className="action-btn approve"
                            title="Approve"
                            onClick={() => handleApprove(project._id)}
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="action-btn reject"
                            title="Reject"
                            onClick={() => {
                              setSelectedProject(project);
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
              <h3>Reject Project</h3>
              <button className="close-btn" onClick={() => setShowRejectModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>
                You are rejecting: <strong>{selectedProject?.title}</strong>
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
                Reject Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
