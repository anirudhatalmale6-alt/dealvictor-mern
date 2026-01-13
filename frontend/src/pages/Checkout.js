import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCreditCard, FiLock, FiChevronRight, FiCheck, FiMapPin,
  FiTruck, FiShield, FiArrowLeft
} from 'react-icons/fi';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Mock cart data
  const cartItems = [
    { id: 1, title: 'Wireless Bluetooth Headphones Pro', price: 79.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
    { id: 2, title: 'Smart Watch Series X', price: 199.99, quantity: 2, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    let value = e.target.value;

    if (e.target.name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }
    if (e.target.name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentInfo({ ...paymentInfo, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setLoading(true);
      // Simulate payment processing
      setTimeout(() => {
        setLoading(false);
        navigate('/order-confirmation/12345');
      }, 2000);
    }
  };

  return (
    <div className="checkout-page">
      {/* Progress Bar */}
      <div className="checkout-progress">
        <div className="container">
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="step-number">{step > 1 ? <FiCheck /> : '1'}</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <span className="step-number">3</span>
              <span className="step-label">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="checkout-layout">
          {/* Main Form */}
          <div className="checkout-form">
            <Link to="/cart" className="back-link">
              <FiArrowLeft /> Back to Cart
            </Link>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="form-section">
                  <h2><FiMapPin /> Shipping Information</h2>

                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country *</label>
                      <select
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        required
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>Germany</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-continue">
                    Continue to Payment <FiChevronRight />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="form-section">
                  <h2><FiCreditCard /> Payment Information</h2>

                  <div className="payment-methods">
                    <label className="payment-method active">
                      <input type="radio" name="paymentMethod" value="card" defaultChecked />
                      <FiCreditCard />
                      <span>Credit / Debit Card</span>
                    </label>
                  </div>

                  <div className="card-form">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Name on Card *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentInfo.expiry}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                    />
                    <span>Billing address same as shipping</span>
                  </label>

                  <div className="button-group">
                    <button type="button" className="btn-back" onClick={() => setStep(1)}>
                      <FiArrowLeft /> Back
                    </button>
                    <button type="submit" className="btn-pay" disabled={loading}>
                      {loading ? (
                        <span className="loading">Processing...</span>
                      ) : (
                        <>
                          <FiLock /> Pay ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="secure-notice">
                    <FiShield />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                    <span className="item-qty">{item.quantity}</span>
                  </div>
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="guarantees">
              <div className="guarantee">
                <FiTruck />
                <div>
                  <strong>Free Shipping</strong>
                  <span>3-5 business days</span>
                </div>
              </div>
              <div className="guarantee">
                <FiShield />
                <div>
                  <strong>Buyer Protection</strong>
                  <span>30-day money back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
