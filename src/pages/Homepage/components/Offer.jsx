import React from "react";
import { Link } from "react-router-dom";
import { useOfferBanner } from "../../../hooks/queries/offerBanner";

function Offer() {
  const { offerBanner, isLoading: offerBannerLoading, error: offerBannerError } = useOfferBanner();
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Handle loading state
  if (offerBannerLoading) return <div>Loading...</div>;

  // Handle error state
  if (offerBannerError) return <div>Error loading offer banner</div>;

  // Handle case when offerBanner is empty or undefined
  if (!offerBanner?.[0]) return null;

  // Get the first banner from the array
  const banner = offerBanner[0];
  const fullDescription = `${banner.description} Performance, And Exceptional Quality—All In One Solution.`;
  const shouldShowReadMore = fullDescription.length > 300;

  const displayedDescription = shouldShowReadMore && !isExpanded
    ? fullDescription.slice(0, 300) + '...'
    : fullDescription;

  return (
    <div className="offer-container" data-aos="fade-up">
      <div className="offer-content">
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
    </div>
  );
}

export default Offer;
