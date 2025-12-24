// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import api from '../api/axiosConfig';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../assets/css/components/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const DashboardPage = () => {
  // ✅ Initialize with 0 to prevent initial crash
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingMentors: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Static Data for Charts (Since DB is new/empty)
  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyBookings = [1200, 1500, 1800, 2200, 2800, 3200, 3500, 3800, 4100, 4500, 4800, 5200];
  const monthlyRevenue = [8160, 10200, 12240, 14960, 19040, 21760, 23800, 25840, 27880, 30600, 32640, 35360];

  const topMentors = [
    { name: 'James Wilson', bookings: 245, revenue: 12250, status: 'Active' },
    { name: 'Sarah Johnson', bookings: 189, revenue: 9450, status: 'Active' },
    { name: 'David Brown', bookings: 156, revenue: 4680, status: 'Active' },
    { name: 'Lisa Anderson', bookings: 98, revenue: 4900, status: 'Active' },
  ];

  const recentActivity = [
    { type: 'user', message: 'New student joined the platform', time: '2 minutes ago' },
    { type: 'mentor', message: 'Mentor approved – James Wilson', time: '15 minutes ago' },
    { type: 'booking', message: 'New booking created', time: '1 hour ago' },
    { type: 'review', message: 'New review posted', time: '1 hour ago' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        
        // ✅ CRITICAL FIX: Safe Merge
        // Even if backend is missing keys, we default to 0 to prevent crash
        const backendStats = res.data.stats || {};
        setStats({
            totalUsers: backendStats.totalUsers || 0,
            pendingMentors: backendStats.pendingMentors || 0,
            totalBookings: backendStats.totalBookings || 0,
            totalRevenue: backendStats.totalRevenue || 0
        });

      } catch (err) {
        console.log('API Error, using fallback data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Metric: 'Total Revenue', Value: `$${(stats.totalRevenue || 0).toLocaleString()}` },
      { Metric: 'Total Bookings', Value: stats.totalBookings || 0 },
      { Metric: 'Total Users', Value: stats.totalUsers || 0 },
      { Metric: 'Pending Mentors', Value: stats.pendingMentors || 0 },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    XLSX.writeFile(wb, 'CareersNC_Dashboard.xlsx');
  };

  const printPDF = () => {
    import('jspdf-autotable').then(({ default: autoTable }) => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      doc.setFontSize(20);
      doc.setTextColor(111, 66, 193);
      doc.text('CareersNC Admin Dashboard Report', 20, 25);

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

      autoTable(doc, {
        startY: 45,
        head: [['Key Metric', 'Value']],
        body: [
          ['Total Revenue', `$${(stats.totalRevenue || 0).toLocaleString()}`],
          ['Total Bookings', (stats.totalBookings || 0).toLocaleString()],
          ['Total Users', (stats.totalUsers || 0).toLocaleString()],
          ['Pending Mentors', (stats.pendingMentors || 0).toString()],
        ],
        theme: 'grid',
      });

      doc.save('CareersNC_Dashboard_Report.pdf');
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  const barData = {
    labels: monthlyLabels,
    datasets: [
      { label: 'Bookings', data: monthlyBookings, backgroundColor: '#00d4b4', borderRadius: 8 },
      { label: 'Revenue ($)', data: monthlyRevenue, backgroundColor: '#6f42c1', borderRadius: 8 },
    ],
  };

  const doughnutData = {
    labels: ['Direct', 'Social Media', 'Referral'],
    datasets: [{
      data: [55, 30, 15],
      backgroundColor: ['#6f42c1', '#00d4b4', '#fd7e14'],
      borderWidth: 4,
      borderColor: '#fff',
      cutout: '75%',
    }],
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div className="header-actions">
          <button className="btn-export" onClick={exportExcel}>Export Excel</button>
          <button className="btn-print" onClick={printPDF}>Print Report</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-top"><h4>Total Revenue</h4><span className="icon">$</span></div>
          {/* ✅ SAFE CHECK: Added || 0 to prevent crash */}
          <h2>${(stats.totalRevenue || 0).toLocaleString()}</h2>
          <p>↑ 12.5% <span>vs last month</span></p>
        </div>
        <div className="stat-card purple">
          <div className="stat-top"><h4>Total Bookings</h4><span className="icon">📊</span></div>
          {/* ✅ SAFE CHECK */}
          <h2>{(stats.totalBookings || 0).toLocaleString()}</h2>
          <p>↑ 8.2% <span>vs last month</span></p>
        </div>
        <div className="stat-card blue">
          <div className="stat-top"><h4>Total Users</h4><span className="icon">👥</span></div>
          {/* ✅ SAFE CHECK */}
          <h2>{(stats.totalUsers || 0).toLocaleString()}</h2>
          <p>↑ 5.7% <span>vs last month</span></p>
        </div>
        <div className="stat-card orange">
          <div className="stat-top"><h4>Pending Mentors</h4><span className="icon">⏳</span></div>
          {/* ✅ SAFE CHECK */}
          <h2>{stats.pendingMentors || 0}</h2>
          <p>Needs review</p>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card big">
          <div className="chart-header"><h3>Monthly Bookings & Revenue</h3></div>
          <div className="chart-wrapper"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
        </div>
        <div className="chart-card small">
          <h3>Traffic Sources</h3>
          <div className="chart-wrapper doughnut"><Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          {recentActivity.map((item, i) => (
            <div key={i} className="activity-row">
              <div className={`activity-dot ${item.type}`}></div>
              <div className="activity-content">
                <p>{item.message}</p>
                <small>{item.time}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="top-mentors-card">
          <h3>Top Mentors</h3>
          <table>
            <thead><tr><th>Mentor</th><th>Bookings</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody>
              {topMentors.map((m, i) => (
                <tr key={i}>
                  <td>{m.name}</td>
                  <td>{m.bookings}</td>
                  <td>${m.revenue.toLocaleString()}</td>
                  <td><span className="status active">{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;