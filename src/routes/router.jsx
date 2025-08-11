import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/error/ErrorFallback";
import Userlayout from "../Layout/Userlayout";
import Homepage from "../pages/Homepage/Homepage";
import AllProducts from "../pages/productpage/Allproducts";
import ProductDetails from "../pages/productpage/ProductDetails";
import Profile from "../pages/profile/Profile";
import Cartpage from "../pages/cartpage/Cartpage";
import Login from "../pages/Loginpage/Login";
import Signup from "../pages/Signuppage/Signup";
import ProtectedRoute from "../components/route/ProtectedRoute";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import { Verification } from "../pages/OTP/Verification";
import About from "../pages/About/About";
import PrivacyPolicy from "../pages/About/PrivacyPolicy";
import Terms from "../pages/About/Terms";
import RefundPolicy from "../pages/About/RefundPolicy";
import Contact from "../pages/About/Contact";
const error = new Error("Page Not Found", { cause: 404 });

// Create a wrapper component for ErrorBoundary
const WithErrorBoundary = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      window.location.reload();
    }}
    onError={(error, info) => {
      console.error("Error caught by boundary:", error, info);
    }}
  >
    {children}
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Userlayout />,
    errorElement: <ErrorFallback error={error} />,
    children: [
      // {
      //   path: "/signup",
      //   element: (
      //     <WithErrorBoundary>
      //       <Signup />
      //     </WithErrorBoundary>
      //   ),
      // },
      {
        path: "/login",
        element: (
          <WithErrorBoundary>
            <Login />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/otp",
        element: (
          <WithErrorBoundary>
            <Verification />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/",
        element: (
          <WithErrorBoundary>
            <Homepage />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/products",
        element: (
          <WithErrorBoundary>
            <AllProducts />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/products/:id",
        element: (
          <WithErrorBoundary>
            <ProductDetails />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/profile",
        element: (
          <WithErrorBoundary>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </WithErrorBoundary>
        ),
      },
      {
        path: "/cart",
        element: (
          <WithErrorBoundary>
            <ProtectedRoute>
              <Cartpage />
            </ProtectedRoute>
          </WithErrorBoundary>
        ),
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/about",
        element: (
          <WithErrorBoundary>
            <About />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <WithErrorBoundary>
            <PrivacyPolicy />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/terms",
        element: (
          <WithErrorBoundary>
            <Terms />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/refund-policy",
        element: (
          <WithErrorBoundary>
            <RefundPolicy />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/contact",
        element: (
          <WithErrorBoundary>
            <Contact />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/category/:id",
        element: (
          <WithErrorBoundary>
            <AllProducts />
          </WithErrorBoundary>
        ),
      },
    ],
  },
]);

export default router;
