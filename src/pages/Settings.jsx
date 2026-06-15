import React, { useState, useRef } from 'react';
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
  Plus,
  Image,
  Upload,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Dashboard.css';
import { deleteCarouselImage, fetchCarouselImageId, fetchCarouselImages, updateCarouselImage, uploadCarouselImage } from '../api';
import { API_URL } from '../api';

// ─── Carousel Manager (inline) ───────────────────────────────────────────────
const API_BASE = '/api/admin';

const getToken = () => localStorage.getItem('adminToken');

const CarouselManager = () => {
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/carousel`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setImages(data.data);
    } catch (e) {
      console.error('Failed to fetch carousel images', e);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  // Lazy-load on first render of this tab
  React.useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetchCarouselImages();

        console.log(res.data);

        if (res.data.success) {
          setImages(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadImages();
  }, []);

  const handleAddImage = async () => {
    if (!imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    try {
      const res = await uploadCarouselImage({
        imageUrl,
        title: imageTitle || 'Carousel Image',
        order: images.length,
        isActive: true,
      });

      if (res.data.success) {
        setImages(prev => [...prev, res.data.data]);
        setImageUrl('');
        setImageTitle('');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to add image');
    }
  };

  const toggleActive = async (id, current) => {
    try {
      const res = await fetchCarouselImageId(id);
      const data = res.data;
      if (data.success) setImages(prev => prev.map(img => img._id === id ? data.data : img));
    } catch (e) { console.error(e); }
  };

  const deleteImage = async (id) => {
    if (!window.confirm('Delete this carousel image?')) return;
    try {
      const res = await deleteCarouselImage(id);
      const data = res.data;
      if (data.success) setImages(prev => prev.filter(img => img._id !== id));
    } catch (e) { console.error(e); }
  };

  const shiftOrder = async (id, direction) => {
    const sorted = [...images].sort((a, b) => a.order - b.order);

    const idx = sorted.findIndex(img => img._id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;

    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];

    const newOrderA = b.order;
    const newOrderB = a.order;

    try {
      await Promise.all([
        updateCarouselImage(a._id, { order: newOrderA }),
        updateCarouselImage(b._id, { order: newOrderB }),
      ]);

      setImages(prev =>
        prev.map(img => {
          if (img._id === a._id) {
            return { ...img, order: newOrderA };
          }

          if (img._id === b._id) {
            return { ...img, order: newOrderB };
          }

          return img;
        })
      );
    } catch (error) {
      console.error('Failed to update image order:', error);
      alert('Failed to update image order');
    }
  };

  const sorted = [...images].sort((a, b) => a.order - b.order);

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="dv2-card-header">
        <div className="dv2-card-title">
          <Image size={24} color="#D4AF37" /> Carousel Images
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
            {images.filter(i => i.isActive).length} active · {images.length} total
          </span>
          <button
            onClick={fetchImages}
            className="dv2-btn-secondary"
            style={{ fontSize: 13, padding: '0.6rem 1rem' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                minWidth: '300px'
              }}
            />

            <input
              type="text"
              placeholder="Title"
              value={imageTitle}
              onChange={(e) => setImageTitle(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #E2E8F0',
                borderRadius: '10px'
              }}
            />

            <button
              onClick={handleAddImage}
              className="dv2-btn-primary"
            >
              <Plus size={16} />
              Add Image
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <RefreshCw size={28} className="spinning" style={{ marginBottom: 10 }} />
          <p style={{ margin: 0, fontSize: 14 }}>Loading images...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem',
            background: '#F8FAFC',
            borderRadius: 20,
            border: '2px dashed #E2E8F0',
          }}
        >
          <Image size={40} color="#CBD5E1" style={{ marginBottom: 12 }} />
          <p style={{ color: '#94a3b8', fontSize: 15, margin: 0 }}>
            No carousel images yet. Add an image URL above.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginTop: '0.5rem',
        }}>
          {sorted.map((img, idx) => (
            <div
              key={img._id}
              style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                border: `1.5px solid ${img.isActive ? '#D4AF37' : '#E2E8F0'}`,
                boxShadow: img.isActive
                  ? '0 4px 16px rgba(212,175,55,0.12)'
                  : '0 2px 8px rgba(0,0,0,0.05)',
                opacity: img.isActive ? 1 : 0.65,
                transition: 'all 0.2s',
              }}
            >
              {/* Image preview */}
              <div style={{ position: 'relative', height: 150, background: '#F1F5F9' }}>
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {/* Hidden overlay */}
                {!img.isActive && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>HIDDEN</span>
                  </div>
                )}
                {/* Order badge */}
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  background: 'rgba(0,0,0,0.65)', color: '#fff',
                  fontSize: 11, fontWeight: 800,
                  padding: '2px 8px', borderRadius: 20,
                }}>
                  #{idx + 1}
                </span>
                {/* Active pill */}
                {img.isActive && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    background: '#D4AF37', color: '#000',
                    fontSize: 10, fontWeight: 800,
                    padding: '2px 8px', borderRadius: 20,
                  }}>
                    LIVE
                  </span>
                )}
              </div>

              {/* Controls */}
              <div style={{ padding: '0.875rem' }}>
                <p style={{
                  margin: '0 0 10px', fontSize: 13, fontWeight: 700,
                  color: '#1e293b', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {img.title || `Slide ${idx + 1}`}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {/* <button
                    onClick={() => toggleActive(img._id, img.isActive)}
                    className="dv2-btn-secondary"
                    style={{ flex: 1, fontSize: 12, padding: '6px 8px' }}
                  >
                    {img.isActive
                      ? <><EyeOff size={13} /> Hide</>
                      : <><Eye size={13} /> Show</>}
                  </button> */}
                  <button
                    onClick={() => shiftOrder(img._id, 'up')}
                    disabled={idx === 0}
                    className="dv2-btn-secondary"
                    style={{ fontSize: 13, padding: '6px 10px', opacity: idx === 0 ? 0.4 : 1 }}
                    title="Move earlier"
                  >↑</button>
                  <button
                    onClick={() => shiftOrder(img._id, 'down')}
                    disabled={idx === sorted.length - 1}
                    className="dv2-btn-secondary"
                    style={{ fontSize: 13, padding: '6px 10px', opacity: idx === sorted.length - 1 ? 0.4 : 1 }}
                    title="Move later"
                  >↓</button>
                  <button
                    onClick={() => deleteImage(img._id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#FEF2F2', color: '#EF4444',
                      border: 'none', borderRadius: 10, padding: '6px 10px',
                      cursor: 'pointer', fontSize: 12,
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────
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

  const tabs = [
    { id: 'roles', icon: Shield, label: 'Admin Roles' },
    { id: 'commissions', icon: Percent, label: 'Commissions & Fees' },
    { id: 'media', icon: Image, label: 'Media / Carousel' },
    { id: 'api', icon: Key, label: 'API Config' },
    { id: 'system', icon: Server, label: 'Server Logic' },
  ];

  return (
    <div className="dv2-container" style={{ paddingTop: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dv2-header"
        style={{ marginBottom: '2rem' }}
      >
        <div className="dv2-title-section">
          <h1 className="dv2-title">System Settings</h1>
          <p className="dv2-subtitle">Configure administrative access, protocol variables, and external APIs.</p>
        </div>
        {/* Hide save button on media tab — carousel saves instantly */}
        {activeTab !== 'media' && (
          <div className="dv2-actions">
            <button className="dv2-btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <RefreshCw size={18} className="spinning" /> : <Save size={18} />}
              {isSaving ? 'Saving Changes...' : 'Save Configuration'}
            </button>
          </div>
        )}
      </motion.div>

      <div className="dv2-grid" style={{ gridTemplateColumns: '280px 1fr', gap: '2rem', width: '100%' }}>
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="dv2-card"
          style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          {tabs.map(({ id, icon: Icon, label }, i) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                className={`dv2-pl-item ${active ? 'active-tab' : ''}`}
                onClick={() => setActiveTab(id)}
                style={{
                  border: active ? '1px solid var(--gold-primary)' : '1px solid transparent',
                  background: active ? 'var(--gold-soft)' : '#F8FAFC',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: i < tabs.length - 1 ? '0.5rem' : 0,
                  // Media tab gets a subtle gold dot to highlight it's new
                  position: 'relative',
                }}
              >
                <Icon size={20} color={active ? 'var(--gold-primary)' : '#64748b'} />
                <span style={{ fontWeight: 700, color: active ? 'var(--gold-primary)' : '#1e293b' }}>
                  {label}
                </span>
                {id === 'media' && !active && (
                  <span style={{
                    marginLeft: 'auto',
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#D4AF37', display: 'inline-block', flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          className="dv2-card"
          style={{ padding: activeTab === 'media' ? '2rem' : '3rem', width: '100%' }}
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'roles' && (
            <div style={{ width: '100%' }}>
              <div className="dv2-card-header">
                <div className="dv2-card-title"><Users size={24} color="#D4AF37" /> Role Management</div>
                <button className="dv2-btn-secondary" style={{ fontSize: 13, padding: '0.6rem 1.2rem' }}>
                  <Plus size={16} /> Invite Admin
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                {[
                  { initials: 'SA', name: 'Super Administrator', desc: 'Full access to all modules, financial data, and configurations.', badge: '1 Assigned', avatarStyle: {}, badgeStyle: {} },
                  { initials: 'CA', name: 'Compliance Auditor', desc: 'Read-only access to Transactions, and Reports.', badge: '0 Assigned', avatarStyle: { background: '#F1F5F9', color: '#64748b' }, badgeStyle: { background: '#F1F5F9', color: '#64748b' } },
                  { initials: 'OM', name: 'Operations Manager', desc: 'Access to User Management, Deliveries, and Orders.', badge: '2 Assigned', avatarStyle: { background: '#ECFDF5', color: '#10B981' }, badgeStyle: { background: '#ECFDF5', color: '#10B981' } },
                ].map(({ initials, name, desc, badge, avatarStyle, badgeStyle }) => (
                  <div key={name} className="dv2-team-item">
                    <div className="dv2-flex-row">
                      <div className="dv2-avatar" style={avatarStyle}>{initials}</div>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{name}</h4>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{desc}</p>
                      </div>
                    </div>
                    <span className="dv2-badge" style={badgeStyle}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'commissions' && (
            <div style={{ width: '100%' }}>
              <div className="dv2-card-header">
                <div className="dv2-card-title"><Percent size={24} color="#D4AF37" /> Financial Margins & Fees</div>
              </div>
              <div className="dv2-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                {[
                  { label: 'Gold Buy Margin (%)', desc: 'Premium added when users purchase digital gold.', defaultValue: 2.5 },
                  { label: 'Gold Sell Margin (%)', desc: 'Discount applied when users liquidate digital gold.', defaultValue: 1.5 },
                  { label: 'Silver Buy Margin (%)', desc: 'Premium added to live silver rates.', defaultValue: 3.0 },
                  { label: 'Referral Bonus (g)', desc: 'Free gold credited to successful new user referrals.', defaultValue: 0.05, step: 0.01 },
                ].reduce((cols, item, i) => {
                  const col = i < 2 ? 0 : 1;
                  cols[col].push(item);
                  return cols;
                }, [[], []]).map((col, ci) => (
                  <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {col.map(({ label, desc, defaultValue, step }) => (
                      <div key={label} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px' }}>
                        <label style={{ fontWeight: 750, color: '#1e293b', display: 'block', marginBottom: '8px' }}>{label}</label>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>{desc}</p>
                        <input type="number" defaultValue={defaultValue} step={step} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700 }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'media' && <CarouselManager />}

          {activeTab === 'api' && (
            <div style={{ width: '100%' }}>
              <div className="dv2-card-header">
                <div className="dv2-card-title"><Key size={24} color="#D4AF37" /> Integration API Keys</div>
                <span className="dv2-badge" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                  <Lock size={12} style={{ marginRight: 4 }} /> Restricted Access
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                {[
                  {
                    title: 'Razorpay Configuration',
                    fields: [
                      { label: 'Key ID', type: 'password', defaultValue: 'rzp_live_KxYq7w9...' },
                      { label: 'Secret Key', type: 'password', defaultValue: '**********************' },
                    ],
                  },
                  {
                    title: 'SMS Gateway (Twilio / Msg91)',
                    fields: [
                      { label: 'API Token', type: 'password', defaultValue: 'auth_token_3948...' },
                      { label: 'Sender ID', type: 'text', defaultValue: 'SRIVIS' },
                    ],
                  },
                ].map(({ title, fields }) => (
                  <div key={title} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px' }}>
                    <h4 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 1rem' }}>{title}</h4>
                    <div className="dv2-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                      {fields.map(({ label, type, defaultValue }) => (
                        <div key={label} style={{ width: '100%' }}>
                          <label style={{ fontWeight: 750, color: '#64748b', fontSize: '0.85rem' }}>{label}</label>
                          <input type={type} defaultValue={defaultValue} style={{ width: '100%', marginTop: '6px', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, fontFamily: 'monospace', boxSizing: 'border-box' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div style={{ width: '100%' }}>
              <div className="dv2-card-header">
                <div className="dv2-card-title"><Database size={24} color="#D4AF37" /> Global System Restrictions</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                {[
                  { label: 'Maintenance Mode', desc: "Disable all user logins and transactions (Show 'Under Maintenance').", defaultChecked: false },
                  { label: 'Strict Password Policy', desc: 'Force users and admins to use numbers and symbols.', defaultChecked: true },
                ].map(({ label, desc, defaultChecked }) => (
                  <div key={label} className="dv2-pl-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>{label}</h4>
                      <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{desc}</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked={defaultChecked} />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .toggle-switch { position: relative; display: inline-block; width: 50px; height: 26px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-switch .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #E2E8F0; transition: .4s; border-radius: 34px; }
        .toggle-switch .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .toggle-switch input:checked + .slider { background-color: #10B981; }
        .toggle-switch input:checked + .slider:before { transform: translateX(24px); }
        .dv2-pl-item.active-tab { transition: all 0.3s; transform: scale(1.02); }
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default SettingsPage;