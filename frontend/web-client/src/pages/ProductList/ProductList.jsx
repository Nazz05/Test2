import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { message, Spin, Select, Input } from 'antd';
import Header from '../../components/ui/Header/Header';
import Footer from '../../components/ui/Footer/Footer';
import ProductCard from '../../components/ui/ProductCard/ProductCard';
import { getAllProductsApi, getProductsByCategoryApi, searchProductsApi } from '../../api/product.api';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let response;

      if (category === 'all') {
        response = await getAllProductsApi();
      } else {
        response = await getProductsByCategoryApi(category);
      }

      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await searchProductsApi(searchKeyword);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      message.error('Lỗi tìm kiếm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-list-page">
      <Header />
      <div className="container">
        <div className="filter-section">
          <div className="search-bar">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
            />
            <button onClick={handleSearch} className="search-btn">Tìm kiếm</button>
          </div>

          <div className="category-filter">
            <label>Danh mục:</label>
            <Select
              value={category}
              onChange={setCategory}
              style={{ width: 200 }}
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Áo nam', value: 'Nam' },
                { label: 'Áo nữ', value: 'Nu' },
                { label: 'Giày dép', value: 'Giay' },
                { label: 'Phụ kiện', value: 'Dep' },
              ]}
            />
          </div>
        </div>

        <Spin spinning={loading}>
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  category={product.type}
                  name={product.name}
                  currentPrice={`${product.price?.toLocaleString()}đ`}
                  oldPrice={product.oldPrice ? `${product.oldPrice.toLocaleString()}đ` : undefined}
                  link={`/product/${product.id}`}
                />
              ))
            ) : (
              <p className="no-products">Không tìm thấy sản phẩm nào</p>
            )}
          </div>
        </Spin>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
