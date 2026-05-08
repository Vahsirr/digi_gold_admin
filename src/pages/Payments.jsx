import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  XOctagon, 
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  History
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchPayments, refundPayment } from '../api';
import './Users.css'; // Global table styling

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // all, failures, refunds
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await fetchPayments();
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Are you sure you want to issue a refund for this transaction?')) return;
    try {
      setProcessingId(id);
      const response = await refundPayment(id);
      if (response.data.success) {
        alert('Refund processed successfully!');
        loadPayments();
      }
    } catch (error) {
       alert('Refund operation failed.');
    } finally {
       setProcessingId(null);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.razorpayOrderId?.includes(searchTerm) || 
                         p.receipt?.includes(searchTerm);
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'failures') return matchesSearch && p.status === 'failed';
    if (activeTab === 'refunds') return matchesSearch && p.status === 'refunded';
    return matchesSearch;
  });

  return (
    <div className="users-page">
      <div className="tab-switcher" style={{display:'flex', gap: '1rem', marginBottom: '2rem'}}>
        <button 
          className={activeTab === 'all' ? 'primary-btn' : 'secondary-btn'}
          onClick={() => setActiveTab('all')}
        >
          <History size={18} /> Global Logs
        </button>
        <button 
          className={activeTab === 'failures' ? 'primary-btn' : 'secondary-btn'}
          onClick={() => setActiveTab('failures')}
        >
          <XOctagon size={18} /> Failed Transactions
        </button>
        <button 
          className={activeTab === 'refunds' ? 'primary-btn' : 'secondary-btn'}
          onClick={() => setActiveTab('refunds')}
        >
          <RotateCcw size={18} /> Refunds
        </button>
      </div>

      <div className="page-header">
        <div className="search-box">
          <Search size={20} color="var(--text-light)" />
          <input 
            type="text" 
            placeholder="Search by name, Order ID, or Receipt..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <button className="secondary-btn" onClick={loadPayments}>
            <RefreshCw size={18} /> Sync Gateway
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Invoice / ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p, idx) => (
              <motion.tr 
                key={p.id || p._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <span style={{fontWeight: 850, fontSize: '0.9rem'}}>#{p.receipt || p.razorpayOrderId?.substring(0,8) || 'N/A'}</span>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 2}}>{(p.id || p._id || '').toString().substring(0,12)}...</span>
                  </div>
                </td>
                <td>
                  <div className="client-details">
                    <span className="client-name" style={{fontSize: '0.9rem'}}>{p.user?.fullName || 'Anonymous'}</span>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-light)'}}>{p.user?.mobile}</span>
                  </div>
                </td>
                <td>
                  <span style={{fontWeight: 900, color: '#10B981'}}>₹{parseFloat(p.amount).toLocaleString('en-IN')}</span>
                </td>
                <td>
                   <div style={{display:'flex', alignItems:'center', gap: 6, fontSize: '0.8rem', fontWeight: 650}}>
                      <TrendingUp size={14} color="#6366f1" />
                      {p.paymentType}
                   </div>
                </td>
                <td>
                   <span className={`status-badge ${p.status}`}>
                      {p.status?.toUpperCase()}
                   </span>
                </td>
                <td>
                  <div className="date-joined">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    {p.status === 'completed' && (
                       <button 
                         className="icon-btn-sm" 
                         title="Refund"
                         onClick={() => handleRefund(p.id)}
                         disabled={processingId === p.id}
                        >
                         <RotateCcw size={16} />
                       </button>
                    )}
                    <button className="icon-btn-sm"><ArrowRight size={16} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && !loading && (
          <div className="empty-state">
            <CreditCard size={48} color="var(--text-light)" />
            <h3>No payment logs found</h3>
            <p>Sync with the payment gateway to fetch recent financial activity.</p>
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

export default PaymentsPage;
