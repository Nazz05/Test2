import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../ui/Header/Header';
import Footer from '../../../ui/Footer/Footer';
import { useCart } from '../../../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const getShippingFee = () => {
    const subtotal = getCartTotal();
    return subtotal > 500000 ? 0 : 30000; // Miễn phí ship cho đơn > 500k
  };

  const getTotal = () => {
    return getCartTotal() + getShippingFee();
  };

  const handleCheckout = () => {
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <main className="cart-container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <span className="material-icons">shopping_cart</span>
            </div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <a href="/" className="continue-shopping-btn">
              Tiếp tục mua sắm
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />

      <main className="cart-container">
        <h1 className="cart-title">Giỏ Hàng Của Bạn</h1>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {/* Desktop Header */}
            <div className="cart-header">
              <div className="header-product">Sản phẩm</div>
              <div className="header-quantity">Số lượng</div>
              <div className="header-total">Tổng giá</div>
            </div>

            {/* Cart Items List */}
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-product">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-variant">Size: {item.size} | Màu: {item.color}</p>
                    <p className="item-price">{item.price.toLocaleString()} ₫</p>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                    >
                      <span className="material-icons">delete</span>
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  {(item.price * item.quantity).toLocaleString()} ₫
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Tóm tắt đơn hàng</h2>

            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{getCartTotal().toLocaleString()} ₫</span>
            </div>

            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>
                {getShippingFee() === 0 ? 'Miễn phí' : `${getShippingFee().toLocaleString()} ₫`}
              </span>
            </div>

            {getShippingFee() === 0 && (
              <p className="free-shipping-note">
                🎉 Miễn phí vận chuyển cho đơn hàng từ 500.000 ₫
              </p>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Tổng cộng:</span>
              <span className="total-amount">{getTotal().toLocaleString()} ₫</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Tiến hành thanh toán
            </button>

            <a href="/" className="continue-shopping-link">
              ← Tiếp tục mua sắm
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;