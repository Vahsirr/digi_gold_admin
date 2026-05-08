import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, TrendingUp, Wallet, ArrowUpRight, 
  Crown, Plus, CheckCircle2, Clock, Zap, Activity, Globe,
  ArrowRight, Coins, ShieldAlert
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDashboardStats, fetchReminders, notifyUser, fetchTransactions } from '../api';
import './Dashboard.css';

const StatCard = ({ title, value, unit, change, delay, isGreen }) => (
  <motion.div 
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="dv2-stat-card"
  >
    <div className="dv2-stat-header">
      <h3 className="dv2-stat-title">{title}</h3>
      <ArrowUpRight size={18} color="#94a3b8" />
    </div>
    <div className="dv2-stat-body">
      <h2>{unit}{value}</h2>
      <div className="dv2-stat-footer">
        <span className="dv2-badge">
          +{change}%
        </span>
        <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Last 30 Days</span>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nudgeLoading, setNudgeLoading] = useState(null);

  const chartData = useMemo(() => {
    const shortDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const weekData = shortDays.map(d => ({ name: d, purchase: 0, sale: 0 }));

    if (!transactions || transactions.length === 0) {
       return weekData;
    }

    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    transactions.forEach(tx => {
      const date = new Date(tx.createdAt);
      if (date >= lastWeek) {
        const dayIndex = date.getDay();
        if (tx.transactionType === 'purchase') {
          weekData[dayIndex].purchase += parseFloat(tx.goldWeight || tx.silverWeight || 0);
        } else if (tx.transactionType === 'sale' || tx.transactionType === 'redemption') {
          weekData[dayIndex].sale += parseFloat(tx.goldWeight || tx.silverWeight || 0);
        }
      }
    });
    
    return weekData;
  }, [transactions]);

  useEffect(() => {
    loadAllData();
  }, []);

  const [error, setError] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = Date.now();
      const [statsRes, remRes, txRes] = await Promise.allSettled([
        fetchDashboardStats(timestamp).catch(err => {
            console.error('Stats fetch failed:', err);
            throw err;
        }),
        fetchReminders(timestamp).catch(err => {
            console.error('Reminders fetch failed:', err);
            throw err;
        }),
        fetchTransactions(timestamp).catch(err => {
            console.error('Transactions fetch failed:', err);
            throw err;
        })
      ]);

      let loadFailed = false;

      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.data);
      } else if (statsRes.status === 'rejected') {
        loadFailed = true;
      }

      if (remRes.status === 'fulfilled' && remRes.value.data.success) {
        setReminders(remRes.value.data.data);
      }
      if (txRes.status === 'fulfilled' && txRes.value.data.success) {
        setTransactions(txRes.value.data.data);
      }

      if (loadFailed) {
        setError('Backend is currently unreachable. Please check your connection or server status.');
      }
    } catch (error) {
      console.error('Logic error:', error);
      setError('Unexpected application error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleNudge = async (userId) => {
    try {
      setNudgeLoading(userId);
      await notifyUser(userId);
      alert('Official Nudge Sequence Triggered ✅');
    } catch (error) {
      alert('Communication Link Failed ❌');
    } finally {
      setNudgeLoading(null);
    }
  };

  return (
    <div className="dv2-container">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dv2-header"
      >
        <div className="dv2-title-section">
          <h1 className="dv2-title">Admin Dashboard</h1>
          <p className="dv2-subtitle">Srivishva jewellers • Digital Asset Control Center</p>
        </div>
        <div className="dv2-actions">
          <button className="dv2-btn-secondary" onClick={loadAllData}>
            {loading ? <Zap size={18} className="spinning" /> : <Activity size={18} />} Refresh Data
          </button>
          <button className="dv2-btn-primary" onClick={() => navigate('/users')}>
            <Plus size={18} /> New Ledger
          </button>
        </div>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: '#FEF2F2', 
            color: '#EF4444', 
            padding: '1.2rem', 
            borderRadius: '16px', 
            marginBottom: '2rem', 
            border: '1px solid #FEE2E2',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)'
          }}
        >
          <ShieldAlert size={20} />
          <div style={{flex: 1}}>
            <div style={{fontSize: '15px'}}>Connection Error</div>
            <div style={{fontSize: '13px', opacity: 0.8, fontWeight: 600}}>{error}</div>
          </div>
          <button 
            onClick={loadAllData} 
            style={{ 
                background: '#EF4444', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '10px', 
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '13px'
            }}
          >
            Retry Connection
          </button>
        </motion.div>
      )}

      <div className="dv2-grid">
        <StatCard 
          title="Total Clients" 
          value={stats?.totalUsers || '0'} 
          unit="" change={0} delay={0.1} 
        />
        <StatCard 
          title="Vault Holding (g)" 
          value={stats?.inventory?.gold || '0.000'} 
          unit="" change={0} delay={0.2} 
        />
        <StatCard 
          title="Total Revenue" 
          value={Number(stats?.totalRevenue || 0).toLocaleString('en-IN')} 
          unit="₹" change={0} delay={0.3} 
        />
        
        {/* Market Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="dv2-card dv2-col-span-2"
        >
          <div className="dv2-card-header">
            <div className="dv2-card-title"><Globe size={20} color="#D4AF37" /> Market Dynamics (grams)</div>
            <div className="dv2-flex-row" style={{gap: '16px'}}>
              <div className="dv2-flex-row" style={{gap: '6px'}}>
                 <div style={{width: 8, height: 8, borderRadius: '50%', background: '#D4AF37'}} />
                 <span style={{fontSize: 12, fontWeight: 700, color: '#64748b'}}>Incoming</span>
              </div>
              <div className="dv2-flex-row" style={{gap: '6px'}}>
                 <div style={{width: 8, height: 8, borderRadius: '50%', background: '#E2E8F0'}} />
                 <span style={{fontSize: 12, fontWeight: 700, color: '#64748b'}}>Outgoing</span>
              </div>
            </div>
          </div>
          <div className="dv2-chart-container">
            <ResponsiveContainer>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 750}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="purchase" name="Incoming" fill="#D4AF37" radius={[8, 8, 8, 8]} />
                <Bar dataKey="sale" name="Outgoing" fill="#E2E8F0" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Actionable Compliance */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="dv2-card"
        >
          <div className="dv2-card-header" style={{marginBottom: '1rem'}}>
            <div className="dv2-card-title"><CheckCircle2 size={20} color="#10B981" /> System Status</div>
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'}}>
            <div style={{background: '#ECFDF5', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent:'center', margin: '0 auto 1.5rem'}}>
                <CheckCircle2 size={32} color="#10B981" />
            </div>
            <h2 className="dv2-alert-title" style={{color: '#10B981', marginTop: 0}}>Vault Secure</h2>
            <p className="dv2-alert-desc">All systems operational.</p>
            <button className="dv2-btn-secondary dv2-w-full" style={{borderColor: '#10B981', color: '#10B981'}} onClick={() => navigate('/reports')}>
              View Reports
            </button>
          </div>
        </motion.div>

        {/* Dynamic Ledger List */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="dv2-card dv2-row-span-2"
        >
          <div className="dv2-card-header">
            <div className="dv2-card-title"><Coins size={20} color="#D4AF37" /> Live Ledger</div>
            <button className="icon-btn-sm" onClick={() => navigate('/transactions')}><ArrowRight size={20} /></button>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 6}}>
            {transactions.length === 0 ? (
              <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '2rem'}}>No recent transactions.</p>
            ) : (
              <AnimatePresence>
                {transactions.slice(0, 6).map((tx, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.8 + (idx * 0.05) }}
                  className="dv2-pl-item" 
                  key={tx.id || idx}
                >
                  <div className="dv2-pl-details">
                    <div className="dv2-pl-row">
                      <h4 style={{fontSize: 15, fontWeight: 800, color: '#1e293b'}}>{tx.user?.fullName || 'Investor'}</h4>
                      <span style={{fontSize: 14, fontWeight: '850', color: '#D4AF37'}}>₹{parseFloat(tx.amount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="dv2-pl-row">
                       <span style={{fontSize: 12, color: '#94a3b8', fontWeight: 650}}>{tx.transactionType.toUpperCase()}</span>
                       <span style={{fontSize: 12, color: '#64748b', fontWeight: 750}}>{parseFloat(tx.goldWeight || tx.silverWeight || 0).toFixed(4)}g</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        </motion.div>

        {/* Delinquent Reminders */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="dv2-card dv2-col-span-2"
        >
          <div className="dv2-card-header">
            <div className="dv2-card-title"><ShieldAlert size={20} color="#EF4444" /> Payment Overdue</div>
            <button className="dv2-btn-secondary" style={{padding: '0.6rem 1.2rem', fontSize: 13}} onClick={() => navigate('/users')}>Inspect All</button>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 8}}>
            {reminders.length === 0 ? (
               <div style={{textAlign: 'center', padding: '1.5rem'}}>
                 <div style={{background: '#ECFDF5', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent:'center', margin: '0 auto 1rem'}}>
                    <CheckCircle2 size={24} color="#10B981" />
                 </div>
                 <p style={{fontWeight: 750, color: '#64748b', margin: 0}}>Financial compliance secured.</p>
               </div>
            ) : reminders.slice(0, 2).map((rem, idx) => (
              <div className="dv2-team-item" key={rem.id || idx}>
                <div className="dv2-flex-row">
                  <div className="dv2-avatar">{rem.user?.fullName?.charAt(0) || 'U'}</div>
                  <div>
                    <h4 style={{fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0}}>{rem.user?.fullName || 'Investor'}</h4>
                    <p style={{fontSize: 12, fontWeight: 650, color: '#64748b', margin: '4px 0 0'}}>Scheme {rem.planType.toUpperCase()} • Inst #{rem.installmentNumber}</p>
                  </div>
                </div>
                <div className="dv2-flex-row" style={{gap: '16px'}}>
                  <span className="dv2-status-pill" style={{background: '#FEF2F2', color: '#EF4444'}}>{rem.daysSinceReminder}D Late</span>
                  <button 
                    onClick={() => handleNudge(rem.userId)} 
                    className="dv2-btn-primary" 
                    style={{padding: '8px 16px', borderRadius: '12px', fontSize: 13}}
                    disabled={nudgeLoading === rem.userId}
                  >
                    {nudgeLoading === rem.userId ? '...' : <Zap size={14} />} Nudge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Capacity Tracking */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="dv2-card"
        >
          <div className="dv2-card-header" style={{marginBottom: 0}}>
             <div className="dv2-card-title"><Activity size={20} color="#10B981" /> System Sync</div>
          </div>
          <div className="dv2-progress-section">
             <div className="dv2-progress-circle">
                <h2 style={{fontSize: '3rem', fontWeight: 900}}>{loading ? '...' : (stats?.totalUsers || 0)}</h2>
                <p style={{fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5}}>Client Sync</p>
             </div>
          </div>
          <div style={{display:'flex', justifyContent: 'center', gap: 10, marginTop: '1rem'}}>
             <div className="dv2-flex-row" style={{gap: 6}}>
                <div style={{width: 8, height: 8, borderRadius: '50%', background: '#10B981'}} />
                <span style={{fontSize: 11, fontWeight: 800, color: '#64748b'}}>SYSTEM: HEALTHY</span>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
