import React, { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import { Link } from "react-router-dom";
function Bestseller() {
  const bestsellerProducts = [
    {
      id: 1,
      tag: "#1 Best Seller",
      title: "NoteMates Premium Spiral Notebook",
      description:
        "Premium quality, clean lines, and all-day comfort for an immersive learning experience.",
      image: "/images/bestseller/bestseller.png",
    },
    {
      id: 2,
      tag: "#2 Best Seller",
      title: "Professional Tool Kit",
      description:
        "Complete set of professional-grade tools for all your DIY needs.",
      image: "/images/bestseller/bestseller.png",
    },
    {
      id: 3,
      tag: "#3 Best Seller",
      title: "Garden Essential Set",
      description: "Everything you need for perfect garden maintenance.",
      image: "/images/bestseller/bestseller.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNavigation = (direction) => {
    if (direction === "prev") {
      setCurrentIndex((prev) =>
        prev === 0 ? bestsellerProducts.length - 1 : prev - 1
      );
    } else {
      setCurrentIndex((prev) =>
        prev === bestsellerProducts.length - 1 ? 0 : prev + 1
      );
    }
  };

  const currentProduct = bestsellerProducts[currentIndex];

  return (
    <div className="bestseller-container" data-aos="fade-up">
      <div className="bestseller-header">
        <h3>
          Our Best Sellers- <span>Loved By Thousands</span>
        </h3>
        <Link to="/products" className="view-all desktop-view-all">
          View All <ViewAllIcon />
        </Link>
      </div>
      <div className="bestseller-content">
        <div className="bestseller-image-wrapper">
          <div className="bestseller-image">
            <span className="tag">{currentProduct.tag}</span>
            <img
              src={currentProduct.image}
              alt={currentProduct.title}
              className="fade-image"
            />
          </div>
        </div>
        <div className="bestseller-info">
          <div className="bestseller-navigation">
            <button
              className="nav-button prev"
              onClick={() => handleNavigation("prev")}
            >
              <FiArrowLeft />
            </button>
            <button
              className="nav-button next"
              onClick={() => handleNavigation("next")}
            >
              <FiArrowRight />
            </button>
          </div>
          <h2 className="fade-text">{currentProduct.title}</h2>
          <p className="fade-text">{currentProduct.description}</p>
          <div className="buttons">
            <button className="add-to-cart">Add To Cart</button>
            <button className="buy-now">Buy Now</button>
          </div>
        </div>
      </div>
      <Link to="/products" className="view-all mobile-view-all">
        View All <ViewAllIcon />
      </Link>
    </div>
  );
}

export default Bestseller;
