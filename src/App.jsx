import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';

// Core Pages
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import ReferralsPage from './pages/Referrals';
import OrdersPage from './pages/Orders';
import PaymentsPage from './pages/Payments';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';
import WalletsPage from './pages/Wallets';
import PricesPage from './pages/Prices';

import './index.css';

// ── Auth helpers ──────────────────────────────────────────────────────────────
const isAuthenticated = () => localStorage.getItem('sv_admin_auth') === 'true';;

const ProtectedRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  const handleLogin = () => setAuth(true);

  const handleLogout = () => {
    localStorage.removeItem('sv_admin_auth');
    setAuth(false);
  };

  return (
    <Router>
      <Routes>

        {/* ── Public: Login ── */}
        <Route
          path="/login"
          element={
            auth
              ? <Navigate to="/" replace />
              : <Login onLogin={handleLogin} />
          }
        />

        {/* ── Protected Routes ── */}
        <Route path="/" element={<ProtectedRoute><Layout title="Dashboard Overview" onLogout={handleLogout}><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Layout title="User Management" onLogout={handleLogout}><UsersPage /></Layout></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><Layout title="Referral Network" onLogout={handleLogout}><ReferralsPage /></Layout></ProtectedRoute>} />
        <Route path="/wallets" element={<ProtectedRoute><Layout title="Gold Wallets" onLogout={handleLogout}><WalletsPage /></Layout></ProtectedRoute>} />
        <Route path="/prices" element={<ProtectedRoute><Layout title="Gold Price Control" onLogout={handleLogout}><PricesPage /></Layout></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Layout title="Payment Control" onLogout={handleLogout}><PaymentsPage /></Layout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Layout title="Orders & Redemptions" onLogout={handleLogout}><OrdersPage /></Layout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Layout title="Reports & Analytics" onLogout={handleLogout}><ReportsPage /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout title="System Settings" onLogout={handleLogout}><SettingsPage /></Layout></ProtectedRoute>} />

        {/* ── Catch-all → redirect to home ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;