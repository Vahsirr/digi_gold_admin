import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, title, onLogout }) => {
  return (
    <div className="layout">
      <Sidebar onLogout={onLogout} />
      <main className="layout-content">
        <Header title={title} />
        <div className="content-inner">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
