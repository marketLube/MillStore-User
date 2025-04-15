import React from "react";
import Animation from "../../components/paymentsuccessanimation/success.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="payment-success-container">
      <div className="payment-success-icon">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          fill="green"
          className="bi bi-check-circle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.08.022l3.992-4.99a.75.75 0 1 0-1.14-.976L7.475 9.584 5.383 7.492a.75.75 0 0 0-1.06 1.06l2.647 2.475z" />
        </svg> */}
        <Lottie
          animationData={Animation}
          style={{ height: "15rem", width: "15rem" }}
          autoplay={true}
          speed={1}
        />
      </div>
      <h2 className="payment-success-h2">Order Confirmed!</h2>
      <p className="payment-success-p">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      {/* <p>
        Order ID: <span>#2786a1s23</span>
      </p> */}
      <div className="payment-success-buttons">
        <button
          className="payment-success-view-orders payment-success-button"
          onClick={() => navigate("/profile?tab=order-history")}
        >
          View My Orders
        </button>
        <button
          className="payment-success-continue-shopping payment-success-button"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
