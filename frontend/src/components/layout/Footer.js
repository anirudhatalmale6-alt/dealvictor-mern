import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiMail, FiPhone, FiDownload, FiSmartphone } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              Deal<span>Victor</span>
            </Link>
            <p className="footer-desc">
              Your trusted marketplace for freelance services and quality products. Connect with talented professionals worldwide.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" className="social-link" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" className="social-link" aria-label="YouTube"><FiYoutube /></a>
            </div>

            {/* Mobile App Download */}
            <div className="app-download">
              <h5 className="app-title">Get the App</h5>
              <a href="/downloads/dealvictor-app.apk" className="app-download-btn android" download>
                <FiSmartphone className="app-icon" />
                <div className="app-text">
                  <span className="app-label">Download for</span>
                  <span className="app-platform">Android</span>
                </div>
                <FiDownload className="download-icon" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">For Clients</h4>
            <ul className="footer-links">
              <li><Link to="/how-it-works">How to Hire</Link></li>
              <li><Link to="/projects">Find Freelancers</Link></li>
              <li><Link to="/post-project">Post a Project</Link></li>
              <li><Link to="/services">Browse Services</Link></li>
              <li><Link to="/enterprise">Enterprise</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">For Freelancers</h4>
            <ul className="footer-links">
              <li><Link to="/how-it-works">How to Find Work</Link></li>
              <li><Link to="/projects">Browse Projects</Link></li>
              <li><Link to="/create-service">Create a Service</Link></li>
              <li><Link to="/membership">Membership Plans</Link></li>
              <li><Link to="/community">Community</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/shop/electronics">Electronics</Link></li>
              <li><Link to="/shop/fashion">Fashion</Link></li>
              <li><Link to="/sell">Become a Seller</Link></li>
              <li><Link to="/seller-center">Seller Center</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/trust-safety">Trust & Safety</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
            <div className="footer-contact">
              <p><FiMail /> support@dealvictor.com</p>
              <p><FiPhone /> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {new Date().getFullYear()} DealVictor. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
