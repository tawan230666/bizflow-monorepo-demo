import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ReportPage() {
  const todayProfit = 8400;
  const yesterdayProfit = 7200;
  
  const profitDiff = todayProfit - yesterdayProfit;
  const profitPercent = (profitDiff / yesterdayProfit) * 100;
  const isPositive = profitDiff >= 0;

  const trendData = [
    { name: 'จันทร์', profit: 4000 },
    { name: 'อังคาร', profit: 3000 },
    { name: 'พุธ', profit: 5500 },
    { name: 'พฤหัสฯ', profit: 4800 },
    { name: 'ศุกร์', profit: 7200 },
    { name: 'เสาร์', profit: todayProfit },
  ];

  const categoryData = [
    { name: 'จานหลัก', profit: 4500 },
    { name: 'เครื่องดื่ม', profit: 2500 },
    { name: 'ของหวาน', profit: 1400 },
  ];

  // สีสำหรับกราฟในธีมมืด
  const chartAxisColor = "#9CA3AF";
  const chartGridColor = "#2A2F40";
  const tooltipStyle = { backgroundColor: '#151924', borderColor: '#2A2F40', color: '#F3F4F6' };

  return (
    <div className="page-container">
      <h2>📊 Market Overview & Analytics</h2>

      <div className="finance-cards" style={{ marginBottom: '32px' }}>
        <div className="card">
          <h3>Today's Profit</h3>
          <p className="amount">฿{todayProfit.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Yesterday's Profit</h3>
          <p className="amount">฿{yesterdayProfit.toLocaleString()}</p>
        </div>
        <div className={`card highlight ${isPositive ? 'positive' : 'negative'}`}>
          <h3>Day over Day (DoD)</h3>
          <p 
            className="amount" 
            style={{ color: isPositive ? 'var(--profit)' : 'var(--loss)', display: 'flex', alignItems: 'center' }}
          >
            <span style={{ fontSize: '24px', marginRight: '8px' }}>
              {isPositive ? '▲' : '▼'}
            </span>
            {isPositive ? '+' : ''}฿{Math.abs(profitDiff).toLocaleString()} 
            <span style={{ fontSize: '18px', marginLeft: '12px', opacity: 0.9 }}>
              ({isPositive ? '+' : ''}{profitPercent.toFixed(2)}%)
            </span>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        
        {/* กราฟเส้น */}
        <div className="card">
          <h3 style={{ marginBottom: '24px' }}>📈 Profit Trend (7 Days)</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                <XAxis dataKey="name" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 13 }} />
                <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 13, fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#10B981', fontFamily: 'JetBrains Mono' }} formatter={(value: number) => `฿${value}`} />
                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Net Profit" 
                  stroke="#10B981" 
                  strokeWidth={4} 
                  dot={{ fill: '#151924', stroke: '#10B981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#10B981', stroke: '#fff' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* กราฟแท่ง */}
        <div className="card">
          <h3 style={{ marginBottom: '24px' }}>📊 Revenue by Category</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                <XAxis dataKey="name" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 13 }} />
                <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 13, fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#3B82F6', fontFamily: 'JetBrains Mono' }} formatter={(value: number) => `฿${value}`} />
                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                <Bar 
                  dataKey="profit" 
                  name="Revenue" 
                  fill="#3B82F6" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}