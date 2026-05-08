import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Key, 
  Percent, 
  Save, 
  Users, 
  Server,
  Database,
  Lock,
  RefreshCw,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css'; // Reusing premium Alabaster theme

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully! ✅');
    }, 1200);
  };

  return (
    <div className="dv2-container" style={{paddingTop: 0, height: '100%', display: 'flex', flexDirection: 'column'}}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dv2-header"
        style={{marginBottom: '2rem'}}
      >
        <div className="dv2-title-section">
          <h1 className="dv2-title">System Settings</h1>
          <p className="dv2-subtitle">Configure administrative access, protocol variables, and external APIs.</p>
        </div>
        <div className="dv2-actions">
           <button className="dv2-btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <RefreshCw size={18} className="spinning" /> : <Save size={18} />} 
            {isSaving ? 'Saving Changes...' : 'Save Configuration'}
          </button>
        </div>
      </motion.div>

      <div className="dv2-grid" style={{ gridTemplateColumns: '280px 1fr', gap: '2rem', width: '100%' }}>
        {/* Sidebar Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="dv2-card" 
          style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <button 
            className={`dv2-pl-item ${activeTab === 'roles' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('roles')}
            style={{ 
              border: activeTab === 'roles' ? '1px solid var(--gold-primary)' : '1px solid transparent',
              background: activeTab === 'roles' ? 'var(--gold-soft)' : '#F8FAFC',
              cursor: 'pointer', textAlign: 'left', marginBottom: '0.5rem'
            }}
          >
            <Shield size={20} color={activeTab === 'roles' ? 'var(--gold-primary)' : '#64748b'} />
            <span style={{fontWeight: 700, color: activeTab === 'roles' ? 'var(--gold-primary)' : '#1e293b'}}>Admin Roles</span>
          </button>
          
          <button 
            className={`dv2-pl-item ${activeTab === 'commissions' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('commissions')}
            style={{ 
              border: activeTab === 'commissions' ? '1px solid var(--gold-primary)' : '1px solid transparent',
              background: activeTab === 'commissions' ? 'var(--gold-soft)' : '#F8FAFC',
              cursor: 'pointer', textAlign: 'left', marginBottom: '0.5rem'
            }}
          >
            <Percent size={20} color={activeTab === 'commissions' ? 'var(--gold-primary)' : '#64748b'} />
            <span style={{fontWeight: 700, color: activeTab === 'commissions' ? 'var(--gold-primary)' : '#1e293b'}}>Commissions & Fees</span>
          </button>

          <button 
            className={`dv2-pl-item ${activeTab === 'api' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('api')}
            style={{ 
              border: activeTab === 'api' ? '1px solid var(--gold-primary)' : '1px solid transparent',
              background: activeTab === 'api' ? 'var(--gold-soft)' : '#F8FAFC',
              cursor: 'pointer', textAlign: 'left', marginBottom: '0.5rem'
            }}
          >
            <Key size={20} color={activeTab === 'api' ? 'var(--gold-primary)' : '#64748b'} />
            <span style={{fontWeight: 700, color: activeTab === 'api' ? 'var(--gold-primary)' : '#1e293b'}}>API Config</span>
          </button>
          
          <button 
            className={`dv2-pl-item ${activeTab === 'system' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('system')}
            style={{ 
              border: activeTab === 'system' ? '1px solid var(--gold-primary)' : '1px solid transparent',
              background: activeTab === 'system' ? 'var(--gold-soft)' : '#F8FAFC',
              cursor: 'pointer', textAlign: 'left', margin: 0
            }}
          >
            <Server size={20} color={activeTab === 'system' ? 'var(--gold-primary)' : '#64748b'} />
            <span style={{fontWeight: 700, color: activeTab === 'system' ? 'var(--gold-primary)' : '#1e293b'}}>Server Logic</span>
          </button>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          className="dv2-card" 
          style={{ padding: '3rem', width: '100%' }}
          key={activeTab} // Force re-render animation
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'roles' && (
            <div style={{width: '100%'}}>
              <div className="dv2-card-header">
                <div className="dv2-card-title"><Users size={24} color="#D4AF37" /> Role Management</div>
                <button className="dv2-btn-secondary" style={{fontSize: 13, padding: '0.6rem 1.2rem'}}>
                  <Plus size={16} /> Invite Admin
                </button>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%'}}>
                <div className="dv2-team-item">
                   <div className="dv2-flex-row">
                      <div className="dv2-avatar">SA</div>
                      <div>
                        <h4 style={{fontSize: 16, fontWeight: 800, margin: 0}}>Super Administrator</h4>
                        <p style={{fontSize: 13, color: '#64748b', margin: '4px 0 0'}}>Full access to all modules, financial data, and configurations.</p>
                      </div>
                   </div>
                   <span className="dv2-badge">1 Assigned</span>
                </div>
                <div className="dv2-team-item">
                   <div className="dv2-flex-row">
                      <div className="dv2-avatar" style={{background: '#F1F5F9', color: '#64748b'}}>CA</div>
                      <div>
                        <h4 style={{fontSize: 16, fontWeight: 800, margin: 0}}>Compliance Auditor</h4>
                        <p style={{fontSize: 13, color: '#64748b', margin: '4px 0 0'}}>Read-only access to Transactions, and Reports.</p>
                      </div>
                   </div>
                   <span className="dv2-badge" style={{background:'#F1F5F9', color:'#64748b'}}>0 Assigned</span>
                </div>
                <div className="dv2-team-item">
                   <div className="dv2-flex-row">
                      <div className="dv2-avatar" style={{background: '#ECFDF5', color: '#10B981'}}>OM</div>
                      <div>
                        <h4 style={{fontSize: 16, fontWeight: 800, margin: 0}}>Operations Manager</h4>
                        <p style={{fontSize: 13, color: '#64748b', margin: '4px 0 0'}}>Access to User Management, Deliveries, and Orders.</p>
                      </div>
                   </div>
                   <span className="dv2-badge" style={{background:'#ECFDF5', color:'#10B981'}}>2 Assigned</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commissions' && (
            <div style={{width: '100%'}}>
              <div className="dv2-card-header">
                <div className="dv2-card-title"><Percent size={24} color="#D4AF37" /> Financial Margins & Fees</div>
              </div>

              <div className="dv2-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div style={{background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                    <label style={{fontWeight: 750, color: '#1e293b', display: 'block', marginBottom: '8px'}}>Gold Buy Margin (%)</label>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '12px'}}>Premium added when users purchase digital gold.</p>
                    <input type="number" defaultValue={2.5} style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700}} />
                  </div>
                  <div style={{background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                    <label style={{fontWeight: 750, color: '#1e293b', display: 'block', marginBottom: '8px'}}>Gold Sell Margin (%)</label>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '12px'}}>Discount applied when users liquidate digital gold.</p>
                    <input type="number" defaultValue={1.5} style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700}} />
                  </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div style={{background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                    <label style={{fontWeight: 750, color: '#1e293b', display: 'block', marginBottom: '8px'}}>Silver Buy Margin (%)</label>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '12px'}}>Premium added to live silver rates.</p>
                    <input type="number" defaultValue={3.0} style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700}} />
                  </div>
                  <div style={{background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                    <label style={{fontWeight: 750, color: '#1e293b', display: 'block', marginBottom: '8px'}}>Referral Bonus (g)</label>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '12px'}}>Free gold credited to successful new user referrals.</p>
                    <input type="number" defaultValue={0.05} step="0.01" style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700}} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div style={{width: '100%'}}>
              <div className="dv2-card-header">
                <div className="dv2-card-title"><Key size={24} color="#D4AF37" /> Integration API Keys</div>
                <span className="dv2-badge" style={{background: '#FEF2F2', color: '#EF4444'}}><Lock size={12} style={{marginRight: 4}}/> Restricted Access</span>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%'}}>
                 <div style={{background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                    <h4 style={{fontSize: 16, fontWeight: 800, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: 8}}>
                      Razorpay Configuration
                    </h4>
                    <div className="dv2-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
                      <div style={{width: '100%'}}>
                        <label style={{fontWeight: 750, color: '#64748b', fontSize: '0.85rem'}}>Key ID</label>
                        <input type="password" defaultValue="rzp_live_KxYq7w9..." style={{width: '100%', marginTop: '6px', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, fontFamily: 'monospace', boxSizing: 'border-box'}} />
                      </div>
                      <div style={{width: '100%'}}>
                        <label style={{fontWeight: 750, color: '#64748b', fontSize: '0.85rem'}}>Secret Key</label>
                        <input type="password" defaultValue="**********************" style={{width: '100%', marginTop: '6px', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, fontFamily: 'monospace', boxSizing: 'border-box'}} />
                      </div>
                    </div>
                 </div>

                 <div style={{background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px'}}>
                    <h4 style={{fontSize: 16, fontWeight: 800, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: 8}}>
                      SMS Gateway (Twilio / Msg91)
                    </h4>
                    <div className="dv2-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
                      <div style={{width: '100%'}}>
                        <label style={{fontWeight: 750, color: '#64748b', fontSize: '0.85rem'}}>API Token</label>
                        <input type="password" defaultValue="auth_token_3948..." style={{width: '100%', marginTop: '6px', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, fontFamily: 'monospace', boxSizing: 'border-box'}} />
                      </div>
                      <div style={{width: '100%'}}>
                        <label style={{fontWeight: 750, color: '#64748b', fontSize: '0.85rem'}}>Sender ID</label>
                        <input type="text" defaultValue="SRIVIS" style={{width: '100%', marginTop: '6px', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, fontFamily: 'monospace', boxSizing: 'border-box'}} />
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div style={{width: '100%'}}>
              <div className="dv2-card-header">
                <div className="dv2-card-title"><Database size={24} color="#D4AF37" /> Global System Restrictions</div>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%'}}>
                <div className="dv2-pl-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC'}}>
                   <div>
                      <h4 style={{fontSize: 15, fontWeight: 800, margin: 0}}>Maintenance Mode</h4>
                      <p style={{fontSize: 13, color: '#64748b', margin: '4px 0 0'}}>Disable all user logins and transactions (Show 'Under Maintenance').</p>
                   </div>
                   <label className="toggle-switch">
                     <input type="checkbox" />
                     <span className="slider"></span>
                   </label>
                </div>
                
                <div className="dv2-pl-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC'}}>
                   <div>
                      <h4 style={{fontSize: 15, fontWeight: 800, margin: 0}}>Strict Password Policy</h4>
                      <p style={{fontSize: 13, color: '#64748b', margin: '4px 0 0'}}>Force users and admins to use numbers and symbols.</p>
                   </div>
                   <label className="toggle-switch">
                     <input type="checkbox" defaultChecked />
                     <span className="slider"></span>
                   </label>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .toggle-switch { position: relative; display: inline-block; width: 50px; height: 26px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-switch .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #E2E8F0; transition: .4s; border-radius: 34px; }
        .toggle-switch .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .toggle-switch input:checked + .slider { background-color: #10B981; }
        .toggle-switch input:checked + .slider:before { transform: translateX(24px); }
        .dv2-pl-item.active-tab { transition: all 0.3s; transform: scale(1.02); }
      `}} />
    </div>
  );
};

export default SettingsPage;
