import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useAuth } from '../../../../context/AuthContext';
import { getUserAddressesApi, createAddressApi, updateAddressApi, deleteAddressApi } from '../../../../api/address.api';
import './Address.css';

const Address = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    addressLine: '',
    ward: '',
    district: '',
    province: '',
    postalCode: '',
    isDefault: false,
    notes: ''
  });

  // Load addresses from API on component mount
  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await getUserAddressesApi(user.id);
      setAddresses(response.data || []);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      message.error('Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAddress) {
        // Update existing address
        await updateAddressApi(user.id, editingAddress.id, formData);
        message.success('Cập nhật địa chỉ thành công');
      } else {
        // Add new address
        await createAddressApi(user.id, formData);
        message.success('Thêm địa chỉ thành công');
      }
      
      // Reload addresses
      await loadAddresses();
      
      // Reset form
      setFormData({
        recipientName: '',
        phone: '',
        addressLine: '',
        ward: '',
        district: '',
        province: '',
        postalCode: '',
        isDefault: false,
        notes: ''
      });
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Failed to save address:', error);
      message.error('Lưu địa chỉ thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      recipientName: address.recipientName,
      phone: address.phone,
      addressLine: address.addressLine,
      ward: address.ward,
      district: address.district,
      province: address.province,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
      notes: address.notes
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      try {
        setLoading(true);
        await deleteAddressApi(user.id, id);
        message.success('Xóa địa chỉ thành công');
        await loadAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
        message.error('Xóa địa chỉ thất bại');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      recipientName: '',
      phone: '',
      addressLine: '',
      ward: '',
      district: '',
      province: '',
      postalCode: '',
      isDefault: false,
      notes: ''
    });
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSetDefault = async (id) => {
    try {
      setLoading(true);
      const address = addresses.find(addr => addr.id === id);
      if (address) {
        await updateAddressApi(user.id, id, {
          ...address,
          isDefault: true
        });
        message.success('Đặt làm địa chỉ mặc định thành công');
        await loadAddresses();
      }
    } catch (error) {
      console.error('Failed to set default address:', error);
      message.error('Cập nhật địa chỉ mặc định thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="content-header">
        <h2>Địa Chỉ Giao Hàng</h2>
        <p>Quản lý địa chỉ giao hàng của bạn</p>
      </div>

      {/* Address List */}
      <div className="addresses-section">
            <h2>Địa chỉ của bạn</h2>

            <div className="addresses-list">
              {addresses.map(address => (
                <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                  <div className="address-header">
                    <div className="address-info">
                      <h3>{address.recipientName}</h3>
                      <p className="phone">{address.phone}</p>
                      {address.isDefault && (
                        <span className="default-badge">Mặc định</span>
                      )}
                    </div>
                    <div className="address-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(address)}
                        disabled={loading}
                      >
                        <span className="material-icons">edit</span>
                        Chỉnh sửa
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(address.id)}
                        disabled={loading}
                      >
                        <span className="material-icons">delete</span>
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="address-details">
                    <p>{address.addressLine}</p>
                    <p>{address.ward}, {address.district}</p>
                    <p>{address.province}, {address.postalCode}</p>
                    {address.notes && <p className="notes">{address.notes}</p>}
                  </div>

                  {!address.isDefault && (
                    <div className="address-footer">
                      <button
                        className="set-default-btn"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Đặt làm mặc định
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showForm && (
              <button
                className="add-address-btn"
                onClick={() => setShowForm(true)}
              >
                <span className="material-icons">add</span>
                Thêm địa chỉ mới
              </button>
            )}
          </div>

      {/* Address Form */}
      {showForm && (
        <div className="address-form-section">
              <h2>{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h2>

              <form onSubmit={handleSubmit} className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="recipientName">Họ tên *</label>
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập họ tên"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập số điện thoại"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine">Địa chỉ *</label>
                  <input
                    type="text"
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập địa chỉ (số nhà, đường)"
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ward">Phường/Xã *</label>
                    <input
                      type="text"
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập phường/xã"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="district">Quận/Huyện *</label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập quận/huyện"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="province">Tỉnh/Thành phố *</label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tỉnh/thành phố"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Mã bưu chính *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập mã bưu chính"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Ghi chú</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Thêm ghi chú nếu cần"
                    rows="3"
                    disabled={loading}
                  />
                </div>

                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    disabled={loading}
                  />
                  <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : (editingAddress ? 'Cập nhật' : 'Lưu')}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
        )}
    </>
  );
};

export default Address;