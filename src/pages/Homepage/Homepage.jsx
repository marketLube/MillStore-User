import React from "react";
import Header from "../../components/Header";
import Carousel from "../../components/Carousel";
import Clearance from "./components/Clearance";
import Bestseller from "./components/Bestseller";
import Offer from "./components/Offer";
import Trending from "./components/Trending";
import { useBanners } from "../../hooks/queries/Banner";

function Homepage() {
  const { allBanners, isLoading } = useBanners();
  return (
    <div>
      <Carousel data={allBanners?.filter((banner) => banner?.bannerFor === "hero")} isLoading={isLoading}  />
      <Clearance />
      <Bestseller />
      {/* <ProductBanner banners={allBanners?.filter((banner) => banner?.bannerFor === "product") } /> */}
      <Offer />
      <Trending />
    </div>
  );
}

export default Homepage;
