import React, { useState } from 'react';
import Header from '../../../ui/Header/Header';
import Footer from '../../../ui/Footer/Footer';
import ProductCard from '../../../ui/ProductCard/ProductCard';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock product data for search
  const allProducts = [
    {
      id: 1,
      name: 'Áo Thun Nam Basic Trắng',
      category: 'Áo thun',
      price: 350000,
      oldPrice: 450000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3jznDZz8l4yp3-VWQ1pgDZ9swRUd5feallVw5RJoOUVRHKKWKIp5PYG0o8gDDx5a2igLI5qXm3PLAedDs_zRh-pXVWKnZU6P2mFevYJV5Vf5WYoGeYsEqZLCj0RTTmA0hQd2BtTtEk0CubGO3J32ZxpwwuJ7jxePwICfVUvStuaqbz1BB1LuzVQ7dduiin4nQcZ4jG7Y0JceIQbGfhg2z2q3TEpSOJj5AVEEfD5TrlpgaOff-hNLpGbXAYrbNFFu2L9OIX7ZFNva0',
      link: '/product/1'
    },
    {
      id: 2,
      name: 'Quần Jean Nam Slim Fit',
      category: 'Quần jean',
      price: 450000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3jznDZz8l4yp3-VWQ1pgDZ9swRUd5feallVw5RJoOUVRHKKWKIp5PYG0o8gDDx5a2igLI5qXm3PLAedDs_zRh-pXVWKnZU6P2mFevYJV5Vf5WYoGeYsEqZLCj0RTTmA0hQd2BtTtEk0CubGO3J32ZxpwwuJ7jxePwICfVUvStuaqbz1BB1LuzVQ7dduiin4nQcZ4jG7Y0JceIQbGfhg2z2q3TEpSOJj5AVEEfD5TrlpgaOff-hNLpGbXAYrbNFFu2L9OIX7ZFNva0',
      link: '/product/2'
    },
    {
      id: 3,
      name: 'Giày Sneaker Nam',
      category: 'Giày',
      price: 650000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3jznDZz8l4yp3-VWQ1pgDZ9swRUd5feallVw5RJoOUVRHKKWKIp5PYG0o8gDDx5a2igLI5qXm3PLAedDs_zRh-pXVWKnZU6P2mFevYJV5Vf5WYoGeYsEqZLCj0RTTmA0hQd2BtTtEk0CubGO3J32ZxpwwuJ7jxePwICfVUvStuaqbz1BB1LuzVQ7dduiin4nQcZ4jG7Y0JceIQbGfhg2z2q3TEpSOJj5AVEEfD5TrlpgaOff-hNLpGbXAYrbNFFu2L9OIX7ZFNva0',
      link: '/product/3'
    },
    {
      id: 4,
      name: 'Áo Khoác Nam',
      category: 'Áo khoác',
      price: 550000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3jznDZz8l4yp3-VWQ1pgDZ9swRUd5feallVw5RJoOUVRHKKWKIp5PYG0o8gDDx5a2igLI5qXm3PLAedDs_zRh-pXVWKnZU6P2mFevYJV5Vf5WYoGeYsEqZLCj0RTTmA0hQd2BtTtEk0CubGO3J32ZxpwwuJ7jxePwICfVUvStuaqbz1BB1LuzVQ7dduiin4nQcZ4jG7Y0JceIQbGfhg2z2q3TEpSOJj5AVEEfD5TrlpgaOff-hNLpGbXAYrbNFFu2L9OIX7ZFNva0',
      link: '/product/4'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-page">
      <Header />

      <main className="search-main">
        <div className="container">
          {/* Search Header */}
          <div className="search-header">
            <h1>Tìm kiếm sản phẩm</h1>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="search-input"
                />
                <button type="submit" className="search-btn" disabled={isSearching}>
                  <span className="material-icons">
                    {isSearching ? 'hourglass_empty' : 'search'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Search Results */}
          <div className="search-results">
            {isSearching ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Đang tìm kiếm...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="results-header">
                  <p>Tìm thấy <strong>{searchResults.length}</strong> sản phẩm</p>
                </div>
                <div className="products-grid">
                  {searchResults.map(product => (
                    <ProductCard
                      key={product.id}
                      image={product.image}
                      alt={product.name}
                      category={product.category}
                      name={product.name}
                      currentPrice={`${product.price.toLocaleString()} ₫`}
                      oldPrice={product.oldPrice ? `${product.oldPrice.toLocaleString()} ₫` : null}
                      link={product.link}
                    />
                  ))}
                </div>
              </>
            ) : searchTerm && !isSearching ? (
              <div className="no-results">
                <div className="no-results-icon">
                  <span className="material-icons">search_off</span>
                </div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Không có sản phẩm nào phù hợp với từ khóa "<strong>{searchTerm}</strong>"</p>
                <div className="suggestions">
                  <h4>Gợi ý tìm kiếm:</h4>
                  <ul>
                    <li>Kiểm tra chính tả</li>
                    <li>Sử dụng từ khóa khác</li>
                    <li>Tìm kiếm theo danh mục sản phẩm</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="search-placeholder">
                <div className="placeholder-icon">
                  <span className="material-icons">search</span>
                </div>
                <h3>Bắt đầu tìm kiếm</h3>
                <p>Nhập tên sản phẩm hoặc danh mục để tìm kiếm</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;