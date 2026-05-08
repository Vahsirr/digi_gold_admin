import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  TrendingUp,
  CreditCard,
  PlusCircle,
  Clock,
  Users,
  Trash,
  Eye,
  Edit,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchUsers, updateUser, deleteUser } from '../api';
import './Users.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    investmentPlan: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUsers();
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Could not connect to the server to fetch user data. Please check if the backend is live.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      mobile: user.mobile || '',
      investmentPlan: user.investmentPlan || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(deletingUser._id);
      setShowDeleteModal(false);
      setDeletingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser._id, editFormData);
      alert('User updated successfully!');
      setShowEditModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="search-box">
          <Search size={20} color="var(--text-light)" />
          <input
            type="text"
            placeholder="Search clients by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          {/* <button className="secondary-btn">
            <Filter size={18} />
            Filters
          </button> */}
          {/* <button className="primary-btn">
            <PlusCircle size={18} />
            Add User
          </button> */}
        </div>
      </div>

      {error && (
        <div style={{
          background: '#FEF2F2',
          color: '#EF4444',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid #FEE2E2',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
        >
          <ShieldAlert size={20} />
          {error}
          <button
            onClick={loadUsers}
            style={{
              marginLeft: 'auto',
              background: '#EF4444',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Client Information</th>
              <th>Asset Balance</th>
              <th>Investment Scheme</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td>
                  <div className="client-info">
                    <div className="client-avatar">
                      {user.fullName?.charAt(0) || user.mobile?.charAt(0)}
                    </div>
                    <div className="client-details">
                      <span className="client-name">{user.fullName || 'Unnamed User'}</span>
                      <div className="client-contacts">
                        <span title="Mobile"><Phone size={12} /> {user.mobile}</span>
                        {user.email && <span title="Email"><Mail size={12} /> {user.email}</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="asset-balance">
                    <div className="gold">
                      <TrendingUp size={14} color="var(--accent)" />
                      <span>{parseFloat(user.goldBalance || 0).toFixed(4)}g</span>
                    </div>
                    <div className="silver">
                      <TrendingUp size={14} color="#94a3b8" />
                      <span>{parseFloat(user.silverBalance || 0).toFixed(2)}g</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="scheme-badge">
                    <CreditCard size={14} />
                    {user.investmentPlan ? (
                      user.investmentPlan.toLowerCase() === 'plan-a' ? 'Gold Savings Scheme' :
                        user.investmentPlan.toLowerCase() === 'plan-b' ? 'Direct Investment Plan' :
                          user.investmentPlan.toLowerCase() === 'plan-c' ? 'Digital Gold Account' :
                            user.investmentPlan.toUpperCase()
                    ) : 'NONE'}
                  </div>
                </td>
                <td>
                  <div className="date-joined">
                    <Calendar size={14} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn-sm" title="Delete" onClick={() => handleDeleteUser(user)}>
                      <Trash size={16} color="#EF4444" />
                    </button>
                    <button className="icon-btn-sm" title="View Details" onClick={() => handleViewUser(user)}>
                      <Eye size={16} color="#3B82F6" />
                    </button>
                    <button className="icon-btn-sm" title="Edit" onClick={() => handleEditUser(user)}>
                      <Edit size={16} color="#10B981" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && !loading && (
          <div className="empty-state">
            <Users size={48} color="var(--text-light)" />
            <h3>No users found</h3>
            <p>We couldn't find any users matching your criteria.</p>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <RefreshCw size={32} className="spinning" color="var(--primary)" />
          </div>
        )}
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-detail-grid">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-item">
                    <label>Full Name</label>
                    <span>{selectedUser.fullName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{selectedUser.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mobile</label>
                    <span>{selectedUser.mobile || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role</label>
                    <span className="badge">{selectedUser.role?.toUpperCase() || 'CLIENT'}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Investment Details</h3>
                  <div className="detail-item">
                    <label>Investment Plan</label>
                    <span>{selectedUser.investmentPlan ? selectedUser.investmentPlan.toUpperCase() : 'NONE'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Gold Balance</label>
                    <span className="gold-text">{parseFloat(selectedUser.goldBalance || 0).toFixed(4)}g</span>
                  </div>
                  <div className="detail-item">
                    <label>Silver Balance</label>
                    <span className="silver-text">{parseFloat(selectedUser.silverBalance || 0).toFixed(2)}g</span>
                  </div>
                  <div className="detail-item">
                    <label>Portfolio Value</label>
                    <span>₹{parseFloat(selectedUser.portfolioValue || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Referral Information</h3>
                  <div className="detail-item">
                    <label>Referral Code</label>
                    <span className="code-badge">{selectedUser.referralCode || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Referral Count</label>
                    <span>{selectedUser.referralCount || 0} users</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Account Status</h3>
                  <div className="detail-item">
                    <label>KYC Status</label>
                    <span className={`status-badge ${selectedUser.kycStatus}`}>
                      {selectedUser.kycStatus?.toUpperCase() || 'NOT SUBMITTED'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Account Status</label>
                    <span className={`status-badge ${selectedUser.isActive ? 'active' : 'inactive'}`}>
                      {selectedUser.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Joined Date</label>
                    <span>{new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Login</label>
                    <span>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('en-IN') : 'Never'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setShowViewModal(false)}>Close</button>
              <button className="primary-btn" onClick={() => { setShowViewModal(false); handleEditUser(selectedUser); }}>
                Edit User
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile</label>
                    <input
                      type="text"
                      value={editFormData.mobile}
                      onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Investment Plan</label>
                    <select
                      value={editFormData.investmentPlan}
                      onChange={(e) => setEditFormData({ ...editFormData, investmentPlan: e.target.value })}
                    >
                      <option value="">Select Plan</option>
                      <option value="plan-a">Plan A - Gold Savings</option>
                      <option value="plan-b">Plan B - Direct Investment</option>
                      <option value="plan-c">Plan C - Digital Gold</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingUser && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <div className="icon-circle">
                <Trash size={48} color="#EF4444" />
              </div>
            </div>
            <div className="delete-modal-body">
              <h2>Delete User Account</h2>
              <p className="delete-warning">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="user-preview">
                <div className="preview-avatar">
                  {deletingUser.fullName?.charAt(0) || deletingUser.mobile?.charAt(0)}
                </div>
                <div className="preview-info">
                  <span className="preview-name">{deletingUser.fullName || 'Unnamed User'}</span>
                  <span className="preview-contact">{deletingUser.mobile}</span>
                </div>
              </div>
              <div className="delete-consequences">
                <p><strong>This will permanently remove:</strong></p>
                <ul>
                  <li>User account and login access</li>
                  <li>Personal information and contact details</li>
                  <li>Investment records and portfolio data</li>
                  <li>All associated transaction history</li>
                </ul>
              </div>
            </div>
            <div className="delete-modal-footer">
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn" 
                onClick={confirmDeleteUser}
              >
                <Trash size={18} />
                Yes, Delete User
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
