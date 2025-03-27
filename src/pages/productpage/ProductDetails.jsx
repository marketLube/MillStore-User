import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import {
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiHeart,
} from "react-icons/fi";
import { useProductById, useProducts } from "../../hooks/queries/products";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/error/ErrorFallback";
import { useAddToCart } from "../../hooks/queries/cart";
import ButtonLoadingSpinner from "../../components/ButtonLoadingSpinners";
import RatingModal from "./RatingModal";
import { reviewService } from "../../api/services/reviewService";
import { toast } from "sonner";

const CalculateDiscount = (price, offerPrice) => {
  const discount = ((price - offerPrice) / price) * 100;
  return Number.isInteger(discount) ? discount : discount.toFixed(2);
};

function ProductDetailsContent() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { id } = useParams();
  //api calls
  const { data: product, isLoading, error, refetch } = useProductById(id);
  const {
    data: response,
    isLoading: isLoadingProduct,
    error: errorProducts,
  } = useProducts();

  const { mutate: addToCart, isLoading: isAddingToCart } = useAddToCart();

  // Local state to track which button is loading
  const [loadingAction, setLoadingAction] = useState(null); // "buy" or "cart"
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    setSelectedVariant(null);

    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [product, id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const reviews = product.ratings;

  // const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);
  const visibleReviews = reviews;

  const handleAddToCart = (type) => {
    const productToAdd = {
      productId: product._id,
      variantId: selectedVariant?._id || null,
      quantity: 1,
    };

    setLoadingAction(type);
    addToCart(productToAdd, {
      onSuccess: () => {
        if (type === "buy") {
          navigate("/cart");
        }
      },
      onSettled: () => {
        setLoadingAction(null);
      },
    });
  };

  const handleSubmitReview = async (reviewData) => {
    console.log("Submitting review:", reviewData);
    const formData = new FormData();
    formData.append("rating", reviewData.rating);
    formData.append("review", reviewData.review);
    formData.append("image", reviewData.media);
    formData.append("productId", reviewData.productId);
    try {
      const response = await reviewService.createReview(formData);
      console.log(response);
      setIsRatingModalOpen(false);
      refetch();
      toast.success("Review submitted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="product-details">
      <div className="breadcrumb">
        <span>All products</span>
        <span>/</span>
        <span> {product?.category?.name} </span>
      </div>

      <div className="product-container">
        <div className="product-images">
          <div className="main-image">
            {/* <button className="wishlist-btn">
              <FiHeart />
            </button> */}
            <img
              src={
                selectedVariant ? selectedVariant.images[0] : product?.images[0]
              }
              alt={product?.name}
            />
          </div>
          <div className="thumbnail-images">
            {!selectedVariant?.images[0]
              ? product?.images?.map(
                  (image, index) =>
                    index > 0 && <img src={image} alt={product?.name} />
                )
              : selectedVariant?.images.map(
                  (image, index) =>
                    index > 0 && <img src={image} alt={product?.name} />
                )}
          </div>
        </div>

        <div className="product-info">
          <div className="header">
            <div className="brand">
              <img
                src={product?.brand?.image}
                alt={product?.brand?.name}
                className="brand-logo"
              />
              <span>{product?.brand?.name}</span>
            </div>
            <div className="actions">
              <span className="product-id"># {product?._id}</span>
              <button className="share-btn">
                <FiShare2 />
              </button>
            </div>
          </div>

          <h1 className="product-title">
            {selectedVariant
              ? selectedVariant?.attributes?.title
              : product?.name}
          </h1>

          <div className="rating-summary">
            <div className="stars">
              {"★".repeat(Math.floor(product?.averageRating))}
              {"☆".repeat(5 - Math.floor(product?.averageRating))}
            </div>
            <span className="rating">{product?.averageRating}</span>
            <span className="reviews">({product?.totalRatings} reviews)</span>
          </div>

          <div className="section description">
            <h3>Description</h3>
            <p>
              {selectedVariant
                ? selectedVariant?.attributes?.description
                : product?.description}
              {/* <button className="read-more">Read more</button> */}
            </p>
          </div>

          {/* <div className="section material">
            <h3>Material</h3>
            <div className="color-options">
              <button className="color-btn black"></button>
              <button className="color-btn brown"></button>
              <button className="color-btn beige"></button>
            </div>
          </div> */}

          {product?.variants.length > 0 && (
            <div className="section variants">
              <h3>Variants</h3>
              <div className="type-buttons">
                {product?.variants.map((variant) => (
                  <button
                    key={variant._id}
                    className={`type-btn ${
                      selectedVariant?._id === variant._id ? "active" : ""
                    }`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <div className="variant-image">
                      <img src={variant?.images[0]} alt={variant?.name} />
                    </div>
                    <div className="light-info">
                      <span>
                        {variant?.attributes?.title?.slice(0, 10)}
                        {variant?.attributes?.title?.length > 10 && "..."}
                      </span>
                      <span className="temp">₹{variant?.offerPrice}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="section price">
            <div className="price-info">
              <span className="current">
                ₹
                {selectedVariant
                  ? selectedVariant?.offerPrice
                  : product?.offerPrice}
              </span>
              <span className="original">
                ₹{selectedVariant ? selectedVariant?.price : product?.price}
              </span>
              <span className="discount">
                {CalculateDiscount(
                  selectedVariant ? selectedVariant?.price : product?.price,
                  selectedVariant
                    ? selectedVariant?.offerPrice
                    : product?.offerPrice
                )}
                % off
              </span>
            </div>
            <div className="buy-buttons">
              <button
                className="buy-now"
                onClick={() => handleAddToCart("buy")}
                disabled={loadingAction !== null}
              >
                {loadingAction === "buy" ? <ButtonLoadingSpinner /> : "Buy Now"}
              </button>
              <button
                className="add-cart"
                onClick={() => handleAddToCart("cart")}
                disabled={loadingAction !== null}
              >
                {loadingAction === "cart" ? (
                  <ButtonLoadingSpinner />
                ) : (
                  "Add To Cart"
                )}
              </button>
            </div>
          </div>

          <div className="section specifications">
            <h3>Product Specification</h3>
            <ul>
              <li>Uses only 10W power</li>
              <li>Brightness of 800 lumens</li>
              <li>Adjustable color temperature (3000K-6500K)</li>
              <li>Long lifespan of up to 50,000 hours</li>
              <li>Fits E27 base sockets</li>
            </ul>
          </div>

          <div className="section reviews">
            <div className="reviews-header">
              <h3>Ratings & Reviews</h3>
              <button
                className="rate-btn"
                onClick={() => setIsRatingModalOpen(true)}
              >
                Rate Product
              </button>
            </div>

            <div className="rating-container">
              {product?.totalRatings > 0 && (
                <div className="average-rating">
                  <div className="rating-value">
                    <span className="number">{product?.averageRating}</span>
                    <div className="stars">
                      {"★".repeat(Math.floor(product?.averageRating))}
                    </div>
                  </div>
                  <span className="total-reviews">
                    Based on {product?.totalRatings} reviews
                  </span>
                </div>
              )}

              {product?.totalRatings > 0 && (
                <div className="rating-stats">
                  <div className="rating-bar">
                    <span>5★</span>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${
                            (product?.ratingDistribution[5] /
                              product?.totalRatings) *
                              100 || 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span>({product?.ratingDistribution[5]})</span>
                  </div>
                  <div className="rating-bar">
                    <span>4★</span>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${
                            (product?.ratingDistribution[4] /
                              product?.totalRatings) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span>({product?.ratingDistribution[4]})</span>
                  </div>
                  <div className="rating-bar">
                    <span>3★</span>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${
                            (product?.ratingDistribution[3] /
                              product?.totalRatings) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span>({product?.ratingDistribution[3]})</span>
                  </div>
                  <div className="rating-bar">
                    <span>2★</span>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${
                            (product?.ratingDistribution[2] /
                              product?.totalRatings) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span>({product?.ratingDistribution[2]})</span>
                  </div>
                  <div className="rating-bar">
                    <span>1★</span>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${
                            (product?.ratingDistribution[1] /
                              product?.totalRatings) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span>({product?.ratingDistribution[1]})</span>
                  </div>
                </div>
              )}
            </div>

            {product?.totalRatings > 0 && (
              <div className="reviews-list">
                {visibleReviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <div className="user-info">
                        <img
                          src={
                            review.userId.image
                              ? review.userId.image
                              : "/images/user/profilepicture.jpg"
                          }
                          alt={review.userId?.username}
                          className="user-avatar"
                        />
                        <div className="user-details">
                          <span className="username">
                            {review.userId?.username}
                          </span>
                          <span className="date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="review-rating">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    <div className="review-image">
                      {review.image && (
                        <img
                          src={review.image}
                          alt={review.review}
                          style={{
                            width: "20%",
                            height: "20%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                    <p className="review-comment">{review.review}</p>
                  </div>
                ))}
                {reviews.length > 2 && (
                  <button
                    className="show-more"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Picks Section */}
      <div className="top-picks-section" data-aos="fade-up">
        <div className="section-header">
          <h2>
            Top Picks <span>For You</span>
          </h2>
          <div className="view-controls">
            <span className="view-all" onClick={()=>navigate("/products")}>View all</span>
            <div className="navigation-buttons">
              <button className="nav-btn prev" onClick={() => scroll("left")}>
                <FiChevronLeft />
              </button>
              <button className="nav-btn next" onClick={() => scroll("right")}>
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="products-slider" ref={sliderRef}>
          {response?.data?.products?.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      </div>

      <div className="mobile-fixed-buttons">
        <div className="buy-buttons">
          <button
            className="add-cart"
            onClick={() => handleAddToCart("add")}
            disabled={loadingAction !== null}
          >
            {loadingAction === "add" ? <ButtonLoadingSpinner /> : "Add To Cart"}
          </button>
          <button className="buy-now" onClick={() => handleAddToCart("buy")}>
            {loadingAction === "buy" ? <ButtonLoadingSpinner /> : "Buy Now"}
          </button>
        </div>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleSubmitReview}
        productId={product?._id}
      />
    </div>
  );
}

function ProductDetails() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.reload();
      }}
      onError={(error, info) => {
        // Log the error
        console.error("Error caught by boundary:", error, info);
      }}
    >
      <ProductDetailsContent />
    </ErrorBoundary>
  );
}

export default ProductDetails;
