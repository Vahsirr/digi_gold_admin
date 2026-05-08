import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Share2,
  Copy,
  Mail,
  Phone,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchUsers } from '../api';
import './Referrals.css';

const ReferralsPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    loadData();
  }, []);

  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersRes = await fetchUsers();
      if (usersRes.data.success) {
        setAllUsers(usersRes.data.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Could not connect to the server. Please check if the backend is live.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Use referralCount directly from user object (it's already included in fetchUsers)
  const usersWithReferrals = allUsers.map(user => ({
    ...user,
    referralCount: user.referralCount || 0,
    referralCode: user.referralCode || 'N/A'
  })).sort((a, b) => b.referralCount - a.referralCount); // Sort by referral count

  const filteredUsers = usersWithReferrals.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReferrals = usersWithReferrals.reduce((sum, user) => sum + (user.referralCount || 0), 0);
  const usersWithReferralsCount = usersWithReferrals.filter(u => u.referralCount > 0).length;

  return (
    <div className="referrals-page">
      {/* Stats Cards */}
      <div className="referral-stats-grid">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card"
        >
          <div className="stat-icon purple">
            <Users size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{allUsers.length}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="stat-icon green">
            <Share2 size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Referrers</span>
            <span className="stat-value">{usersWithReferralsCount}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="stat-icon blue">
            <TrendingUp size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Referrals</span>
            <span className="stat-value">{totalReferrals}</span>
          </div>
        </motion.div>
      </div>

      {/* Search and Actions */}
      <div className="page-header">
        <div className="search-box">
          <Search size={20} color="var(--text-light)" />
          <input
            type="text"
            placeholder="Search by name, phone, email or referral code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            Cards View
          </button>
        </div>
        <button className="secondary-btn" onClick={loadData}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadReferrals}>Retry</button>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="referral-table-container">
          <table className="referral-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Referral Code</th>
                <th>Referral Count</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <td>
                    <div className="rank-badge">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </div>
                  </td>
                  <td>
                    <div className="client-info">
                      <div className="client-avatar">
                        {user.fullName?.charAt(0) || user.mobile?.charAt(0)}
                      </div>
                      <div className="client-details">
                        <span className="client-name">{user.fullName || 'Unnamed User'}</span>
                        <div className="client-contacts">
                          <span><Phone size={12} /> {user.mobile}</span>
                          {user.email && <span><Mail size={12} /> {user.email}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-code-box">
                      <span className="table-code">{user.referralCode}</span>
                      <button 
                        className="table-copy-btn"
                        onClick={() => handleCopyCode(user.referralCode)}
                      >
                        {copiedCode === user.referralCode ? '✓' : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="table-count-badge">
                      <Users size={16} />
                      <span>{user.referralCount || 0}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-date">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="referral-cards-grid">
          {filteredUsers.map((user, idx) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="referral-card"
            >
              <div className="card-rank">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
              </div>
              
              <div className="referral-card-header">
                <div className="user-avatar">
                  {user.fullName?.charAt(0) || user.mobile?.charAt(0)}
                </div>
                <div className="user-info">
                  <h3>{user.fullName || 'Unnamed User'}</h3>
                  <div className="user-contacts">
                    <span><Phone size={12} /> {user.mobile}</span>
                    {user.email && <span><Mail size={12} /> {user.email}</span>}
                  </div>
                </div>
              </div>

              <div className="referral-code-section">
                <label>Referral Code</label>
                <div className="code-box">
                  <span className="code">{user.referralCode}</span>
                  <button 
                    className="copy-btn" 
                    onClick={() => handleCopyCode(user.referralCode)}
                    title="Copy Code"
                  >
                    {copiedCode === user.referralCode ? (
                      <span className="copied-text">✓ Copied</span>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="referral-count-section">
                <div className="count-badge">
                  <Users size={20} />
                  <span>{user.referralCount || 0}</span>
                </div>
                <span className="count-label">
                  {(user.referralCount || 0) === 1 ? 'referral' : 'referrals'}
                </span>
              </div>

              <div className="card-footer">
                <Calendar size={14} />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <div className="empty-state">
          <Share2 size={64} color="var(--text-light)" />
          <h3>No users found</h3>
          <p>Users will appear here once they register and start referring others.</p>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <RefreshCw size={32} className="spinning" color="var(--primary)" />
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
