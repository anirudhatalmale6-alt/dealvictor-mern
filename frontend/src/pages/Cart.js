import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight,
  FiTag, FiTruck, FiShield, FiChevronRight
} from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      type: 'product',
      title: 'Wireless Bluetooth Headphones Pro',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
      seller: { name: 'TechStore', verified: true },
      price: 79.99,
      quantity: 1,
      stock: 50
    },
    {
      id: 2,
      type: 'product',
      title: 'Smart Watch Series X',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
      seller: { name: 'GadgetHub', verified: true },
      price: 199.99,
      quantity: 2,
      stock: 25
    },
    {
      id: 3,
      type: 'service',
      title: 'Professional Website Development',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200',
      seller: { name: 'Alex Johnson', verified: true },
      price: 350.00,
      package: 'Standard',
      deliveryDays: 14
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id && item.type === 'product') {
          const newQty = Math.max(1, Math.min(item.stock, item.quantity + change));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 10, type: 'percent' });
    } else if (couponCode.toLowerCase() === 'flat20') {
      setAppliedCoupon({ code: 'FLAT20', discount: 20, type: 'fixed' });
    } else {
      alert('Invalid coupon code');
    }
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();
    if (appliedCoupon.type === 'percent') {
      return (subtotal * appliedCoupon.discount) / 100;
    }
    return appliedCoupon.discount;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FiShoppingCart className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <Link to="/shop" className="btn-continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <span>Shopping Cart</span>
        </div>
      </div>

      <div className="container">
        <h1 className="page-title">Shopping Cart ({cartItems.length} items)</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-details">
                  <div className="item-header">
                    <div>
                      <span className={`item-type ${item.type}`}>
                        {item.type === 'product' ? 'Product' : 'Service'}
                      </span>
                      <h3>
                        <Link to={`/${item.type}/${item.id}`}>{item.title}</Link>
                      </h3>
                      <p className="seller">
                        by {item.seller.name}
                        {item.seller.verified && <span className="verified">✓</span>}
                      </p>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      <FiTrash2 />
                    </button>
                  </div>

                  {item.type === 'service' && (
                    <div className="service-info">
                      <span className="package">Package: {item.package}</span>
                      <span className="delivery">Delivery: {item.deliveryDays} days</span>
                    </div>
                  )}

                  <div className="item-footer">
                    {item.type === 'product' ? (
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                          <FiPlus />
                        </button>
                      </div>
                    ) : (
                      <div className="quantity-fixed">Qty: 1</div>
                    )}
                    <div className="item-price">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="summary-row discount">
                  <span>
                    Discount ({appliedCoupon.code})
                    <button onClick={removeCoupon} className="remove-coupon">×</button>
                  </span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
            </div>

            <div className="coupon-section">
              <div className="coupon-input">
                <FiTag />
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={applyCoupon}>Apply</button>
              </div>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn-checkout">
              Proceed to Checkout <FiArrowRight />
            </Link>

            <Link to="/shop" className="btn-continue">
              Continue Shopping
            </Link>

            <div className="trust-badges">
              <div className="badge">
                <FiShield />
                <span>Secure Checkout</span>
              </div>
              <div className="badge">
                <FiTruck />
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
