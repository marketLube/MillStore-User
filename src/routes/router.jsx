import { createBrowserRouter } from "react-router-dom";
import Userlayout from "../Layout/Userlayout";
import Homepage from "../pages/Homepage/Homepage";
import AllProducts from "../pages/productpage/Allproducts";
import ProductDetails from "../pages/productpage/ProductDetails";
import Profile from "../pages/profile/Profile";
import Cartpage from "../pages/cartpage/Cartpage";
import Login from "../pages/Loginpage/Login";
import Signup from "../pages/Signuppage/Signup";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Userlayout />,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/products",
        element: <AllProducts />,
      },
      {
        path: "/products/:id",
        element: <ProductDetails />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/cart",
        element: <Cartpage />,
      },
    ],
  },
]);

export default router;
