import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiStar, FiHeart, FiShare2, FiShoppingCart, FiMinus, FiPlus,
  FiCheck, FiTruck, FiShield, FiRefreshCw, FiChevronRight,
  FiMessageCircle, FiMapPin
} from 'react-icons/fi';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  // Mock product data
  const product = {
    id: 1,
    title: 'Wireless Bluetooth Headphones Pro - Premium Noise Cancelling',
    description: `Experience superior sound quality with our Wireless Bluetooth Headphones Pro. Featuring advanced Active Noise Cancellation technology, these headphones deliver crystal-clear audio while blocking out ambient noise.

Key Features:
• 40-hour battery life with quick charge capability
• Premium 40mm drivers for rich, detailed sound
• Comfortable over-ear design with memory foam cushions
• Foldable design for easy portability
• Multi-device connectivity via Bluetooth 5.0
• Built-in microphone for crystal-clear calls
• Touch controls for easy operation`,
    price: 79.99,
    originalPrice: 129.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'
    ],
    seller: {
      id: 1,
      name: 'TechStore',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.8,
      sales: 1234,
      verified: true,
      location: 'New York, USA',
      responseTime: '< 1 hour',
      memberSince: '2022'
    },
    rating: 4.5,
    reviews: 328,
    category: 'Electronics',
    subcategory: 'Headphones',
    stock: 50,
    sold: 1250,
    freeShipping: true,
    deliveryTime: '3-5 business days',
    specifications: [
      { label: 'Brand', value: 'AudioPro' },
      { label: 'Model', value: 'WH-1000XM5' },
      { label: 'Color', value: 'Black' },
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Battery Life', value: '40 hours' },
      { label: 'Driver Size', value: '40mm' },
      { label: 'Weight', value: '250g' },
      { label: 'Warranty', value: '1 Year' }
    ],
    tags: ['wireless', 'bluetooth', 'noise-cancelling', 'headphones']
  };

  const reviews = [
    {
      id: 1,
      user: { name: 'John D.', avatar: 'https://i.pravatar.cc/100?img=1' },
      rating: 5,
      date: '2024-01-10',
      title: 'Best headphones I ever owned!',
      comment: 'Amazing sound quality and the noise cancellation is top-notch. Battery lasts forever!',
      helpful: 24
    },
    {
      id: 2,
      user: { name: 'Sarah M.', avatar: 'https://i.pravatar.cc/100?img=2' },
      rating: 4,
      date: '2024-01-08',
      title: 'Great value for money',
      comment: 'Very comfortable for long listening sessions. Only minor issue is the carrying case could be better.',
      helpful: 18
    },
    {
      id: 3,
      user: { name: 'Mike R.', avatar: 'https://i.pravatar.cc/100?img=3' },
      rating: 5,
      date: '2024-01-05',
      title: 'Perfect for work from home',
      comment: 'The noise cancellation helps me focus during meetings. Crystal clear microphone quality too.',
      helpful: 12
    }
  ];

  const relatedProducts = [
    { id: 2, title: 'Wireless Earbuds Pro', price: 49.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300', rating: 4.6 },
    { id: 3, title: 'Premium Speaker', price: 89.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300', rating: 4.7 },
    { id: 4, title: 'USB-C Audio Adapter', price: 19.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', rating: 4.4 },
    { id: 5, title: 'Headphone Stand', price: 29.99, image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300', rating: 4.8 }
  ];

  const getDiscountPercent = () => Math.round((1 - product.price / product.originalPrice) * 100);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar key={i} className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'} />
    ));
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <Link to="/shop">Shop</Link>
          <FiChevronRight />
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
          <FiChevronRight />
          <span>{product.title.substring(0, 30)}...</span>
        </div>
      </div>

      <div className="container">
        <div className="product-main">
          {/* Product Images */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.title} />
              <div className="image-badges">
                <span className="discount-badge">-{getDiscountPercent()}%</span>
              </div>
              <button className="wishlist-btn"><FiHeart /></button>
            </div>
            <div className="thumbnail-list">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-badges-row">
              {product.freeShipping && <span className="badge badge-success">Free Shipping</span>}
              <span className="badge badge-info">{product.sold}+ Sold</span>
            </div>

            <h1 className="product-title">{product.title}</h1>

            <div className="product-meta">
              <div className="rating">
                <div className="stars">{renderStars(product.rating)}</div>
                <span className="rating-value">{product.rating}</span>
                <span className="review-count">({product.reviews} reviews)</span>
              </div>
              <button className="share-btn"><FiShare2 /> Share</button>
            </div>

            <div className="price-section">
              <span className="current-price">${product.price.toFixed(2)}</span>
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
              <span className="discount-tag">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><FiPlus /></button>
              </div>
              <span className="stock-info">{product.stock} available</span>
            </div>

            <div className="action-buttons">
              <button className="btn-add-cart">
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn-buy-now">
                Buy Now
              </button>
            </div>

            <div className="product-features">
              <div className="feature">
                <FiTruck />
                <div>
                  <strong>Free Delivery</strong>
                  <span>{product.deliveryTime}</span>
                </div>
              </div>
              <div className="feature">
                <FiShield />
                <div>
                  <strong>Secure Payment</strong>
                  <span>100% secure checkout</span>
                </div>
              </div>
              <div className="feature">
                <FiRefreshCw />
                <div>
                  <strong>Easy Returns</strong>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="seller-card">
              <div className="seller-header">
                <img src={product.seller.avatar} alt={product.seller.name} className="seller-avatar" />
                <div className="seller-info">
                  <h4>
                    {product.seller.name}
                    {product.seller.verified && <FiCheck className="verified-icon" />}
                  </h4>
                  <div className="seller-stats">
                    <span><FiStar /> {product.seller.rating}</span>
                    <span>{product.seller.sales} sales</span>
                  </div>
                </div>
                <Link to={`/store/${product.seller.id}`} className="visit-store-btn">Visit Store</Link>
              </div>
              <div className="seller-details">
                <span><FiMapPin /> {product.seller.location}</span>
                <span><FiMessageCircle /> Response: {product.seller.responseTime}</span>
              </div>
              <button className="contact-seller-btn">
                <FiMessageCircle /> Contact Seller
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={activeTab === 'specifications' ? 'active' : ''}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-description">
                <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                <div className="tags">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-specifications">
                <table>
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i}>
                        <td className="spec-label">{spec.label}</td>
                        <td className="spec-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                <div className="reviews-summary">
                  <div className="rating-big">
                    <span className="rating-number">{product.rating}</span>
                    <div className="stars">{renderStars(product.rating)}</div>
                    <span>{product.reviews} reviews</span>
                  </div>
                </div>
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <img src={review.user.avatar} alt={review.user.name} />
                        <div>
                          <h5>{review.user.name}</h5>
                          <div className="review-meta">
                            <div className="stars">{renderStars(review.rating)}</div>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <h4 className="review-title">{review.title}</h4>
                      <p>{review.comment}</p>
                      <button className="helpful-btn">Helpful ({review.helpful})</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map(item => (
              <Link to={`/product/${item.id}`} key={item.id} className="related-card">
                <div className="related-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="related-info">
                  <h4>{item.title}</h4>
                  <div className="related-meta">
                    <span className="price">${item.price}</span>
                    <span className="rating"><FiStar /> {item.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
