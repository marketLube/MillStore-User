import React from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Card({ product }) {
  if (!product) return null;

  const {
    mainImage,
    category,
    name,
    offerPrice,
    price,
    averageRating,
    discount,
    width,
    height,
    _id,
  } = product;

  const navigate = useNavigate();

if(!mainImage || !name || !category || !offerPrice || !price || !averageRating) return null;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${_id}`)}>
      <div className="product-card_image">
        {discount && <span className="discount-tag">{discount}</span>}
        <img src={mainImage} alt={name} />
        {/* <button className="wishlist-btn">
          <FiHeart />
        </button> */}
      </div>
      <div className="product-card_content">
        <span className="category">{category.name}</span>
        <h3 className="title">{name}</h3>
        <div className="price">
          <span className="current-price">₹{offerPrice}</span>
          <span className="original-price">₹{price}</span>
        </div>
        <div className="rating">
          {"★".repeat(Math.floor(averageRating))}
          {"☆".repeat(5 - Math.floor(averageRating))}
          <span className="rating-number">{averageRating}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
