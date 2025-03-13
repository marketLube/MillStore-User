import React, { useEffect, useState } from "react";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import AddressModal from "../../components/cart/Addressmodal";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "../../hooks/queries/cart";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "sonner";

// Add this array of coupons
const availableCoupons = [
  {
    id: "MILL20",
    code: "MILL20",
    description: "Flat 20% off on ₹1999 and above.",
    terms: "Grab the deal now!",
    isHighlighted: true,
  },
  {
    id: "FREESHIP",
    code: "FREESHIP",
    description: "Free shipping on ₹799 and above.",
    terms: "Enjoy the savings!",
    isHighlighted: false,
  },
  {
    id: "FIRST50",
    code: "FIRST50",
    description: "₹50 off on your first order.",
    terms: "New users only!",
    isHighlighted: false,
  },
  {
    id: "TOOLS25",
    code: "TOOLS25",
    description: "25% off on all power tools.",
    terms: "Limited time offer!",
    isHighlighted: false,
  },
  {
    id: "EXTRA10",
    code: "EXTRA10",
    description: "Extra 10% off on orders above ₹2499.",
    terms: "T&C Apply",
    isHighlighted: false,
  },
  {
    id: "EXTRA10",
    code: "EXTRA10",
    description: "Extra 10% off on orders above ₹2499.",
    terms: "T&C Apply",
    isHighlighted: false,
  },
  {
    id: "EXTRA10",
    code: "EXTRA10",
    description: "Extra 10% off on orders above ₹2499.",
    terms: "T&C Apply",
    isHighlighted: false,
  },
  {
    id: "EXTRA10",
    code: "EXTRA10",
    description: "Extra 10% off on orders above ₹2499.",
    terms: "T&C Apply",
    isHighlighted: false,
  },
];

function Cartpage() {
  const [couponCode, setCouponCode] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { data: cartData, isLoading, error } = useCart();
  const { mutate: updateQuantity, isLoading: isUpdating } =
    useUpdateCartQuantity();
  const { mutate: removeFromCart, isLoading: isRemoving } = useRemoveFromCart();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Handle loading state
  if (isLoading) return <LoadingSpinner />;

  // Handle error state
  if (error) {
    throw error; // This will be caught by the ErrorBoundary in App.jsx
  }

  // Handle empty cart data
  if (!cartData?.data?.items.length) {
    return (
      <div className="cart-page">
        <div className="breadcrumb">
          <span>Home</span> / <span>Cart</span>
        </div>
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart to continue shopping</p>
        </div>
      </div>
    );
  }

  const cart = cartData.data.items;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.offerPrice * item.quantity,
    0
  );
  const deliveryCharges = 0;
  const gst = 0;
  const total = subtotal + deliveryCharges + Number(gst);

  // Add handlers for quantity updates
  const handleQuantityUpdate = (productId, variantId, action) => {
    updateQuantity(
      {
        productId,
        variantId,
        action,
      },
      {
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update quantity"
          );
        },
      }
    );
  };

  // Add handler for item removal
  const handleRemoveItem = (productId, variantId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeFromCart(
        { productId, variantId },
        {
          onError: (error) => {
            toast.error(
              error.response?.data?.message || "Failed to remove item"
            );
          },
        }
      );
    }
  };

  return (
    <div className="cart-page">
      <div className="breadcrumb">
        <span>Home</span> / <span>Cart</span>
      </div>

      <h1>
        Shopping Cart <span>({cart.length})</span>
      </h1>

      <div className="cart-container" data-aos="fade-up">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="item-image">
                <img src={item.product.mainImage} alt={item.product.name} />
              </div>

              <div className="item-details">
                <h3>{item.product.name}</h3>
                <div className="product-id">#{item.product._id}</div>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleQuantityUpdate(
                        item.product._id,
                        item.variant?._id,
                        "decrement"
                      )
                    }
                    disabled={isUpdating}
                  >
                    <FiMinus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityUpdate(
                        item.product._id,
                        item.variant?._id,
                        "increment"
                      )
                    }
                    disabled={isUpdating}
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              <div className="price-actions">
                <div className="item-price">₹ {item.offerPrice}</div>
                <button
                  className="remove-item"
                  onClick={() =>
                    handleRemoveItem(item.product._id, item.variant?._id)
                  }
                  disabled={isRemoving}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <div className="summary-details">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="summary-row discount">
              <span>Discount</span>
              <span className="orange-text">- ₹ 0</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>0</span>
            </div>
            <div className="summary-row">
              <span>GST</span>
              <span>+ ₹ {0}</span>
            </div>
            <div className="summary-row coupon-applied">
              <span>
                Coupon Discount <span className="coupon-code"></span>
              </span>
              <span className="orange-text">- ₹ 0</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
            <button
              className="proceed-btn"
              onClick={() => setIsAddressModalOpen(true)}
            >
              Proceed
            </button>
          </div>

          <div className="coupon-section">
            <h3>Apply Coupons & Save</h3>
            <div className="coupon-input">
              <input
                type="text"
                placeholder="Enter coupon code..."
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className="apply-btn">Apply</button>
            </div>
          </div>

          <div className="available-coupons">
            <div
              className="coupon-header"
              onClick={() => setShowCoupons(!showCoupons)}
            >
              <h3>Available Coupons</h3>
              {showCoupons ? (
                <FiChevronUp className="mobile-icon" />
              ) : (
                <FiChevronDown className="mobile-icon" />
              )}
            </div>
            <div className={`coupon-list ${showCoupons ? "show" : ""}`}>
              {availableCoupons.map((coupon) => (
                <div className="coupon-item" key={coupon.id}>
                  <label htmlFor={coupon.id}>
                    <div className="coupon-header">
                      <input type="radio" name="coupon" id={coupon.id} />
                      <strong>{coupon.code}</strong>
                    </div>
                    <p>{coupon.description}</p>
                    <p className="terms">{coupon.terms}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
}

export default Cartpage;
