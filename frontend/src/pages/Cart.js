import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight,
  FiTag, FiTruck, FiShield, FiChevronRight
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleUpdateQuantity = (id, change) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const newQty = item.quantity + change;
      if (newQty >= 1) {
        updateQuantity(id, newQty);
      }
    }
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 10, type: 'percent' });
      toast.success('Coupon applied: 10% off');
    } else if (couponCode.toLowerCase() === 'flat20') {
      setAppliedCoupon({ code: 'FLAT20', discount: 20, type: 'fixed' });
      toast.success('Coupon applied: $20 off');
    } else {
      toast.error('Invalid coupon code');
    }
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return (cartTotal * appliedCoupon.discount) / 100;
    }
    return appliedCoupon.discount;
  };

  const calculateTotal = () => {
    return cartTotal - calculateDiscount();
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
                      <span className="item-type product">Product</span>
                      <h3>
                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                      </h3>
                      <p className="seller">
                        by {item.seller}
                      </p>
                    </div>
                    <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="item-footer">
                    <div className="quantity-controls">
                      <button onClick={() => handleUpdateQuantity(item.id, -1)}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, 1)}>
                        <FiPlus />
                      </button>
                    </div>
                    <div className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
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
                <span>${cartTotal.toFixed(2)}</span>
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
