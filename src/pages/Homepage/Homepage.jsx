import React from "react";
import Header from "../../components/Header";
import Carousel from "../../components/Carousel";
import Clearance from "./components/Clearance";
import Bestseller from "./components/Bestseller";
import Offer from "./components/Offer";
import Trending from "./components/Trending";
import Footer from "../../components/Footer";
import ProductBanner from "../../components/banner/ProductBanner";
import { useBanners } from "../../hooks/queries/Banner";
const data = [
  {
    image: "/images/carousel/carousel-1.jpg",
    alt: "carousel-1",
    heading: `Strength in Every Tool.
     in Every Task.`,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    image: "/images/carousel/carousel-1.jpg",
    alt: "carousel-2",
    heading: "The Best Tools for the Job",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    image: "/images/carousel/carousel-1.jpg",
    alt: "carousel-3",
    heading: "The Best Tools for the Job",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

function Homepage() {
  const { allBanners, isLoading, error } = useBanners();
  console.log(allBanners);
  return (
    <div>
      <Carousel data={allBanners?.filter((banner) => banner?.bannerFor === "hero")} />
      <Clearance />
      <Bestseller />
      {/* <ProductBanner banners={allBanners?.filter((banner) => banner?.bannerFor === "product") } /> */}
      <Offer />
      <Trending />
    </div>
  );
}

export default Homepage;
