import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  ShoppingBag,
  RefreshCw,
  TrendingDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchBookings, updateBookingStatus, fetchTransactions } from '../api';
import './Users.css'; // Global table styling
import './Dashboard.css'; // For unified dv2 buttons

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'redemptions'
  const [bookings, setBookings] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookRes, txRes] = await Promise.all([
        fetchBookings(),
        fetchTransactions()
      ]);

      if (bookRes.data.success) {
        setBookings(bookRes.data.data);
      }
      
      if (txRes.data.success) {
        const reds = txRes.data.data.filter(tx => 
          tx.transactionType === 'redemption' || tx.transactionType === 'sale'
        );
        setRedemptions(reds);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      alert(`Order status updated to ${newStatus}`);
      loadData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredData = activeTab === 'bookings' 
    ? bookings.filter(b => b.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || b.bookingNumber?.includes(searchTerm))
    : redemptions.filter(r => r.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.includes(searchTerm));

  return (
    <div className="users-page">
      <div className="tab-switcher" style={{display:'flex', gap: '1rem', marginBottom: '2rem'}}>
        <button 
          className={activeTab === 'bookings' ? 'dv2-btn-primary' : 'dv2-btn-secondary'}
          onClick={() => setActiveTab('bookings')}
        >
          <ShoppingBag size={18} /> Physical Bookings
        </button>
        <button 
          className={activeTab === 'redemptions' ? 'dv2-btn-primary' : 'dv2-btn-secondary'}
          onClick={() => setActiveTab('redemptions')}
        >
          <TrendingDown size={18} /> Asset Redemptions
        </button>
      </div>

      <div className="page-header">
        <div className="search-box">
          <Search size={20} color="var(--text-light)" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab === 'bookings' ? 'bookings' : 'redemptions'}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <button className="secondary-btn" onClick={loadData}>
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            {activeTab === 'bookings' ? (
              <tr>
                <th>Booking #</th>
                <th>Client</th>
                <th>Service/Product</th>
                <th>Preferred Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            ) : (
              <tr>
                <th>Ref ID</th>
                <th>Client</th>
                <th>Asset</th>
                <th>Weight</th>
                <th>Value</th>
                <th>Date</th>
              </tr>
            )}
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {activeTab === 'bookings' ? (
                  <>
                    <td style={{fontWeight: 800}}>{item.bookingNumber}</td>
                    <td>
                      <div className="client-details">
                        <span className="client-name" style={{fontSize: '0.9rem'}}>{item.client?.fullName}</span>
                        <span style={{fontSize: '0.75rem', color: 'var(--text-light)'}}>{item.client?.mobile}</span>
                      </div>
                    </td>
                    <td style={{fontWeight: 700, color: 'var(--primary)'}}>{item.service?.name || item.bookingType}</td>
                    <td>
                       <div className="date-joined">
                          <Clock size={14} />
                          {new Date(item.preferredDate).toLocaleDateString()}
                       </div>
                    </td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {item.status !== 'completed' && (
                          <button 
                            className="icon-btn-sm" 
                            title="Advance Status"
                            onClick={() => {
                              const next = item.status === 'pending' ? 'confirmed' : 'completed';
                              handleStatusUpdate(item.id, next);
                            }}
                          >
                            <Truck size={16} />
                          </button>
                        )}
                        <button className="icon-btn-sm" title="View Details"><ArrowRight size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-dim)'}}>#{item.id.substring(0,8)}...</td>
                    <td>
                      <div className="client-details">
                        <span className="client-name" style={{fontSize: '0.9rem'}}>{item.user?.fullName}</span>
                        <span style={{fontSize: '0.75rem', color: 'var(--text-light)'}}>{item.user?.mobile}</span>
                      </div>
                    </td>
                    <td>
                      <span className={item.metalType} style={{fontWeight: 800, textTransform: 'uppercase'}}>
                        {item.metalType}
                      </span>
                    </td>
                    <td style={{fontWeight: 700}}>{parseFloat(item.goldWeight || item.silverWeight || 0).toFixed(4)}g</td>
                    <td style={{fontWeight: 800, color: 'var(--text-main)'}}>₹{parseFloat(item.amount).toLocaleString('en-IN')}</td>
                    <td>
                      <div className="date-joined">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && !loading && (
          <div className="empty-state">
            <Package size={48} color="var(--text-light)" />
            <h3>No records found</h3>
            <p>Recent orders or redemptions will appear here after clients take action.</p>
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

export default OrdersPage;
