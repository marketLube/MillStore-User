import React from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Card({ product }) {
  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const {
    mainImage,
    category,
    name,
    offerPrice,
    price,
    averageRating = 0,
    discount,
    _id,
  } = product;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${_id}`)}>
      <div className="product-card_image">
        {discount && <span className="discount-tag">{discount}</span>}
        <img src={mainImage} alt={name} />
      </div>
      <div className="product-card_content">
        <span className="category-name">{category.name}</span>
        <h3 className="title">
          {name.split("").length > 15
            ? name.split("").slice(0, 15).join("") + "..."
            : name}
        </h3>
        <div className="price">
          <span className="current-price">₹{offerPrice}</span>
          <span className="original-price">₹{price}</span>
        </div>
        {averageRating !== null && averageRating !== undefined && (
          <div className="rating">
            {"★".repeat(Math.floor(averageRating))}
            {"☆".repeat(5 - Math.floor(averageRating))}
            <span className="rating-number">{averageRating}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
