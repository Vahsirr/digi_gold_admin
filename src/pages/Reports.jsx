import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Calendar,
  Layers,
  FileText,
  RefreshCw,
  Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { fetchDashboardStats, fetchTransactions } from '../api';
import './Dashboard.css'; // Reusing premium dashboard styles

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, txRes] = await Promise.all([
        fetchDashboardStats(Date.now()),
        fetchTransactions(Date.now())
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (txRes.data.success) setTransactions(txRes.data.data);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = useMemo(() => {
    // Generate 7 days structure
    const dataMap = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      dataMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})] = 0;
    }

    if (transactions && transactions.length > 0) {
        transactions.forEach(tx => {
           const dateStr = new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric'});
           if (dataMap[dateStr] !== undefined && tx.transactionType === 'purchase') {
               dataMap[dateStr] += parseFloat(tx.amount || 0);
           }
        });
    }

    return Object.keys(dataMap).map(key => ({ date: key, revenue: dataMap[key] }));
  }, [transactions]);

  const assetDistribution = useMemo(() => {
     let gold = 0, silver = 0;
     if (stats?.inventory) {
        gold = parseFloat(stats.inventory.gold || 0);
        silver = parseFloat(stats.inventory.silver || 0);
     }
     
     // Required to provide at least a structural array so the PieChart doesn't crash on null
     if (gold === 0 && silver === 0) {
        return [
           { name: 'Empty Inventory', value: 1, color: '#f1f5f9' }
        ];
     }
     
     return [
        { name: 'Gold (g)', value: gold, color: '#D4AF37' },
        { name: 'Silver (g)', value: silver, color: '#94A3B8' }
     ];
  }, [stats]);

  return (
    <div className="dv2-container" style={{paddingTop: 0}}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dv2-header"
        style={{marginBottom: '2rem'}}
      >
        <div className="dv2-title-section">
          <h1 className="dv2-title">Reports & Analytics</h1>
          <p className="dv2-subtitle">Financial insights, system audits, and downloadable ledgers.</p>
        </div>
        <div className="dv2-actions">
          <button className="dv2-btn-secondary" onClick={loadData}>
            {loading ? <RefreshCw size={18} className="spinning" /> : <Activity size={18} />} Update View
          </button>
        </div>
      </motion.div>

      <div className="dv2-grid">
        {/* Revenue Growth Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="dv2-card dv2-col-span-2 dv2-row-span-2"
        >
          <div className="dv2-card-header">
             <div className="dv2-card-title"><TrendingUp size={20} color="#10B981" /> Revenue Growth (7 Days)</div>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dx={-10} tickFormatter={(val) => `₹${(val/1000).toFixed(1)}k`}/>
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                  formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Asset Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="dv2-card"
        >
          <div className="dv2-card-header">
             <div className="dv2-card-title"><PieChartIcon size={20} color="#D4AF37" /> Digital Inventory</div>
          </div>
          <div style={{ width: '100%', height: 200 }}>
             <ResponsiveContainer>
               <PieChart>
                  <Pie
                    data={assetDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${parseFloat(value).toFixed(2)}`, name]} />
                  <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Report Download Hub */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="dv2-card"
        >
          <div className="dv2-card-header" style={{marginBottom: '1rem'}}>
             <div className="dv2-card-title"><Download size={20} color="#3B82F6" /> Export Center</div>
          </div>
          <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5}}>Download system-generated formal audits and ledger reports for compliance purposes.</p>
          
          <div style={{display:'flex', flexDirection:'column', gap: '0.75rem'}}>
             <a href="https://digigold-production-804b.up.railway.app/api/admin/reports/pdf/ledger" target="_blank" rel="noreferrer" className="dv2-btn-secondary" style={{justifyContent: 'center', textDecoration: 'none'}}>
                <FileText size={16} /> Download Master Ledger (PDF)
             </a>
             <a href="https://digigold-production-804b.up.railway.app/api/admin/reports/compliance" target="_blank" rel="noreferrer" className="dv2-btn-secondary" style={{justifyContent: 'center', textDecoration: 'none'}}>
                <Layers size={16} /> Financial Compliance (HTML)
             </a>
             <a href="https://digigold-production-804b.up.railway.app/api/admin/reports/pdf/summary" target="_blank" rel="noreferrer" className="dv2-btn-secondary" style={{justifyContent: 'center', textDecoration: 'none'}}>
                <BarChart3 size={16} /> Operations Summary (PDF)
             </a>
          </div>
        </motion.div>

        {/* System Summary Quick Look */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="dv2-card dv2-col-span-2"
        >
          <div className="dv2-card-header" style={{marginBottom: '1rem'}}>
             <div className="dv2-card-title"><Activity size={20} color="#1E293B" /> Performance Indicators</div>
          </div>
          <div style={{display:'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem'}}>
             <div style={{flex: 1, background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                <h4 style={{margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1}}>Total Client Revenue</h4>
                <p style={{margin: 0, fontSize: '2rem', fontWeight: 850, color: '#1E293B'}}>₹{parseFloat(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
             </div>
             <div style={{flex: 1, background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                <h4 style={{margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1}}>Total Active Plans</h4>
                <p style={{margin: 0, fontSize: '2rem', fontWeight: 850, color: '#1E293B'}}>
                  {(stats?.activePlans?.gold || 0) + (stats?.activePlans?.silver || 0)}
                </p>
             </div>
             <div style={{flex: 1, background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                <h4 style={{margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#10B981', textTransform: 'uppercase', letterSpacing: 1}}>System Status</h4>
                <p style={{margin: 0, fontSize: '2rem', fontWeight: 850, color: '#10B981'}}>Healthy</p>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ReportsPage;
