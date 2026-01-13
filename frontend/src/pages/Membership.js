import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCheck, FiX, FiStar, FiZap, FiShield, FiAward,
  FiTrendingUp, FiUsers, FiMessageCircle, FiDollarSign
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Membership.css';

const Membership = () => {
  const [billingCycle, setBillingCycle] = useState('annual');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: <FiUsers />,
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      bidsPerMonth: 10,
      features: [
        { text: '10 bids per month', included: true },
        { text: 'Basic profile', included: true },
        { text: 'Standard support', included: true },
        { text: '10% platform fee', included: true },
        { text: 'Featured listings', included: false },
        { text: 'Priority support', included: false },
        { text: 'Analytics dashboard', included: false },
        { text: 'Verified badge', included: false },
        { text: 'Unlimited proposals', included: false }
      ],
      popular: false,
      color: 'gray'
    },
    {
      id: 'starter',
      name: 'Starter',
      icon: <FiZap />,
      description: 'For active freelancers',
      monthlyPrice: 19,
      annualPrice: 149,
      bidsPerMonth: 50,
      features: [
        { text: '50 bids per month (auto-recharge)', included: true },
        { text: 'Enhanced profile', included: true },
        { text: 'Email support', included: true },
        { text: '7% platform fee', included: true },
        { text: '2 featured listings/month', included: true },
        { text: 'Priority support', included: false },
        { text: 'Basic analytics', included: true },
        { text: 'Verified badge', included: false },
        { text: 'Unlimited proposals', included: false }
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <FiStar />,
      description: 'Most popular for professionals',
      monthlyPrice: 49,
      annualPrice: 399,
      bidsPerMonth: 150,
      features: [
        { text: '150 bids per month (auto-recharge)', included: true },
        { text: 'Premium profile', included: true },
        { text: 'Priority email & chat support', included: true },
        { text: '5% platform fee', included: true },
        { text: '10 featured listings/month', included: true },
        { text: 'Priority support', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Pro badge', included: true },
        { text: 'Unlimited proposals', included: false }
      ],
      popular: true,
      color: 'purple'
    },
    {
      id: 'business',
      name: 'Business',
      icon: <FiAward />,
      description: 'For agencies & top sellers',
      monthlyPrice: 99,
      annualPrice: 799,
      bidsPerMonth: 'Unlimited',
      features: [
        { text: 'Unlimited bids (auto-recharge)', included: true },
        { text: 'VIP profile with badge', included: true },
        { text: '24/7 dedicated support', included: true },
        { text: '3% platform fee', included: true },
        { text: 'Unlimited featured listings', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Full analytics suite', included: true },
        { text: 'Top Rated badge', included: true },
        { text: 'Unlimited proposals', included: true }
      ],
      popular: false,
      color: 'gold'
    }
  ];

  const benefits = [
    {
      icon: <FiTrendingUp />,
      title: 'Monthly Auto-Recharge',
      description: 'Your bid balance automatically refills every month throughout your subscription'
    },
    {
      icon: <FiShield />,
      title: 'Lower Platform Fees',
      description: 'Save more on every project with reduced commission rates'
    },
    {
      icon: <FiMessageCircle />,
      title: 'Priority Support',
      description: 'Get faster responses and dedicated help when you need it'
    },
    {
      icon: <FiDollarSign />,
      title: 'Featured Visibility',
      description: 'Stand out with featured listings and verified badges'
    }
  ];

  const faqs = [
    {
      question: 'How does the monthly bid recharge work?',
      answer: 'Every month, your bid balance is automatically refilled to your plan\'s limit. For example, Pro plan members receive 150 bids refreshed on their billing date each month throughout their annual subscription.'
    },
    {
      question: 'What happens when my subscription expires?',
      answer: 'Your subscription will automatically renew after one year. You\'ll receive a reminder email 7 days before renewal. You can cancel anytime from your account settings.'
    },
    {
      question: 'Can I upgrade my plan mid-subscription?',
      answer: 'Yes! You can upgrade anytime. We\'ll prorate the remaining time on your current plan and apply it to your new plan.'
    },
    {
      question: 'Do unused bids roll over?',
      answer: 'Unused bids expire at the end of each monthly cycle. We recommend using your bids strategically to maximize opportunities.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support for a full refund.'
    }
  ];

  const getPrice = (plan) => {
    if (billingCycle === 'annual') {
      return plan.annualPrice;
    }
    return plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return 0;
    const annualMonthly = plan.annualPrice / 12;
    const savings = ((plan.monthlyPrice - annualMonthly) / plan.monthlyPrice) * 100;
    return Math.round(savings);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    if (planId === 'free') {
      toast.info('You are already on the Free plan');
    } else {
      toast.success(`${plans.find(p => p.id === planId).name} plan selected! Proceed to checkout.`);
    }
  };

  return (
    <div className="membership-page">
      {/* Header */}
      <div className="membership-header">
        <div className="container">
          <h1>Choose Your Membership</h1>
          <p>Unlock powerful features to grow your business on DealVictor</p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
            <button
              className={`toggle-switch ${billingCycle === 'annual' ? 'annual' : ''}`}
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            >
              <span className="toggle-knob"></span>
            </button>
            <span className={billingCycle === 'annual' ? 'active' : ''}>
              Annual <span className="save-badge">Save up to 35%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
            >
              {plan.popular && <span className="popular-badge">Most Popular</span>}

              <div className={`plan-icon ${plan.color}`}>
                {plan.icon}
              </div>

              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>

              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">{getPrice(plan)}</span>
                <span className="period">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
              </div>

              {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                <div className="plan-savings">
                  Save {getSavings(plan)}% with annual billing
                </div>
              )}

              <div className="bids-info">
                <span className="bids-count">
                  {plan.bidsPerMonth === 'Unlimited' ? '∞' : plan.bidsPerMonth}
                </span>
                <span className="bids-label">bids/month</span>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className={feature.included ? 'included' : 'excluded'}>
                    {feature.included ? <FiCheck className="check" /> : <FiX className="cross" />}
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                className={`select-plan-btn ${plan.id === 'free' ? 'free' : ''}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.id === 'free' ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2>Why Upgrade to Premium?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div className="benefit-card" key={index}>
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to grow your business?</h2>
            <p>Join thousands of successful freelancers and businesses on DealVictor</p>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={() => handleSelectPlan('pro')}>
                Start with Pro
              </button>
              <Link to="/contact" className="btn btn-outline">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Membership;
