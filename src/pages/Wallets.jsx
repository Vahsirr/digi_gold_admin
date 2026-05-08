import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Wallet, 
  ArrowRight, 
  RefreshCw,
  Coins,
  History,
  TrendingDown,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchUsers } from '../api';
import './Users.css'; // Global table styling

const WalletsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers();
      if (response.data.success) {
        // Filter out admins if you only want clients, or keep all
        setUsers(response.data.data.filter(u => u.role === 'client'));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.mobile?.includes(searchTerm)
  );

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="search-box">
          <Search size={20} color="var(--text-light)" />
          <input 
            type="text" 
            placeholder="Search clients by name or mobile..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <button className="secondary-btn" onClick={loadUsers}>
            {loading ? <RefreshCw size={18} className="spinning" /> : <RefreshCw size={18} />} Refresh Balances
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Client Profile</th>
              <th>Gold Balance (g)</th>
              <th>Silver Balance (g)</th>
              <th>Total Valuation (₹)</th>
              <th>Current Plan</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => {
              // Mocking a valuation based on current hypothetical rates 
              // (e.g., Gold: ~$6500/g, Silver: ~$75/g)
              const goldVal = parseFloat(user.goldBalance || 0) * 6500;
              const silverVal = parseFloat(user.silverBalance || 0) * 75;
              const totalVal = goldVal + silverVal;

              return (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td>
                  <div className="client-info">
                    <div className="client-avatar">
                      {user.fullName?.charAt(0) || 'C'}
                    </div>
                    <div className="client-contacts">
                      <span className="client-name">{user.fullName}</span>
                      <span>{user.mobile}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap: 6, fontWeight: 800, color: '#D4AF37'}}>
                    <Coins size={16} />
                    {parseFloat(user.goldBalance || 0).toFixed(4)} g
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap: 6, fontWeight: 750, color: '#94a3b8'}}>
                    <Coins size={16} />
                    {parseFloat(user.silverBalance || 0).toFixed(4)} g
                  </div>
                </td>
                <td>
                  <span style={{fontWeight: 850, color: 'var(--text-main)', fontSize: '1.05rem'}}>
                    ₹{totalVal.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                  </span>
                </td>
                <td>
                  {user.investmentPlan ? (
                    <span className="scheme-badge">
                      <Award size={14} /> {user.investmentPlan.replace('-', ' ').toUpperCase()}
                    </span>
                  ) : (
                    <span style={{fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600}}>No Active Plan</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn-sm" title="View Ledger History">
                      <History size={16} />
                    </button>
                    <button className="icon-btn-sm" title="Manage Funds">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            )})}
          </tbody>
        </table>

        {filteredUsers.length === 0 && !loading && (
          <div className="empty-state">
            <Wallet size={48} color="var(--text-light)" />
            <h3>No wallets found</h3>
            <p>User wallets will appear here once they register.</p>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <RefreshCw size={32} className="spinning" color="var(--primary)" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletsPage;
