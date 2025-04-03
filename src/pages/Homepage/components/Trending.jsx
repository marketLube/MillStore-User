import React, { useRef } from "react";
import Card from "../../../components/Card";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { FiArrowRight as ViewAllIcon, FiArrowLeft, FiArrowRight } from "react-icons/fi";

function Trending() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const { data: response, isLoading, error } = useProducts({
    labelId: "67e3f8b437db8d10f8e5f341",
  });

  const handleViewAll = () => {
    navigate("/products", {
      state: { selectedLabel: { id: "67e3f8b437db8d10f8e5f341", name: "Trending" } }
    });
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth <= 768;

      const cardWidth = isMobile
        ? container.offsetWidth
        : (container.offsetWidth - 2 * 24) / 3;

      const currentScroll = container.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - cardWidth - 24
          : currentScroll + cardWidth + 24;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="trending-container">
        <div className="trending-header">
          <div className="trending-content">
            <h2 className="trending-content_h2">
              Trending <span className="trending-content_span">This Week</span>
            </h2>
          </div>
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
        <div className="trending-content">
          <h2 className="trending-content_h2">
            Trending <span className="trending-content_span">This Week</span>
          </h2>
        </div>
      </div>

      <div className="trending-products-wrapper">
        <button
          className="scroll-button scroll-left"
          onClick={() => scroll("left")}
        >
          <FiArrowLeft />
        </button>

        <div className="trending-products" ref={scrollContainerRef}>
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <Card key={product._id} product={product} />
            ))
          ) : (
            <div className="no-products">No trending products available</div>
          )}
        </div>

        <button
          className="scroll-button scroll-right"
          onClick={() => scroll("right")}
        >
          <FiArrowRight />
        </button>
      </div>

      <div className="trending-footer">
        <p>Don't miss out! Explore all trending styles</p>
        <Link to="/products" className="view-all">
          View All <ViewAllIcon />
        </Link>
      </div>
    </section>
  );
}

export default Trending;
