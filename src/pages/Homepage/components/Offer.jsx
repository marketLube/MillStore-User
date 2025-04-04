import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOfferBanner } from "../../../hooks/queries/offerBanner";

function Offer() {
  const { offerBanner, isLoading: offerBannerLoading, error: offerBannerError } = useOfferBanner();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSlideChange = (newIndex) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 500); // Match this with the CSS transition duration
  };

  // Update auto-sliding functionality with smooth transition
  useEffect(() => {
    if (offerBanner?.length > 1) {
      const timer = setInterval(() => {
        const newIndex = currentIndex === offerBanner.length - 1 ? 0 : currentIndex + 1;
        handleSlideChange(newIndex);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [offerBanner, currentIndex]);

  // Handle error state
  if (offerBannerError) return <div>Error loading offer banner</div>;

  // Handle case when offerBanner is empty or undefined
  if (!offerBanner?.length) return null;

  // Get the current banner
  const banner = offerBanner[currentIndex];
  const fullDescription = `${banner.description} Performance, And Exceptional Quality—All In One Solution.`;
  const shouldShowReadMore = fullDescription.length > 300;

  const displayedDescription = shouldShowReadMore && !isExpanded
    ? fullDescription.slice(0, 300) + '...'
    : fullDescription;

  return (
    <div className="offer-container" data-aos="fade-up">
      <div className={`offer-content ${isTransitioning ? 'slide-exit' : 'slide-enter'}`}>
        <div className="offer-text">
          <h2>{banner.title}</h2>
          <h3>{banner.subtitle}</h3>
          <p>
            {displayedDescription}
            {shouldShowReadMore && (
              <span
                className="read-more"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? ' Read Less' : ' Read More'}
              </span>
            )}
          </p>
          <div className="offer-tags">
            <span className="discount">Flat {banner.offerValue} {banner.offerType === "percentage" ? "%" : "₹"} Off</span>
            <span className="limited">{banner.subtitle}</span>
          </div>
          <Link to={banner.link} className="explore-btn">
            Explore
          </Link>
        </div>
        <div className="offer-image">
          <img src={banner.image} alt="offer banner" />
        </div>
      </div>

      {/* Add navigation dots if there are multiple banners */}
      {offerBanner.length > 1 && (
        <div className="slider-dots">
          {offerBanner.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Offer;
