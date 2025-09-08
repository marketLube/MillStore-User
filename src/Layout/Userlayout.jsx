import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";

function Userlayout() {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    const checkFooterVisibility = () => {
      const isCartPage = location.pathname === "/cart";
      const isMobile = window.innerWidth <= 768;
      setShowFooter(!(isCartPage && isMobile));
    };

    // Check initially
    checkFooterVisibility();

    // Check on window resize
    window.addEventListener("resize", checkFooterVisibility);

    // Cleanup
    return () => window.removeEventListener("resize", checkFooterVisibility);
  }, [location]);

  // Ensure no lingering scroll locks or modal classes remain on route change
  // useEffect(() => {
  //   document.body.classList.remove("modal-open");
  //   document.body.style.overflow = "unset";
  // }, [location]);

  return (
    <div>
      <Header />
      <Outlet />
      {showFooter && <Footer />}
    </div>
  );
}

export default Userlayout;
