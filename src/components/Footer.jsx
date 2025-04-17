import React, { useState, useEffect } from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useCategories } from "../hooks/queries/categories";
import { setCategory } from "../redux/features/category/categorySlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSubscribe } from "../hooks/queries/user";
import ButtonLoadingSpinner from "./ButtonLoadingSpinners";
import { toast } from "sonner";
function Footer() {
  const { data } = useCategories();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { mutate: subscribe, isPending } = useSubscribe();

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (data?.envelop?.data) {
      setCategories(data?.envelop?.data);
    }
  }, [data]);

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

  const handleSubmit = (e) => {
    const { name, email, phone } = values;
    if (!name || !email || !phone) {
      toast.error("Please fill all the fields");
      return;
    }
    e.preventDefault();
    const response = subscribe(values);
    if (response) {
      setValues({
        name: "",
        email: "",
        phone: "",
      });
    }
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
            <input
              name="name"
              className="newsletter-content-form-input"
              type="text"
              placeholder="Full name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              required
            />
            <input
              name="email"
              className="newsletter-content-form-input"
              type="email"
              placeholder="Email address"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
            <input
              name="phone"
              className="newsletter-content-form-input"
              type="number"
              placeholder="Phone number"
              value={values.phone}
              onChange={(e) => setValues({ ...values, phone: e.target.value })}
              required
            />
            <button type="submit" onClick={handleSubmit} disabled={isPending}>
              {isPending ? <ButtonLoadingSpinner /> : "Submit"}
            </button>
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
              <li className="address">Tradelines Millstore</li>
              <li> Delta Tower </li>
              <li>Cherootty Road Opp Gandhi Park</li>
              <li>Calicut - Kerala 673032</li>
              {/* <li>Support & FAQ</li> */}
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

        <p>© 2025 Mill Store All rights reserved</p>

        <div className="legal-links">
          <span>Terms & Condition</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
