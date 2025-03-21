import React, { useState, useRef, useEffect } from "react";
import { FiHeart, FiShoppingCart, FiUser, FiSearch, FiX } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import {
  MdOutlineLocationOn,
  MdOutlineLocalShipping,
  MdOutlineHeadphones,
} from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../redux/features/user/userSlice";
import { useDispatch } from "react-redux";
export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleUserMenu = () => {
    if (isLoggedIn) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      navigate("/login");
    }
  };

  const handleMenuItemClick = (item) => {
    setIsUserMenuOpen(false);
    if (item === "logout") {
      localStorage.removeItem("user-auth-token");
      dispatch(logout());
      navigate("/login");
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="header">
        <Link to="/">
          <div className="header-logo">
            <img
              src={"/logo/logo.png"}
              alt="logo"
              className="header-logo-img"
            />
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="header-search desktop-search">
          <div className="search-container">
            <div className="category-dropdown">
              <IoIosArrowDown className="dropdown-icon" />
              <select
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
              >
                <option>All Categories</option>
                <option>Power & Hand Tools</option>
                <option>Gardening</option>
                <option>Home Care</option>
                <option>Home improvement</option>
                <option>Kitchen & Dining</option>
                <option>Car care</option>
                <option>Stationery</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="What are you looking for?"
              className="search-input"
            />
            <button className="search-button">
              <FiSearch className="search-icon" />
            </button>
          </div>
        </div>

        <div className="header-actions">
          {/* Mobile Search Icon */}
          <div className="header-actions-item mobile-search-icon">
            <FiSearch className="icon" onClick={toggleSearch} />
          </div>
          {/* <div className="header-actions-item">
            <FiHeart className="icon" />
          </div> */}
          <div
            className="header-actions-item user-menu-container"
            ref={userMenuRef}
          >
            <FiUser className="icon" onClick={toggleUserMenu} />

            {isUserMenuOpen && isLoggedIn && (
              <div className={`user-menu ${isUserMenuOpen ? "active" : ""}`}>
                <Link
                  to="/profile?tab=personal-info"
                  className="user-menu-header"
                  onClick={() => handleMenuItemClick("profile")}
                >
                  <div className="user-avatar">
                    <img src="/images/user/profilepicture.jpg" alt="User" />
                  </div>
                  <div className="user-info">
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                  </div>
                  <IoIosArrowForward className="arrow-icon" />
                </Link>

                <div className="user-menu-items">
                  <Link
                    to="/profile?tab=saved-address"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("saved-address")}
                  >
                    <MdOutlineLocationOn className="menu-icon" />
                    <span>Saved Address</span>
                  </Link>
                  <Link
                    to="/profile?tab=order-history"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("order-history")}
                  >
                    <MdOutlineLocalShipping className="menu-icon" />
                    <span>Order status</span>
                  </Link>
                  <Link
                    to="/profile?tab=help-support"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("help-support")}
                  >
                    <MdOutlineHeadphones className="menu-icon" />
                    <span>Help & support</span>
                  </Link>
                  <Link
                    to="/login"
                    className="menu-item logout"
                    onClick={() => handleMenuItemClick("logout")}
                  >
                    <BiLogOut className="menu-icon" />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="header-actions-item">
            <Link to="/cart">
              <FiShoppingCart className="icon" />
            </Link>
          </div>
        </div>

        <div
          className={`mobile-search-overlay ${isSearchOpen ? "active" : ""}`}
        >
          <div className="mobile-search-container">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="mobile-search-input"
            />
            <button className="mobile-search-close" onClick={toggleSearch}>
              <FiX className="icon" />
            </button>
          </div>
        </div>
      </header>
      <ul className="header-cat">
        <li>Power & Hand Tools</li>
        <li>Gardening</li>
        <li>Home Care</li>
        <li>Home improvement</li>
        <li>Kitchen & Dining</li>
        <li>Car care</li>
        <li>Stationery</li>
      </ul>
    </>
  );
}
