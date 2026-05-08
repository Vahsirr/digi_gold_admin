import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import './Login.css';

// ─── Static credentials ────────────────────────────────────────────────────────
const ADMIN_EMAIL    = 'admin@srivishva.com';
const ADMIN_PASSWORD = 'Srivishva@2024';
// ──────────────────────────────────────────────────────────────────────────────

const Login = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief async check for UX feel
    await new Promise(r => setTimeout(r, 700));

    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('sv_admin_auth', 'true');
      onLogin();
    } else {
      setError('Invalid email or password. Access denied.');
      triggerShake();
    }
    setLoading(false);
  };

  return (
    <div className="sv-login-root">
      {/* Decorative background */}
      <div className="sv-login-bg">
        <div className="sv-orb sv-orb-1" />
        <div className="sv-orb sv-orb-2" />
        <div className="sv-grid-lines" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`sv-login-card ${shake ? 'sv-shake' : ''}`}
      >
        {/* Brand */}
        <div className="sv-login-brand">
          <div className="sv-login-icon">
            <ShieldCheck size={28} color="#D4AF37" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="sv-brand-name">Srivishva</h1>
            <p className="sv-brand-sub">Admin Control Center</p>
          </div>
        </div>

        <div className="sv-login-divider" />

        <h2 className="sv-login-heading">Secure Sign-In</h2>
        <p className="sv-login-hint">Authorized personnel only</p>

        <form onSubmit={handleSubmit} className="sv-login-form">
          {/* Email */}
          <div className="sv-field">
            <label htmlFor="sv-email">Email Address</label>
            <input
              id="sv-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@gmail.com"
              required
            />
          </div>

          {/* Password */}
          <div className="sv-field">
            <label htmlFor="sv-password">Password</label>
            <div className="sv-pwd-wrapper">
              <input
                id="sv-password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••••••"
                required
              />
              <button
                type="button"
                className="sv-pwd-toggle"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="err"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '4px' }}
                exit={{ opacity: 0, height: 0 }}
                className="sv-error"
              >
                <AlertCircle size={15} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="sv-login-btn" disabled={loading}>
            {loading ? (
              <span className="sv-spinner" />
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        <p className="sv-login-footer">
          Srivishva Jewellers © {new Date().getFullYear()} &nbsp;·&nbsp; All rights reserved
        </p>
      </motion.div>
    </div>
  );
};

export default Login;