import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  TrendingUp, 
  UserPlus, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Filter, 
  Trash2,
  ListRestart
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Notifications.css';

const NotificationsPage = () => {
  const [logs] = useState([
    { id: 1, type: 'critical', msg: 'Unauthorized login attempt from IP: 192.168.1.45', time: '2 mins ago', icon: ShieldAlert },
    { id: 2, type: 'price', msg: 'Global Gold Rate spike detected: +2.4%', time: '15 mins ago', icon: TrendingUp },
    { id: 3, type: 'user', msg: 'New User Registration: Rasul (+91 9876543210)', time: '1 hr ago', icon: UserPlus },
    { id: 4, type: 'warning', msg: 'Razorpay API latency high (avg 4.5s)', time: '3 hrs ago', icon: AlertTriangle },
    { id: 5, type: 'info', msg: 'Weekly Report generated: report_24-mar-2026.pdf', time: '6 hrs ago', icon: Activity },
  ]);

  return (
    <div className="notifications-page">
      <div className="section-header">
        <div className="header-actions">
          <div className="search-box">
            <Filter size={20} />
            <select>
              <option>All Alerts</option>
              <option>Critical Only</option>
              <option>System Logs</option>
              <option>User Feed</option>
            </select>
          </div>
          <button className="secondary-btn clear">
            <Trash2 size={20} />
            Clear All
          </button>
        </div>
        <button className="primary-btn refresh">
          <ListRestart size={20} />
          Refresh Live Feed
        </button>
      </div>

      <div className="notifications-feed">
        <div className="feed-header">
          <h3>Real-time System Audit</h3>
          <p>Displaying last 24 hours of platform activity.</p>
        </div>
        <div className="feed-list">
          {logs.map((log, idx) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`feed-item ${log.type}`}
            >
              <div className="item-icon-box">
                <log.icon size={22} />
              </div>
              <div className="item-content">
                <div className="item-text">
                  <p>{log.msg}</p>
                </div>
                <div className="item-meta">
                  <Clock size={12} />
                  <span>{log.time}</span>
                  <span className={`type-tag tag-${log.type}`}>{log.type}</span>
                </div>
              </div>
              <button className="item-action">Dismiss</button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="system-health">
        <h3>System Health Monitor</h3>
        <div className="health-grid">
          <div className="health-card">
            <span className="h-label">Server Uptime</span>
            <div className="h-val">99.98%</div>
            <div className="h-status green">Operating Normally</div>
          </div>
          <div className="health-card">
            <span className="h-label">Database Latency</span>
            <div className="h-val">24ms</div>
            <div className="h-status green">Low Latency</div>
          </div>
          <div className="health-card">
            <span className="h-label">Memory Usage</span>
            <div className="h-val">42%</div>
            <div className="h-status yellow">Medium Usage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
