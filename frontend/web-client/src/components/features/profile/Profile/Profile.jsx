import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from '../../../../context/AuthContext';
import Header from '../../../ui/Header/Header';
import Footer from '../../../ui/Footer/Footer';
import Address from '../Address/Address';
import './Profile.css';

const Profile = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male'
  });
  const [loading, setLoading] = useState(false);

  // Load user data from context when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || 'male'
      });
    } else {
      // If no user data, redirect to login
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Call API to update user profile
      // await updateUserProfileApi(formData);
      message.success('Thông tin đã được cập nhật thành công!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'profile', label: 'Thông tin tài khoản', icon: 'person' },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: 'receipt_long' },
    { id: 'addresses', label: 'Địa chỉ giao hàng', icon: 'location_on' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-content">
            <div className="content-header">
              <h2>Thông tin tài khoản</h2>
              <p>Quản lý thông tin cá nhân của bạn</p>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>Thông tin cơ bản</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="lastName">Họ</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="firstName">Tên</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Ngày sinh</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Giới tính</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Lưu thay đổi
                </button>
                <button type="button" className="cancel-btn">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        );

      case 'orders':
        return (
          <div className="orders-content">
            <div className="content-header">
              <h2>Đơn hàng của tôi</h2>
              <p>Lịch sử mua hàng và theo dõi đơn hàng</p>
            </div>

            <div className="orders-list">
              <div className="order-item">
                <div className="order-header">
                  <span className="order-number">#ORD-2024-001</span>
                  <span className="order-status status-delivered">Đã giao</span>
                  <span className="order-date">15/01/2024</span>
                </div>
                <div className="order-products">
                  <div className="order-product">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3jznDZz8l4yp3-VWQ1pgDZ9swRUd5feallVw5RJoOUVRHKKWKIp5PYG0o8gDDx5a2igLI5qXm3PLAedDs_zRh-pXVWKnZU6P2mFevYJV5Vf5WYoGeYsEqZLCj0RTTmA0hQd2BtTtEk0CubGO3J32ZxpwwuJ7jxePwICfVUvStuaqbz1BB1LuzVQ7dduiin4nQcZ4jG7Y0JceIQbGfhg2z2q3TEpSOJj5AVEEfD5TrlpgaOff-hNLpGbXAYrbNFFu2L9OIX7ZFNva0" alt="Product" />
                    <div className="product-info">
                      <h4>Áo Thun Nam Basic Trắng</h4>
                      <p>Size: L | Màu: Trắng | Số lượng: 1</p>
                      <p className="product-price">350.000 ₫</p>
                    </div>
                  </div>
                </div>
                <div className="order-footer">
                  <span className="order-total">Tổng: 350.000 ₫</span>
                  <button className="view-details-btn">Xem chi tiết</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'addresses':
        return <Address />;

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <span>NN</span>
              </div>
              <div className="user-details">
                <h3>Tài khoản của</h3>
                <p>Nam Nguyen</p>
              </div>
            </div>

            <nav className="profile-nav">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="material-icons">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="nav-divider"></div>

              <button className="nav-item logout" onClick={handleLogout}>
                <span className="material-icons">logout</span>
                <span>Đăng xuất</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="profile-main">
            {renderContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;