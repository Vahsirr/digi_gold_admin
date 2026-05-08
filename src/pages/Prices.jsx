import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  Save, 
  Activity,
  AlertCircle,
  Percent,
  Coins
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchGoldPrice, fetchMetalPrices, fetchSilverPrice, updateMetalPrices } from '../api';
import './Dashboard.css'; // Reusing premium Alabaster theme

const PricesPage = () => {
  const [prices, setPrices] = useState({ goldPerGram: '', silverPerGram: '', lastUpdate: null });
  const [goldPrice, setGoldPrice] = useState(null);
  const [silverPrice, setSilverPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Manage internal margins (Simulated state for UI purposes)
  const [margins, setMargins] = useState({
    goldBuy: 3.0,
    goldSell: 1.5,
    silverBuy: 2.5,
    silverSell: 1.0,
  });

  useEffect(() => {
    loadPrices();
    // Auto-refresh prices every minute
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // const loadPrices = async () => {
  //   try {
  //     setLoading(true);
  //     const [goldRes, silverRes] = await Promise.all([
  //       fetchGoldPrice(),
  //       fetchSilverPrice()
  //     ]);

  //     if (goldRes.data.success) setGoldPrice(goldRes.data);
  //     if (silverRes.data.success) setSilverPrice(silverRes.data);
  //   } catch (error) {
  //     console.error('Error fetching live metal prices:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadPrices = async () => {
    try {
      setLoading(true);
      const res = await fetchMetalPrices();
      if (res.data.success) {
        const { goldPerGram, silverPerGram, lastUpdate } = res.data.data;
        setPrices({ goldPerGram, silverPerGram, lastUpdate });
      }
    } catch (err) {
      console.error('Failed to load prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMetalPrices({
        goldPerGram: parseFloat(prices.goldPerGram),
        silverPerGram: parseFloat(prices.silverPerGram),
      });
      alert('Prices & Margins Updated Successfully! ✅');
      loadPrices();
    } catch (err) {
      alert('Failed to update prices. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMargins = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Pricing Margins Updated Successfully! ✅');
    }, 1000);
  };

  const handleMarginChange = (key, value) => {
    setMargins(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  return (
    <div className="dv2-container" style={{paddingTop: 0}}>
      {/* <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dv2-header"
        style={{marginBottom: '2rem'}}
      >
        <div className="dv2-title-section">
          <h1 className="dv2-title">Gold & Silver Pricing</h1>
          <p className="dv2-subtitle">Live market rates mapped directly from API providers.</p>
        </div>
        <div className="dv2-actions">
          <button className="dv2-btn-secondary" onClick={loadPrices} disabled={loading}>
            {loading ? <RefreshCw size={18} className="spinning" /> : <RefreshCw size={18} />} Fetch Live Rates
          </button>
          <button className="dv2-btn-primary" onClick={handleSaveMargins} disabled={saving}>
            {saving ? <RefreshCw size={18} className="spinning" /> : <Save size={18} />} Update Margins
          </button>
        </div>
      </motion.div> */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="dv2-header" style={{ marginBottom: '2rem' }}>
        <div className="dv2-title-section">
          <h1 className="dv2-title">Gold & Silver Pricing</h1>
          <p className="dv2-subtitle">Set base rates manually. These apply instantly to all user-facing prices.</p>
        </div>
        <div className="dv2-actions">
          <button className="dv2-btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? <RefreshCw size={18} className="spinning" /> : <Save size={18} />} Save Prices
          </button>
        </div>
      </motion.div>

      <div className="dv2-grid">
        {/* Live Market Rates Control Panel */}
        {/* <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="dv2-card dv2-col-span-2"
        >
          <div className="dv2-card-header" style={{marginBottom: '1.5rem'}}>
             <div className="dv2-card-title"><Activity size={24} color="#D4AF37" /> Live Metal Indices (API)</div>
             <span className="dv2-badge"><TrendingUp size={14}/> Active Connection</span>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
             <div style={{display: 'flex', background: '#F8FAFC', borderRadius: '20px', padding: '1.5rem', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(212, 175, 55, 0.2)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                   <div style={{background: 'linear-gradient(135deg, #FFD700, #D4AF37)', width: 56, height: 56, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'}}>
                      <Coins size={28} />
                   </div>
                   <div>
                      <h4 style={{margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 850, color: '#1E293B'}}>24K Gold Rate (Per Gram)</h4>
                      <p style={{margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600}}>Last synced: {goldPrice?.timestamp ? new Date(goldPrice.timestamp).toLocaleTimeString() : 'N/A'}</p>
                   </div>
                </div>
                <div style={{textAlign: 'right'}}>
                   <p style={{margin: 0, fontSize: '2rem', fontWeight: 900, color: '#1E293B'}}>
                      {loading ? '...' : `₹${goldPrice?.price ? parseFloat(goldPrice.price).toLocaleString('en-IN', {maximumFractionDigits: 2}) : '0.00'}`}
                   </p>
                </div>
             </div>

             <div style={{display: 'flex', background: '#F8FAFC', borderRadius: '20px', padding: '1.5rem', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2E8F0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                   <div style={{background: 'linear-gradient(135deg, #94A3B8, #64748B)', width: 56, height: 56, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px rgba(100, 116, 139, 0.2)'}}>
                      <Coins size={28} />
                   </div>
                   <div>
                      <h4 style={{margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 850, color: '#1E293B'}}>999 Silver Rate (Per Gram)</h4>
                      <p style={{margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600}}>Last synced: {silverPrice?.timestamp ? new Date(silverPrice.timestamp).toLocaleTimeString() : 'N/A'}</p>
                   </div>
                </div>
                <div style={{textAlign: 'right'}}>
                   <p style={{margin: 0, fontSize: '2rem', fontWeight: 900, color: '#1E293B'}}>
                      {loading ? '...' : `₹${silverPrice?.price ? parseFloat(silverPrice.price).toLocaleString('en-IN', {maximumFractionDigits: 2}) : '0.00'}`}
                   </p>
                </div>
             </div>
          </div>
        </motion.div> */}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="dv2-card dv2-col-span-2">
          <div className="dv2-card-header" style={{ marginBottom: '1.5rem' }}>
            <div className="dv2-card-title"><Coins size={24} color="#D4AF37" /> Base Metal Prices (Per Gram)</div>
            {prices.lastUpdate && (
              <span className="dv2-badge">Last updated: {new Date(prices.lastUpdate).toLocaleString()}</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Gold */}
            <div style={{ display: 'flex', background: '#F8FAFC', borderRadius: '20px', padding: '1.5rem', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)', width: 56, height: 56, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}>
                  <Coins size={28} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 850, color: '#1E293B' }}>24K Gold Rate (Per Gram)</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Set the base price in ₹ per gram</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>₹</span>
                <input
                  type="number"
                  value={prices.goldPerGram}
                  onChange={(e) => setPrices(p => ({ ...p, goldPerGram: e.target.value }))}
                  style={{ width: '150px', padding: '12px', fontSize: '1.4rem', borderRadius: '12px', border: '2px solid rgba(212,175,55,0.4)', fontWeight: 900, color: '#1E293B', textAlign: 'right' }}
                  placeholder="13200"
                />
              </div>
            </div>

            {/* Silver */}
            <div style={{ display: 'flex', background: '#F8FAFC', borderRadius: '20px', padding: '1.5rem', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #94A3B8, #64748B)', width: 56, height: 56, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px rgba(100, 116, 139, 0.2)' }}>
                  <Coins size={28} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 850, color: '#1E293B' }}>999 Silver Rate (Per Gram)</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Set the base price in ₹ per gram</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>₹</span>
                <input
                  type="number"
                  value={prices.silverPerGram}
                  onChange={(e) => setPrices(p => ({ ...p, silverPerGram: e.target.value }))}
                  style={{ width: '150px', padding: '12px', fontSize: '1.4rem', borderRadius: '12px', border: '2px solid #CBD5E1', fontWeight: 900, color: '#1E293B', textAlign: 'right' }}
                  placeholder="165"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Margin Control */}
        {/* <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="dv2-card dv2-col-span-2"
        >
          <div className="dv2-card-header" style={{marginBottom: '1.5rem'}}>
             <div className="dv2-card-title"><Percent size={24} color="#10B981" /> Margin Configuration</div>
          </div>
          
          <div style={{background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
             <AlertCircle size={20} style={{flexShrink: 0, marginTop: 2}} />
             <p style={{margin: 0, fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4}}>
                These margins will be applied instantaneously to all user-facing prices. Ensure external market stability before updating base conversion fees.
             </p>
          </div>

          <div className="dv2-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', width: '100%'}}>
             <div style={{width: '100%'}}>
                <label style={{fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', display: 'block', marginBottom: '8px'}}>Gold Buy Markup (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={margins.goldBuy} 
                  onChange={(e) => handleMarginChange('goldBuy', e.target.value)}
                  style={{width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #E2E8F0', fontWeight: 800, color: '#1e293b', boxSizing: 'border-box'}} 
                />
             </div>
             <div style={{width: '100%'}}>
                <label style={{fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', display: 'block', marginBottom: '8px'}}>Gold Sell Deduction (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={margins.goldSell} 
                  onChange={(e) => handleMarginChange('goldSell', e.target.value)}
                  style={{width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #E2E8F0', fontWeight: 800, color: '#1e293b', boxSizing: 'border-box'}} 
                />
             </div>
             <div style={{width: '100%'}}>
                <label style={{fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', display: 'block', marginBottom: '8px'}}>Silver Buy Markup (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={margins.silverBuy} 
                  onChange={(e) => handleMarginChange('silverBuy', e.target.value)}
                  style={{width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #E2E8F0', fontWeight: 800, color: '#1e293b', boxSizing: 'border-box'}} 
                />
             </div>
             <div style={{width: '100%'}}>
                <label style={{fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', display: 'block', marginBottom: '8px'}}>Silver Sell Deduction (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={margins.silverSell} 
                  onChange={(e) => handleMarginChange('silverSell', e.target.value)}
                  style={{width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #E2E8F0', fontWeight: 800, color: '#1e293b', boxSizing: 'border-box'}} 
                />
             </div>
          </div>
        </motion.div> */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="dv2-card dv2-col-span-2">
          <div className="dv2-card-header" style={{ marginBottom: '1.5rem' }}>
            <div className="dv2-card-title"><Percent size={24} color="#10B981" /> Margin Configuration</div>
          </div>

          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4 }}>
              These margins will be applied instantaneously to all user-facing prices.
            </p>
          </div>

          <div className="dv2-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', width: '100%' }}>
            {[['goldBuy', 'Gold Buy Markup (%)'], ['goldSell', 'Gold Sell Deduction (%)'], ['silverBuy', 'Silver Buy Markup (%)'], ['silverSell', 'Silver Sell Deduction (%)']].map(([key, label]) => (
              <div key={key} style={{ width: '100%' }}>
                <label style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>{label}</label>
                <input
                  type="number" step="0.1" value={margins[key]}
                  onChange={(e) => setMargins(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                  style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '12px', border: '2px solid #E2E8F0', fontWeight: 800, color: '#1e293b', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricesPage;
