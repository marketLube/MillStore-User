import React from "react";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import LoadingSpinner from "../../../components/LoadingSpinner";

function Trending() {
  const { data: response, isLoading, error } = useProducts({
    labelId: "67e3f8b437db8d10f8e5f341",
  });

  // Show loading spinner in the same container to prevent layout shifts
  if (isLoading) {
    return (
      <section className="trending-container">
        <div className="trending-header">
          <h2>
            Trending <span>This Week</span>
          </h2>
        </div>
        <div className="trending-grid">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="trending-container">
        <div className="trending-header">
          <h2>
            Trending <span>This Week</span>
          </h2>
        </div>
        <div className="error-message">Error: {error.message}</div>
      </section>
    );
  }

  const trendingProducts = response?.data?.products || [];

  return (
    <section className="trending-container" data-aos="fade-up">
      <div className="trending-header">
        <h2>
          Trending <span>This Week</span>
        </h2>
      </div>

      {trendingProducts.length > 0 ? (
        <div className="trending-grid">
          {trendingProducts.slice(0, 4).map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-products">No trending products available</div>
      )}

      <div className="trending-footer">
        <p>Don't miss out! Explore all trending styles</p>
        <Link to="/products">Shop all →</Link>
      </div>
    </section>
  );
}

export default Trending;
