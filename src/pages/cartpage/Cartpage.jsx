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
import ConfirmationModal from "../../components/confirmationModal";
import { useNavigate } from "react-router-dom";
import {
  useApplyCoupon,
  useGetCoupons,
  useRemoveCoupon,
} from "../../hooks/queries/coupon";

function Cartpage() {
  const [couponCode, setCouponCode] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const { data: cartData, isLoading, error } = useCart();
  const { mutate: updateQuantity, isPending: isUpdating } =
    useUpdateCartQuantity();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: applyCoupon, isPending: isApplyingCoupon } = useApplyCoupon();
  const { mutate: removeCoupon, isPending: isRemovingCoupon } =
    useRemoveCoupon();

  const {
    data: couponsData,
    isLoading: isCouponsLoading,
    error: couponsError,
  } = useGetCoupons();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, [window.innerWidth]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (cartData?.data?.couponDetails) {
      setSelectedCoupon(cartData.data.couponDetails);
      setCouponCode(cartData.data.couponDetails.code);
    }
  }, [cartData?.data?.couponDetails]);

  if (
    isLoading ||
    isCouponsLoading ||
    isRemoving ||
    isUpdating ||
    isApplyingCoupon ||
    isRemovingCoupon
  )
    return <LoadingSpinner />;

  if (error) {
    throw error;
  }

  const cart = cartData?.data?.formattedCart?.items;
  const couponDetails = cartData?.data?.couponDetails;
  const availableCoupons = couponsData?.coupons;
  const subtotal = cartData?.data?.formattedCart?.subTotal;
  const deliveryCharges = cartData?.data?.deliveryCharges;
  const gst = 0;
  const total = cartData?.data?.finalAmount
    ? cartData?.data?.finalAmount
    : cartData?.data?.formattedCart?.totalPrice;

  const handleQuantityUpdate = (productId, variantId, action) => {
    if (
      action === "decrement" &&
      cart.find((item) => item.product._id === productId).quantity === 1
    ) {
      setItemToRemove({ productId, variantId });
      setShowConfirmModal(true);
      return;
    }
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

  const handleRemoveItem = (productId, variantId) => {
    setItemToRemove({ productId, variantId });
    setShowConfirmModal(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(
        {
          productId: itemToRemove.productId,
          variantId: itemToRemove.variantId,
        },
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

  const handleCouponSelect = (coupon) => {
    if (!Object.keys(couponDetails || {}).length) {
      setSelectedCoupon(coupon);
      setCouponCode(coupon.code);
    }
  };

  const handleApplyCoupon = () => {
    if (!selectedCoupon || selectedCoupon == null) {
      toast.error("Please select a coupon");
      return;
    }
    applyCoupon(selectedCoupon._id);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    setCouponCode("");
    removeCoupon();
  };

  if (!isLoading && !cartData?.data?.formattedCart?.items?.length) {
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

  return (
    <div className="cart-page">
      <div className="breadcrumb">
        <span>Home</span> / <span>Cart</span>
      </div>

      <h1>
        Shopping Cart <span>({cart?.length})</span>
      </h1>

      <div className="cart-container" data-aos="fade-up">
        <div className="cart-items">
          {cart?.map((item) => (
            <div key={item?.product?._id} className="cart-item">
              <div
                className="item-image"
                onClick={() => navigate(`/products/${item?.product?._id}`)}
              >
                <img
                  src={item?.product?.mainImage}
                  alt={
                    item?.product?.name.split("").length > 20
                      ? item?.product?.name.split("").slice(0, 20).join("") +
                        "..."
                      : item?.product?.name
                  }
                />
              </div>

              <div className="item-details">
                <h3>{item?.product?.name}</h3>
                <div className="product-id">#{item?.product?._id}</div>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleQuantityUpdate(
                        item?.product?._id,
                        item?.variant?._id,
                        "decrement"
                      )
                    }
                    disabled={isUpdating}
                  >
                    <FiMinus size={14} />
                  </button>
                  <span>{item?.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityUpdate(
                        item?.product?._id,
                        item?.variant?._id,
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
                <div className="item-price">₹ {item?.offerPrice}</div>
                <button
                  className="remove-item"
                  onClick={() =>
                    handleRemoveItem(item?.product?._id, item?.variant?._id)
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

            {Object.keys(couponDetails)?.length > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span className="orange-text">
                  - ₹ {couponDetails?.discountAmount}
                  {couponDetails?.discountType === "percentage" && (
                    <span className="discount-percentage">
                      (
                      {(
                        (couponDetails?.discountAmount /
                          couponDetails?.originalAmount) *
                        100
                      ).toFixed(0)}
                      %)
                    </span>
                  )}
                </span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>
                {deliveryCharges === 0 ? "Free" : `₹ ${deliveryCharges}`}
              </span>
            </div>

            <div className="summary-row">
              <span>GST</span>
              <span>+ ₹ {gst}</span>
            </div>

            {Object.keys(couponDetails)?.length > 0 && (
              <div className="summary-row coupon-applied">
                <span>
                  Coupon Applied{" "}
                  <span className="coupon-code">({couponDetails?.code})</span>
                </span>
                <div className="coupon-info">
                  <span className="savings">
                    You saved ₹{couponDetails?.savings}
                  </span>
                </div>
              </div>
            )}

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

          {availableCoupons.length > 0 && (
            <div className="coupon-section">
              <h3>Apply Coupons & Save</h3>
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Enter coupon code..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={couponDetails}
                />
                {Object.keys(couponDetails)?.length > 0 ? (
                  <button className="apply-btn" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                ) : (
                  <button
                    className="apply-btn"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode}
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </button>
                )}
              </div>
            </div>
          )}

          {availableCoupons.length > 0 && (
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
                {isMobile
                  ? showCoupons &&
                    availableCoupons?.map((coupon) => (
                      <div
                        className={`coupon-item ${
                          couponDetails?._id === coupon?._id ? "applied" : ""
                        }`}
                        key={coupon?._id}
                        onClick={() => handleCouponSelect(coupon)}
                        style={{
                          opacity:
                            Object.keys(couponDetails || {}).length > 0 &&
                            couponDetails?._id !== coupon?._id
                              ? 0.5
                              : 1,
                          cursor:
                            Object.keys(couponDetails || {}).length > 0 &&
                            couponDetails?._id !== coupon?._id
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <label htmlFor={coupon?._id}>
                          <div className="coupon-header">
                            <input
                              type="radio"
                              name="coupon"
                              id={coupon?._id}
                              checked={selectedCoupon?._id === coupon?._id}
                              onChange={() => handleCouponSelect(coupon)}
                              disabled={
                                Object.keys(couponDetails || {}).length > 0 &&
                                couponDetails?._id !== coupon?._id
                              }
                            />
                            <strong>{coupon?.code}</strong>
                            {couponDetails?._id === coupon?._id && (
                              <span className="applied-tag">Applied</span>
                            )}
                          </div>
                          <p>{coupon.description}</p>
                          <p className="terms">{coupon.terms}</p>
                        </label>
                      </div>
                    ))
                  : availableCoupons?.map((coupon) => (
                      <div
                        className={`coupon-item ${
                          couponDetails?._id === coupon?._id ? "applied" : ""
                        }`}
                        key={coupon?._id}
                        onClick={() => handleCouponSelect(coupon)}
                        style={{
                          opacity:
                            Object.keys(couponDetails || {}).length > 0 &&
                            couponDetails?._id !== coupon._id
                              ? 0.5
                              : 1,
                          cursor:
                            Object.keys(couponDetails || {}).length > 0 &&
                            couponDetails?._id !== coupon._id
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <label htmlFor={coupon?._id}>
                          <div className="coupon-header">
                            <input
                              type="radio"
                              name="coupon"
                              id={coupon?._id}
                              checked={selectedCoupon?._id === coupon?._id}
                              onChange={() => handleCouponSelect(coupon)}
                              disabled={
                                Object.keys(couponDetails || {}).length > 0 &&
                                couponDetails?._id !== coupon._id
                              }
                            />
                            <strong>{coupon?.code}</strong>
                            {couponDetails?._id === coupon?._id && (
                              <span className="applied-tag">Applied</span>
                            )}
                          </div>
                          <p>{coupon?.description}</p>
                          <p className="terms">{coupon?.terms}</p>
                        </label>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmRemoveItem}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        cancelText="Keep"
        type="danger"
      />
    </div>
  );
}
export default Cartpage;
