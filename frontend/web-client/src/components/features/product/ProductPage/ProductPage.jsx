import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import Header from '../../../ui/Header/Header';
import Footer from '../../../ui/Footer/Footer';
import ProductCard from '../../../ui/ProductCard/ProductCard';
import { getProductsByCategoryApi } from '../../../../api/product.api';
import './ProductPage.css';

const ProductPage = ({
  title,
  description,
  category,
  products = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả sản phẩm');
  const [priceRange, setPriceRange] = useState(1000000);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load products from API based on category
  useEffect(() => {
    loadProductsByCategory();
  }, [category]);

  const loadProductsByCategory = async () => {
    try {
      setLoading(true);
      const response = await getProductsByCategoryApi(category);
      setDisplayProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      message.error('Không thể tải sản phẩm');
      setDisplayProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Tất cả sản phẩm',
    'Áo Thun & Polo',
    'Sơ Mi',
    'Quần Khaki & Jean',
    'Phụ kiện'
  ];

  const colors = [
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#FFFFFF' },
    { name: 'gray', hex: '#D2B48C' },
    { name: 'blue', hex: '#003380' },
    { name: 'navy', hex: '#1e40af' }
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  const toggleColor = (colorName) => {
    setSelectedColors(prev =>
      prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="product-page">
      <Header />

      <main className="product-main">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Trang chủ</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{title}</span>
          </div>

          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">{title}</h1>
            <p className="page-description">{description}</p>
          </div>

          <div className="product-content">
            {/* Sidebar */}
            <aside className="product-sidebar">
              {/* Categories */}
              <div className="filter-section">
                <h3 className="filter-title">Danh mục</h3>
                <ul className="filter-list">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`filter-item ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h3 className="filter-title">Giá</h3>
                <div className="price-filter">
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="price-slider"
                  />
                  <div className="price-labels">
                    <span>0đ</span>
                    <span>{(priceRange / 1000).toFixed(0)}kđ</span>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="filter-section">
                <h3 className="filter-title">Màu sắc</h3>
                <div className="color-grid">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`color-option ${selectedColors.includes(color.name) ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => toggleColor(color.name)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="filter-section">
                <h3 className="filter-title">Kích thước</h3>
                <div className="size-grid">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSizes.includes(size) ? 'active' : ''}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="product-grid-section">
              {/* Sort and Results */}
              <div className="product-controls">
                <div className="results-count">
                  Hiển thị {displayProducts.length} sản phẩm
                </div>
                <div className="sort-options">
                  <select className="sort-select">
                    <option>Sắp xếp theo</option>
                    <option>Mới nhất</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                    <option>Bán chạy nhất</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="products-grid">
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    alt={product.alt}
                    category={product.category}
                    name={product.name}
                    currentPrice={product.currentPrice}
                    oldPrice={product.oldPrice}
                    badge={product.badge}
                    link={product.link}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button className="pagination-btn prev" disabled>
                  <span className="material-icons">chevron_left</span>
                  Trước
                </button>

                <div className="pagination-numbers">
                  <button className="pagination-number active">1</button>
                  <button className="pagination-number">2</button>
                  <button className="pagination-number">3</button>
                  <span className="pagination-dots">...</span>
                  <button className="pagination-number">10</button>
                </div>

                <button className="pagination-btn next">
                  Sau
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;