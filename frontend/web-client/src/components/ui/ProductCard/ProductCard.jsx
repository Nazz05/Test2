import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({
  image,
  alt,
  category,
  name,
  currentPrice,
  oldPrice,
  badge,
  link = '#'
}) => {
  return (
    <Link to={link} className="product-card-link">
      <div className="product-card">
        <div className="product-image">
          {badge && (
            <span className={`badge ${badge.type}`}>
              {badge.text}
            </span>
          )}
          <img alt={alt} src={image} />
          <div className="product-actions">
            <button className="action-btn" onClick={(e) => e.preventDefault()}>
              <span className="material-icons">add_shopping_cart</span>
            </button>
          </div>
        </div>
        <div className="product-info">
          <h3>{category}</h3>
          <span className="product-name">{name}</span>
          <div className="product-price">
            <span className="current-price">{currentPrice}</span>
            {oldPrice && <span className="old-price">{oldPrice}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;