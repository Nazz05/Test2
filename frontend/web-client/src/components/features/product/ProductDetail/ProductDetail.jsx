import React, { useState } from 'react';
import Header from '../../../ui/Header/Header';
import Footer from '../../../ui/Footer/Footer';
import { useCart } from '../../../../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('Trắng');
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: 1,
    name: 'Áo Thun Nam Basic Trắng',
    price: 350000,
    oldPrice: 450000,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3jznDZz8l4yp3-VWQ1pgDZ9swRUd5feallVw5RJoOUVRHKKWKIp5PYG0o8gDDx5a2igLI5qXm3PLAedDs_zRh-pXVWKnZU6P2mFevYJV5Vf5WYoGeYsEqZLCj0RTTmA0hQd2BtTtEk0CubGO3J32ZxpwwuJ7jxePwICfVUvStuaqbz1BB1LuzVQ7dduiin4nQcZ4jG7Y0JceIQbGfhg2z2q3TEpSOJj5AVEEfD5TrlpgaOff-hNLpGbXAYrbNFFu2L9OIX7ZFNva0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3jznDZz8l4yp3-VWQ1pgDZ9swRUd5feallVw5RJoOUVRHKKWKIp5PYG0o8gDDx5a2igLI5qXm3PLAedDs_zRh-pXVWKnZU6P2mFevYJV5Vf5WYoGeYsEqZLCj0RTTmA0hQd2BtTtEk0CubGO3J32ZxpwwuJ7jxePwICfVUvStuaqbz1BB1LuzVQ7dduiin4nQcZ4jG7Y0JceIQbGfhg2z2q3TEpSOJj5AVEEfD5TrlpgaOff-hNLpGbXAYrbNFFu2L9OIX7ZFNva0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3jznDZz8l4yp3-VWQ1pgDZ9swRUd5feallVw5RJoOUVRHKKWKIp5PYG0o8gDDx5a2igLI5qXm3PLAedDs_zRh-pXVWKnZU6P2mFevYJV5Vf5WYoGeYsEqZLCj0RTTmA0hQd2BtTtEk0CubGO3J32ZxpwwuJ7jxePwICfVUvStuaqbz1BB1LuzVQ7dduiin4nQcZ4jG7Y0JceIQbGfhg2z2q3TEpSOJj5AVEEfD5TrlpgaOff-hNLpGbXAYrbNFFu2L9OIX7ZFNva0'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Trắng', 'Đen', 'Xanh dương', 'Xanh lá'],
    description: 'Áo thun nam basic với thiết kế đơn giản, chất liệu cotton cao cấp, thoáng mát và dễ chịu khi mặc. Phù hợp cho mọi hoạt động hàng ngày.',
    features: [
      'Chất liệu: 100% cotton',
      'Form dáng: Regular fit',
      'Kiểu dáng: Trơn',
      'Xuất xứ: Việt Nam'
    ],
    reviews: [
      {
        id: 1,
        user: 'Nguyễn Văn A',
        rating: 5,
        comment: 'Áo rất đẹp và chất lượng tốt, sẽ ủng hộ shop dài dài!',
        date: '2024-01-10'
      },
      {
        id: 2,
        user: 'Trần Thị B',
        rating: 4,
        comment: 'Chất vải mềm mại, form dáng vừa vặn. Giao hàng nhanh.',
        date: '2024-01-08'
      }
    ]
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };

    addToCart(cartItem);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  return (
    <div className="product-detail-page">
      <Header />

      <main className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="/">Trang chủ</a>
          <span>/</span>
          <a href="/nam">Nam</a>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="product-main-img"
              />
            </div>
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-price">
              <span className="current-price">{product.price.toLocaleString()} ₫</span>
              {product.oldPrice && (
                <span className="old-price">{product.oldPrice.toLocaleString()} ₫</span>
              )}
              {product.oldPrice && (
                <span className="discount">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Color Selection */}
            <div className="product-option">
              <h3>Màu sắc: <span>{selectedColor}</span></h3>
              <div className="color-options">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`color-option ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="product-option">
              <h3>Kích cỡ: <span>{selectedSize}</span></h3>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <h3>Số lượng:</h3>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </button>
              <button className="buy-now-btn">
                Mua ngay
              </button>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <h3>Thông tin sản phẩm</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Description & Reviews */}
        <div className="product-tabs">
          <div className="tab-buttons">
            <button className="tab-btn active">Mô tả</button>
            <button className="tab-btn">Đánh giá ({product.reviews.length})</button>
          </div>

          <div className="tab-content">
            <div className="tab-panel active">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description}</p>
            </div>

            <div className="tab-panel">
              <h3>Đánh giá từ khách hàng</h3>
              <div className="reviews-list">
                {product.reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="review-user">{review.user}</span>
                      <div className="review-rating">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;