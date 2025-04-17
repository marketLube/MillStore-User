import React from "react";

const collections = [
  { image: "images/product/product.png", offer: "50%" },
  { image: "images/product/product.png", offer: "10%" },
  { image: "images/product/product.png", offer: "50%" },
  { image: "images/product/product.png", offer: "55%" },
  { image: "images/product/product.png", offer: "50%" },
  { image: "images/product/product.png", offer: "40%" },
];

function TrendingCollection() {
  return (
    <div className="trending-collections">
      <h2>Trending Collections</h2>
      <div className="collections-grid">
        {collections.map((collection, index) => (
          <div className="collection-item" key={index}>
            <img src={collection.image} alt={`Collection ${index + 1}`} />
            <div className="offer-tag">Up to {collection.offer} OFF</div>
            <button className="shop-now-btn">Shop Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingCollection;
