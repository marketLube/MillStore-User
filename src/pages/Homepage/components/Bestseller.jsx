import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import { useAddToCart } from "../../../hooks/queries/cart";
import ButtonLoadingSpinner from "../../../components/ButtonLoadingSpinners";

function Bestseller() {
  // const bestsellerProducts = [
  //   {
  //     id: 1,
  //     tag: "#1 Best Seller",
  //     title: "NoteMates Premium Spiral Notebook",
  //     description:
  //       "Premium quality, clean lines, and all-day comfort for an immersive learning experience.",
  //     image: "/images/bestseller/bestseller.png",
  //   },
  //   {
  //     id: 2,
  //     tag: "#2 Best Seller",
  //     title: "Professional Tool Kit",
  //     description:
  //       "Complete set of professional-grade tools for all your DIY needs.",
  //     image: "/images/bestseller/bestseller.png",
  //   },
  //   {
  //     id: 3,
  //     tag: "#3 Best Seller",
  //     title: "Garden Essential Set",
  //     description: "Everything you need for perfect garden maintenance.",
  //     image: "/images/bestseller/bestseller.png",
  //   },
  // ];

  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // Local state to track which button is loading
  const [loadingAction, setLoadingAction] = useState(null); // "buy" or "add"

  const { data, isLoading, error } = useProducts({
    labelId: "67dd34fd6b3c047b3082abb5",
  });

  useEffect(() => {
    if (data?.data?.products) {
      setCurrentProduct(data?.data?.products[currentIndex]);
    }
  }, [data, currentIndex]);

  const bestsellerProducts = data?.data?.products || [];

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

  const handleAddToCart = (type) => {
    const productToAdd = {
      productId: currentProduct._id,
      variantId: currentProduct?.variants?.[0]?._id || null,
      quantity: 1,
    };

    setLoadingAction(type);
    addToCart(productToAdd, {
      onSettled: () => {
        setLoadingAction(null);
        if (type === "buy") {
          navigate("/cart");
        }
      },
    });
  };

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
            <span className="tag">{currentProduct?.label?.name}</span>
            <img
              src={currentProduct?.mainImage}
              alt={currentProduct?.name}
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
          <h2 className="fade-text">{currentProduct?.name}</h2>
          <p className="fade-text">{currentProduct?.description}</p>
          <div className="buttons">
            <button
              className="add-to-cart"
              onClick={() => handleAddToCart("add")}
              disabled={loadingAction !== null}
            >
              {loadingAction === "add" ? (
                <ButtonLoadingSpinner />
              ) : (
                "Add To Cart"
              )}
            </button>
            <button
              onClick={() => handleAddToCart("buy")}
              className="buy-now"
              disabled={loadingAction !== null}
            >
              {loadingAction === "buy" ? <ButtonLoadingSpinner /> : "Buy Now"}
            </button>
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
