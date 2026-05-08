import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  Wallet,
  FileText,
  BarChart3,
  Coins,
  Share2
} from 'lucide-react';
import './Sidebar.css';

import logo from '../assets/logo.jpeg';

const Sidebar = ({ onLogout }) => {
  const menuItems = [
    { title: 'Overview', icon: LayoutDashboard, path: '/' },
    { title: 'Users', icon: Users, path: '/users' },
    { title: 'Referrals', icon: Share2, path: '/referrals' },
    { title: 'Gold Wallets', icon: Wallet, path: '/wallets' },
    { title: 'Gold Price', icon: TrendingUp, path: '/prices' },
    { title: 'Payments', icon: CreditCard, path: '/payments' },
    { title: 'Orders & Redemptions', icon: ShoppingBag, path: '/orders' },
    { title: 'Reports', icon: BarChart3, path: '/reports' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-wrapper">
          <img src={logo} alt="Srivishva jewellers" className="sidebar-logo-img" />
        </div>
        <div className="sidebar-logo-text">
          <h1>Srivishva jewellers</h1>
          <span>Admin Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.title}</span>
                <ChevronRight size={14} className="chevron" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="version-info">v2.1.0</div>
        <button className="logout-btn" onClick={onLogout}>  {/* ← just add onClick here */}
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
