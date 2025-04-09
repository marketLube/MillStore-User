import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useCategories } from "../hooks/queries/categories";
import { setCategory } from "../redux/features/category/categorySlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function Footer() {
  const { data } = useCategories();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = data?.envelop?.data;

  const handleCategoryClick = (category) => {
    dispatch(setCategory(category?._id || "all"));
    navigate("/products", {
      state: {
        selectedCategory: {
          id: category._id,
          name: category.name,
        },
      },
    });
  };

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
              {categories?.map((category) => (
                <li
                  onClick={() => handleCategoryClick(category)}
                  key={category._id}
                  style={{ cursor: "pointer" }}
                >
                  <span>{category.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>
                <span>About us</span>
              </li>
              <li>
                <span>Blog</span>
              </li>
              <li>
                <span>Gift vouchers</span>
              </li>
              <li>
                <span>Our policy</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>
                <span>Contact us</span>
              </li>
              <li className="address">
                123 Fashion Street,
                <br />
                Downtown Avenue, Mumbai,
                <br />
                India, 400001
              </li>
              <li>
                <span>Lorem@gmail.com</span>
              </li>
              <li>
                <span>Support & FAQ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="social-links">
          <span>
            <FaTwitter />
          </span>
          <span>
            <FaFacebookF />
          </span>
          <span>
            <FaInstagram />
          </span>
          <span>
            <FaYoutube />
          </span>
        </div>

        <p>© 2025 Lorem All rights reserved</p>

        <div className="legal-links">
          <span>Terms & Condition</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
