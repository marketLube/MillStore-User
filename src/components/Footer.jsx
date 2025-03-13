import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter">
        <div className="newsletter-content">
          <div className="newsletter-content-text">
            <h2>Stay Exclusive</h2>
            <h3>Early Access & Special Offers!</h3>
            <p>
              Join our newsletter, stay ahead with the latest trends and <br />
              exclusive deals—straight to your inbox!
            </p>
          </div>
          <div className="newsletter-content-form">
            <input type="text" placeholder="Full name" />
            <input type="email" placeholder="Email address" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* Main Footer */}
      <div className="footer-main">
        {/* Brand Section */}
        <div className="footer-brand">
          <img src={Logo} alt="Mill Store Logo" />
        </div>

        <div className="footer-links-group">
          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li>
                <a href="/men">Men</a>
              </li>
              <li>
                <a href="/women">Women</a>
              </li>
              <li>
                <a href="/kids">Kids</a>
              </li>
              <li>
                <a href="/accessories">Accessories</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/about">About us</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/gift-vouchers">Gift vouchers</a>
              </li>
              <li>
                <a href="/policy">Our policy</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="/contact">Contact us</a>
              </li>
              <li className="address">
                123 Fashion Street,
                <br />
                Downtown Avenue, Mumbai,
                <br />
                India, 400001
              </li>
              <li>
                <a href="mailto:Lorem@gmail.com">Lorem@gmail.com</a>
              </li>
              <li>
                <a href="/support">Support & FAQ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="social-links">
          <a href="#">
            <FaTwitter />
          </a>
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaYoutube />
          </a>
        </div>

        <p>© 2025 Lorem All rights reserved</p>

        <div className="legal-links">
          <a href="/terms">Terms & Condition</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
