import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Spin, InputNumber } from 'antd';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when available
      // const response = await getOrdersApi();
      // setOrders(response.data || []);
      
      // For now, load empty list
      setOrders([]);
    } catch (error) {
      console.error('Failed to load orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    form.setFieldsValue(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async (id) => {
    try {
      // TODO: Replace with actual API call
      // await deleteOrderApi(id);
      message.success('Xóa đơn hàng thành công');
      loadOrders();
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('Không thể xóa đơn hàng');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingOrder) {
        // TODO: Replace with actual API call
        // await updateOrderApi(editingOrder.id, values);
        message.success('Cập nhật đơn hàng thành công');
      } else {
        // TODO: Replace with actual API call
        // await createOrderApi(values);
        message.success('Thêm đơn hàng thành công');
      }
      setIsModalOpen(false);
      loadOrders();
    } catch (error) {
      console.error('Submit failed:', error);
      message.error('Không thể lưu đơn hàng');
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
    },
    {
      title: 'Số tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `${total?.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusColors = {
          'pending': '#ffc53d',
          'processing': '#1890ff',
          'shipped': '#52c41a',
          'delivered': '#13c2c2',
          'cancelled': '#ff4d4f'
        };
        const statusLabels = {
          'pending': 'Chờ xử lý',
          'processing': 'Đang xử lý',
          'shipped': 'Đã gửi',
          'delivered': 'Đã giao',
          'cancelled': 'Đã hủy'
        };
        return (
          <span style={{
            color: '#fff',
            backgroundColor: statusColors[status] || '#999',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {statusLabels[status] || status}
          </span>
        );
      }
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => handleEditOrder(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa đơn hàng"
            description="Bạn chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    return !search || 
           order.orderId?.toLowerCase().includes(search) ||
           order.customerName?.toLowerCase().includes(search) ||
           order.customerEmail?.toLowerCase().includes(search);
  });

  return (
    <Spin spinning={loading}>
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản Lý Đơn Hàng</h1>
          <Button type="primary" onClick={handleAddOrder}>
            Thêm Đơn Hàng
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Input
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Mã đơn hàng"
              name="orderId"
              rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tên khách hàng"
              name="customerName"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email khách hàng"
              name="customerEmail"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số tiền"
              name="total"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
            >
              <InputNumber min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Select.Option value="pending">Chờ xử lý</Select.Option>
                <Select.Option value="processing">Đang xử lý</Select.Option>
                <Select.Option value="shipped">Đã gửi</Select.Option>
                <Select.Option value="delivered">Đã giao</Select.Option>
                <Select.Option value="cancelled">Đã hủy</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày đặt hàng"
              name="orderDate"
              rules={[{ required: true, message: 'Vui lòng nhập ngày đặt hàng' }]}
            >
              <Input type="date" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default OrderManagement;