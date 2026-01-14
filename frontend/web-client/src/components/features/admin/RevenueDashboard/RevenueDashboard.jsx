import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RevenueDashboard.css';

const RevenueDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('revenue');
  const [dateFilter, setDateFilter] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  // TODO: Import dữ liệu từ database
  const revenueData = [];

  const monthlyData = [];

  const topProducts = [];

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = monthlyData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'dashboard', path: '/admin/revenue' },
    { id: 'products', label: 'Quản lý sản phẩm', icon: 'inventory_2', path: '#' },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: 'shopping_cart', path: '/admin/orders' },
    { id: 'users', label: 'Quản lý tài khoản', icon: 'people', path: '/admin/users' },
    { id: 'analytics', label: 'Thống kê', icon: 'analytics', path: '/admin/revenue' },
    { id: 'settings', label: 'Cài đặt', icon: 'settings', path: '#' }
  ];

  const handleNavigate = (path) => {
    if (path !== '#') {
      navigate(path);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getMaxRevenue = () => {
    const max = Math.max(...monthlyData.map(item => item.revenue || 0));
    return max > 0 ? max : 1;
  };

  return (
    <div className="revenue-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <button 
              className="logo-button"
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span className="logo-text">Sixedi</span>
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu(item.id);
                handleNavigate(item.path);
              }}
            >
              <span className="material-icons-round">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4riGztTAlAeCaD4n3-X6ze77Z8aZnwE0XztxLkHAugpdu_0zrns5tk1q8H52NcqCL-nBOmDlXeHxxGfa17elWmBsBVlFJ0UZ937wshQWTmLSoG7zlHVVsD-IQYIe3NWJUcIRWpSw-64I6SanRJjoE9AMGsU1FDffbSSwotIY7S0vezhu3j8QVCG_Ea71MswjD0oUm3U7HOyYM2VcZXRu2TKqKK2a7pcK5ly677zS4qGPEyE8eiFxX_4IMWfXHuQhRnq4JgAwmVFC1" alt="Admin" />
            </div>
            <div className="user-details">
              <p className="name">Admin User</p>
              <p className="role">admin@sixedi.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button className="menu-toggle">
              <span className="material-icons-round">menu</span>
            </button>
            <h1>Bảng Điều Khiển Doanh Thu</h1>
          </div>

          <div className="header-right">
            <button className="notification-btn">
              <span className="material-icons-round">light_mode</span>
            </button>
            <button className="notification-btn">
              <span className="material-icons-round">notifications</span>
              <span className="notification-badge">3</span>
            </button>
          </div>
        </header>

        <div className="content-area">

      {/* Thống kê tổng quan */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue-icon"></div>
          <div className="stat-content">
            <h3>Tổng Doanh Thu</h3>
            <p className="stat-value">{formatCurrency(totalRevenue)}</p>
            <span className="stat-label">6 tháng gần đây</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders-icon"></div>
          <div className="stat-content">
            <h3>Tổng Đơn Hàng</h3>
            <p className="stat-value">{totalOrders.toLocaleString('vi-VN')}</p>
            <span className="stat-label">Đơn hàng hoàn tất</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon average-icon"></div>
          <div className="stat-content">
            <h3>Giá Trị Trung Bình</h3>
            <p className="stat-value">{formatCurrency(avgOrderValue)}</p>
            <span className="stat-label">Mỗi đơn hàng</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon growth-icon"></div>
          <div className="stat-content">
            <h3>Tăng Trưởng</h3>
            <p className="stat-value">+8.3%</p>
            <span className="stat-label">So với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu hàng tháng */}
      <div className="chart-section">
        <div className="section-header">
          <h2>Doanh Thu Hàng Tháng</h2>
          <select className="date-filter" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="month">Theo Tháng</option>
            <option value="quarter">Theo Quý</option>
            <option value="year">Theo Năm</option>
          </select>
        </div>

        <div className="bar-chart">
          {monthlyData.length > 0 ? (
            monthlyData.map((item) => {
              const height = (item.revenue / getMaxRevenue()) * 100;
              return (
                <div key={item.month} className="chart-bar-container">
                  <div className="chart-bar" style={{ height: `${height}%` }}>
                    <span className="bar-value">{formatCurrency(item.revenue)}</span>
                  </div>
                  <span className="bar-label">{item.month}</span>
                  <span className="bar-info">{item.orders} đơn</span>
                </div>
              );
            })
          ) : (
            <p className="no-data">Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      {/* Chi tiết doanh thu hàng ngày */}
      <div className="daily-revenue-section">
        <div className="section-header">
          <h2>Chi Tiết Doanh Thu Hàng Ngày</h2>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-picker"
          />
        </div>

        <div className="table-container">
          <table className="revenue-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Doanh Thu</th>
                <th>Số Đơn Hàng</th>
                <th>Sản Phẩm Bán Ra</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.length > 0 ? (
                revenueData.map((item) => (
                  <tr key={item.date}>
                    <td>{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                    <td className="revenue-value">{formatCurrency(item.amount)}</td>
                    <td>{item.orders}</td>
                    <td>{item.products}</td>
                    <td>
                      <span className="status-badge status-completed">Hoàn tất</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">Chưa có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sản phẩm bán chạy nhất */}
      <div className="top-products-section">
        <div className="section-header">
          <h2>Sản Phẩm Bán Chạy Nhất</h2>
        </div>

        <div className="products-grid">
          {topProducts.length > 0 ? (
            topProducts.map((product) => (
              <div key={product.id} className="product-revenue-card">
                <div className="product-rank">#1</div>
                <h3>{product.name}</h3>
                <div className="product-stats">
                  <div className="stat">
                    <span className="label">Doanh Thu:</span>
                    <span className="value">{formatCurrency(product.revenue)}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Đã Bán:</span>
                    <span className="value">{product.sold.toLocaleString('vi-VN')} sp</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">Chưa có dữ liệu</p>
          )}
        </div>
      </div>
        </div>
      </main>
    </div>
  );
};

export default RevenueDashboard;
