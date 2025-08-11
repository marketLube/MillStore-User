import React, { useState, useEffect } from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "../../public/logo/footerLogo.svg";
import { useCategories } from "../hooks/queries/categories";
import { setCategory } from "../redux/features/category/categorySlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useSubscribe } from "../hooks/queries/user";
import ButtonLoadingSpinner from "./ButtonLoadingSpinners";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { toast } from "sonner";
import { useLabels } from "../hooks/queries/labels";

// URL-safe slug generator for category names (must match Header.jsx)
const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

function Footer() {
  const { data } = useCategories();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { mutate: subscribe, isPending } = useSubscribe();
  const {
    data: labelsData,
    isLoading: labelsLoading,
    error: labelsError,
  } = useLabels();
  const labels = labelsData?.envelop?.data || [];

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
    if (category === "all" || !category?._id) {
      dispatch(setCategory("all"));
      navigate("/products");
      return;
    }

    // Navigate to the category route so params drive the UI state
    dispatch(setCategory(category._id));
    const slug = slugify(category?.name);
    navigate(`/category/${slug}`);
    // navigate("/products", {
    //   state: {
    //     selectedCategory: {
    //       id: category._id,
    //       name: category.name,
    //     },
    //   },
    // });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone } = values;
    if (!name || !email || !phone) {
      toast.error("Please fill all the fields");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (name.trim().length < 3) {
      toast.error("Please enter a valid name");
      return;
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      toast.error("Full name should only contain letters and spaces");
      return;
    }
    setValues((prev) => ({ ...prev, name: name.trim() }));

    subscribe(values, {
      onSuccess: (response) => {
        toast.success("Subscribed successfully");
        setValues({
          name: "",
          email: "",
          phone: "",
        });
      },
      onError: (error) => {
        console.error("Subscription error:", error);
        toast.error(error?.response?.data?.message || error.message);
      },
    });
  };

  const handleLabelClick = (label) => {
    navigate("/products", {
      state: {
        selectedLabel: {
          id: label._id,
          name: label.name,
        },
      },
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              onWheel={(e) => e.target.blur()}
              onChange={(e) => setValues({ ...values, phone: e.target.value })}
              required
            />
            <button type="submit" onClick={handleSubmit} disabled={isPending}>
              {isPending ? <ButtonLoadingSpinner /> : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* <div className="footer-divider"></div> */}

      {/* Main Footer */}
      <div className="footer-main" style={{}}>
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
            <h4>Highlights</h4>
            <ul>
              {labels.map((label) => (
                <li key={label._id}>
                  <a onClick={() => handleLabelClick(label)}>{label.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="footer-section">
            <h4>Info</h4>
            <ul>
              <li>
                <Link
                  to="/about"
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollToTop()}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  style={{ cursor: "pointer" }}
                  to="/privacy-policy"
                  onClick={() => scrollToTop()}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  style={{ cursor: "pointer" }}
                  to="/terms"
                  onClick={() => scrollToTop()}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  style={{ cursor: "pointer" }}
                  to="/refund-policy"
                  onClick={() => scrollToTop()}
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  style={{ cursor: "pointer" }}
                  to="/contact"
                  onClick={() => scrollToTop()}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li className="address">
                Tradelines Millstore
                <br />
                <span>Delta Tower</span>
                <br />
                <span>Cherootty Road Opp Gandhi Park</span>
                <br />
                <span>Calicut - Kerala 673032</span>
              </li>
              {/* <li>
                Delta Tower{" "}
              </li>
              <li>Cherootty Road Opp Gandhi Park</li>
              <li>Calicut - Kerala 673032</li>*/}
              <li>
                <a
                  href="mailto:tradelinesmillstore1990@gmail.com"
                  className="footer-email"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <MdEmail className="contact-icon" />
                  tradelinesmillstore1990@gmail.com
                </a>
              </li>
              <li>
                <FaPhoneAlt className="contact-icon" /> 9562566880
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="social-links">
          {/* <span>
            <FaTwitter />
          </span>
          <span>
            <FaFacebookF />
          </span> */}
          <span
            onClick={() =>
              window.open(
                "https://www.instagram.com/tradelinesmillstore/",
                "_blank"
              )
            }
            style={{ cursor: "pointer" }}
          >
            <FaInstagram />
          </span>

          {/* <span>
            <FaYoutube />
          </span> */}
        </div>

        <p>© 2025 All rights reserved Mill Store </p>

        <div className="powered-by">
          <span>Powered by</span>
          <a
            href="https://www.instagram.com/marketlube/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Marketlube
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
