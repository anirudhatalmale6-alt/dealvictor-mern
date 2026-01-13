import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiCheck, FiPackage, FiTruck, FiHome, FiMapPin, FiClock,
  FiMessageCircle, FiDownload, FiChevronRight, FiStar
} from 'react-icons/fi';
import './OrderTracking.css';

const OrderTracking = () => {
  const { orderId } = useParams();

  // Mock order data
  const order = {
    id: orderId || 'ORD-2024-12345',
    status: 'shipped', // pending, confirmed, shipped, delivered
    createdAt: '2024-01-10',
    estimatedDelivery: 'Jan 15-17, 2024',
    shippingMethod: 'Standard Shipping',
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    items: [
      {
        id: 1,
        title: 'Wireless Bluetooth Headphones Pro',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150',
        price: 79.99,
        quantity: 1,
        seller: 'TechStore'
      },
      {
        id: 2,
        title: 'Smart Watch Series X',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150',
        price: 199.99,
        quantity: 2,
        seller: 'GadgetHub'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
      phone: '+1 (555) 123-4567'
    },
    payment: {
      method: 'Credit Card',
      last4: '4242',
      subtotal: 479.97,
      shipping: 0,
      tax: 38.40,
      total: 518.37
    },
    timeline: [
      { status: 'placed', label: 'Order Placed', date: 'Jan 10, 2024 - 10:30 AM', completed: true },
      { status: 'confirmed', label: 'Order Confirmed', date: 'Jan 10, 2024 - 11:45 AM', completed: true },
      { status: 'shipped', label: 'Shipped', date: 'Jan 12, 2024 - 2:15 PM', completed: true, current: true },
      { status: 'out_for_delivery', label: 'Out for Delivery', date: 'Expected Jan 15-17', completed: false },
      { status: 'delivered', label: 'Delivered', date: '', completed: false }
    ]
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed': return <FiCheck />;
      case 'confirmed': return <FiPackage />;
      case 'shipped': return <FiTruck />;
      case 'out_for_delivery': return <FiMapPin />;
      case 'delivered': return <FiHome />;
      default: return <FiCheck />;
    }
  };

  return (
    <div className="order-tracking-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <Link to="/dashboard">My Orders</Link>
          <FiChevronRight />
          <span>Order {order.id}</span>
        </div>
      </div>

      <div className="container">
        <div className="order-header">
          <div className="order-title">
            <h1>Order #{order.id}</h1>
            <span className={`status-badge ${order.status}`}>
              {order.status === 'shipped' ? 'Shipped' : order.status}
            </span>
          </div>
          <div className="order-actions">
            <button className="btn-secondary"><FiDownload /> Invoice</button>
            <button className="btn-primary"><FiMessageCircle /> Contact Seller</button>
          </div>
        </div>

        <div className="order-layout">
          {/* Main Content */}
          <div className="order-main">
            {/* Tracking Timeline */}
            <div className="tracking-card">
              <h2>Tracking Status</h2>
              <div className="timeline">
                {order.timeline.map((step, index) => (
                  <div
                    key={index}
                    className={`timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                  >
                    <div className="step-icon">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="step-content">
                      <h4>{step.label}</h4>
                      <span>{step.date || 'Pending'}</span>
                    </div>
                    {index < order.timeline.length - 1 && <div className="step-line"></div>}
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <div className="tracking-info">
                  <div className="tracking-row">
                    <span>Carrier</span>
                    <strong>{order.carrier}</strong>
                  </div>
                  <div className="tracking-row">
                    <span>Tracking Number</span>
                    <strong>{order.trackingNumber}</strong>
                  </div>
                  <a href="#" className="track-link">Track Package on {order.carrier} →</a>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="items-card">
              <h2>Order Items ({order.items.length})</h2>
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p className="seller">Sold by: {item.seller}</p>
                      <p className="qty">Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="item-actions">
                      <Link to={`/product/${item.id}`} className="btn-sm">View Product</Link>
                      {order.status === 'delivered' && (
                        <button className="btn-sm btn-review"><FiStar /> Review</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="order-sidebar">
            {/* Delivery Info */}
            <div className="info-card">
              <h3><FiMapPin /> Shipping Address</h3>
              <div className="address">
                <strong>{order.shippingAddress.name}</strong>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="phone">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="info-card">
              <h3><FiClock /> Estimated Delivery</h3>
              <p className="estimate">{order.estimatedDelivery}</p>
              <span className="shipping-method">{order.shippingMethod}</span>
            </div>

            {/* Payment Summary */}
            <div className="info-card">
              <h3>Payment Summary</h3>
              <div className="payment-details">
                <div className="payment-row">
                  <span>Payment Method</span>
                  <span>{order.payment.method} ****{order.payment.last4}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="payment-row">
                  <span>Subtotal</span>
                  <span>${order.payment.subtotal.toFixed(2)}</span>
                </div>
                <div className="payment-row">
                  <span>Shipping</span>
                  <span className="free">Free</span>
                </div>
                <div className="payment-row">
                  <span>Tax</span>
                  <span>${order.payment.tax.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="payment-row total">
                  <span>Total</span>
                  <span>${order.payment.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="info-card help-card">
              <h3>Need Help?</h3>
              <p>Have questions about your order?</p>
              <button className="btn-help"><FiMessageCircle /> Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
