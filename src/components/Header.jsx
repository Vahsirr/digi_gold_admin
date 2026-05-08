import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import './Header.css';

const Header = ({ title = 'Dashboard' }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{title}</h2>
        <div className="search-bar">
          <Search size={18} color="var(--text-light)" />
          <input type="text" placeholder="Search for clients, transactions..." />
        </div>
      </div>

      <div className="header-right">
        <div className="action-icons">
          <button className="icon-btn" title="Notifications">
            <Bell size={20} />
            <span className="badge dot"></span>
          </button>
        </div>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Admin Admin</span>
            <span className="user-role">Super Admin</span>
          </div>
          <div className="avatar-small">
            <User size={20} color="var(--primary)" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
