import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import LoadingSpinner from "../../../components/LoadingSpinner";

function Trending() {
  const { data: response, isLoading, error } = useProducts({
    labelId: "67e3f8b437db8d10f8e5f341",
  });
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const trendingProducts = response?.data?.products || [];

  return (
    <section className="trending-container" data-aos="fade-up">
      <div className="trending-header">
        <h2>
          Trending <span>This Week</span>
        </h2>
      </div>

      <div className="trending-grid">
        {trendingProducts?.slice(0, 4).map((product) => (
          <Card key={product?._id} product={product} />
        ))}
      </div>

      <div className="trending-footer">
        <p>Don't miss out! Explore all trending styles</p>
        <Link to="/products">Shop all →</Link>
      </div>
    </section>
  );
}

export default Trending;
