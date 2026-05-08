import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Edit, 
  RefreshCw 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import './GoldPrice.css';

const GoldPricePage = () => {
  const [currentRate, setCurrentRate] = useState(6523.02);
  const [buyMargin, setBuyMargin] = useState(2.5);
  const [sellMargin, setSellMargin] = useState(1.5);

  const priceHistory = [
    { time: '09:00', price: 6480 },
    { time: '10:00', price: 6510 },
    { time: '11:00', price: 6505 },
    { time: '12:00', price: 6523.02 },
    { time: '13:00', price: 6515 },
    { time: '14:00', price: 6530 },
    { time: '15:00', price: 6528 },
  ];

  return (
    <div className="price-page">
      <div className="price-header">
        <div className="live-rate-card">
          <div className="live-header">
            <span>Live 24K Gold Rate (Per gram)</span>
            <div className="live-badge">LIVE <div className="dot" /></div>
          </div>
          <div className="rate-display">
            <h2>₹ {currentRate.toLocaleString()}</h2>
            <div className="rate-change up">
              <ArrowUp size={16} />
              <span>₹ 51.84 (0.8%)</span>
            </div>
          </div>
        </div>

        <div className="margin-controls">
          <div className="margin-card pink">
            <span className="m-label">Buy Margin (%)</span>
            <div className="m-input">
              <input type="number" value={buyMargin} onChange={(e) => setBuyMargin(e.target.value)} />
              <button><Save size={18} /></button>
            </div>
          </div>
          <div className="margin-card green">
            <span className="m-label">Sell Margin (%)</span>
            <div className="m-input">
              <input type="number" value={sellMargin} onChange={(e) => setSellMargin(e.target.value)} />
              <button><Save size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="price-content">
        <div className="chart-panel">
          <div className="panel-header">
            <h3>Price Volatility (Today)</h3>
            <button className="refresh-mini"><RefreshCw size={14} /></button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--primary)" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: 'var(--primary)', stroke: 'white' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="manual-update-form">
          <h3>Manual Price Override</h3>
          <p>Overriding local price will disconnect automatic broker feeds temporarily.</p>
          <div className="form-group">
            <label>New Base Rate (24K)</label>
            <input type="number" placeholder="Enter new price..." step="0.01" />
          </div>
          <div className="form-group">
            <label>Update Justification</label>
            <textarea placeholder="e.g. Market spike, holiday adjustment..."></textarea>
          </div>
          <button className="wide-btn">Apply Override</button>
        </div>
      </div>
    </div>
  );
};

export default GoldPricePage;
