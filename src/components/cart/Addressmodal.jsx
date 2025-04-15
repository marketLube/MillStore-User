// export default AddressModal;
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUser } from "../../hooks/queries/user";
import { usePlaceOrder } from "../../hooks/queries/order";
import ButtonLoading from "../ButtonLoadingSpinners";
import { toast } from "sonner";
import userService from "../../api/services/userService";
import { setUser } from "../../redux/features/user/userSlice";
import apiClient from "../../api/client";
import { meta } from "@eslint/js";
import RenderRazorpay from "../Razorpay/RenderRazorpay";

const AddressModal = ({ isOpen, onClose, mode = "cart" }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    building: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
  });

  const [orderDetails, setOrderDetails] = useState({});
  const [displayRazorpay, setDisplayRazorpay] = useState(false);

  useEffect(() => {
    updatedUser();
  }, []);

  const updatedUser = async () => {
    const response = await userService.getAuthUser();
    dispatch(setUser(response.user));
  };

  const { mutate: updateUser, isPending } = useUpdateUser();
  const { mutate: placeOrder, isPending: isOrderPending } = usePlaceOrder();
  const savedAddresses = user?.address;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "saveAddress" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      building: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      saveAddress: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.building === "" ||
      formData.street === "" ||
      formData.city === "" ||
      formData.state === "" ||
      formData.pincode === ""
    ) {
      toast.warning("Please fill all the fields");
      return;
    }

    const updatedUser = {
      ...user,
      address: formData,
    };
    updateUser(updatedUser);
    setFormData({
      fullName: user?.username,
      building: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      saveAddress: false,
    });
    onClose();
  };

  // const handlePlaceOrder = () => {
  //   const { fullName, building, street, city, state, pincode } = formData;

  //   if (
  //     Object.keys(selectedAddress).length > 0 ||
  //     (fullName && building && street && city && state && pincode)
  //   ) {
  //     const address = selectedAddress ? selectedAddress : formData;
  //     apiClient
  //       .post("/order/paymentIntent")
  //       .then((res) => {
  //         console.log(res);

  //         const options = {
  //           key: "rzp_test_VKMWLG1gaizZiV",
  //           amount: res.data.amount,
  //           currency: "INR",
  //           name: "Mill Store",
  //           description: "Test Transaction",
  //           order_id: res.data.id,
  //           theme: {
  //             color: "#ffb64a",
  //           },
  //         };

  //         const rzp = new Razorpay(options);

  //         rzp.on("payment.success", function (response) {
  //           console.log(response, "trigger");
  //           const paymentData = {
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_signature: response.razorpay_signature,
  //           };

  //           apiClient
  //             .post("/order/paymentVerify", paymentData)
  //             .then((res) => {
  //               console.log("Payment verified:", res.data);
  //             })
  //             .catch((err) => {
  //               console.log("Verification failed:", err);
  //             });
  //         });
  //         rzp.open();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

  //     // placeOrder(address);
  //   } else {
  //     toast.warning(
  //       "Please select an address or fill in all required fields.",
  //       {
  //         position: "top-right",
  //       }
  //     );
  //   }
  // };

  const handlePlaceOrder = async (paymentMethod = "razorpay") => {
    try {
      const { fullName, building, street, city, state, pincode } = formData;

      if (
        Object.keys(selectedAddress).length > 0 ||
        (fullName && building && street && city && state && pincode)
      ) {
        if (paymentMethod == "razorpay") {
          const response = await apiClient.post(`/order/paymentIntent`);

          if (response && response.data.order_id) {
            setOrderDetails({
              orderId: response.data.order_id,
              currency: response.data.currency,
              amount: response.data.amount,
            });
            setDisplayRazorpay(true);
          }
        } else {
          const response = await apiClient.post(`/order/placeOrder`, {
            selectedAddress,
            paymentMethod,
          });
        }
      } else {
        toast.warning(
          "Please select an address or fill in all required fields.",
          {
            position: "top-right",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`address-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Address</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {mode === "cart" ? (
            <>
              <h3>Where Should We Deliver?</h3>
              <p className="subtitle">
                Enter your address or select a saved one to ensure a smooth and
                timely delivery.
              </p>

              {savedAddresses?.map((addr) => (
                <label key={addr?._id} className="address-option">
                  <input
                    type="checkbox"
                    name="address"
                    value={addr?._id}
                    checked={selectedAddress === addr?._id}
                    onChange={() => {
                      if (selectedAddress === addr?._id) {
                        setSelectedAddress("");
                      } else {
                        setSelectedAddress(addr?._id);
                      }
                      resetForm();
                    }}
                  />
                  <div className="address-details">
                    <strong>{addr?.fullName}</strong>
                    <p>{addr?.building}</p>
                    <p>{addr?.street}</p>
                    <p>{addr?.landmark}</p>
                    <p>{addr?.city}</p>
                    <p>{addr?.state}</p>
                    <p>{addr?.pincode}</p>
                  </div>
                </label>
              ))}

              <div className="divider">or</div>
            </>
          ) : (
            <>
              <h3>Add a New Delivery Address</h3>
              <p className="subtitle">
                Enter your address details to ensure accurate delivery and
                seamless service
              </p>
            </>
          )}

          <h3 className="manual-entry-title">Enter address</h3>

          {
            <form className="address-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={Object.keys(selectedAddress).length > 0}
              />
              <input
                type="text"
                name="building"
                placeholder="House/Apartment Name"
                value={formData.building}
                onChange={handleInputChange}
                disabled={Object.keys(selectedAddress).length > 0}
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleInputChange}
                disabled={Object.keys(selectedAddress).length > 0}
              />
              <input
                type="text"
                name="landmark"
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChange={handleInputChange}
                disabled={Object.keys(selectedAddress).length > 0}
              />
              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
              </div>
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                disabled={Object.keys(selectedAddress).length > 0}
              />
            </form>
          }
        </div>

        {mode === "cart" ? (
          <div className="modal-footer">
            <label className="save-address">
              <input
                type="checkbox"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleInputChange}
                disabled={user?.address?.length >= 3}
              />
              {user?.address?.length >= 3
                ? "You can only save 3 addresses go to profile to delete some"
                : "Save this address for future purchases"}
            </label>
            <button
              className="proceed-btn"
              disabled={isOrderPending}
              onClick={() => handlePlaceOrder("razorpay")}
            >
              {isOrderPending ? <ButtonLoading /> : <span>Place Order</span>}
            </button>
          </div>
        ) : (
          <div className="modal-footer">
            <button
              className="save-btn"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? <ButtonLoading /> : <span>Save Address</span>}
            </button>
          </div>
        )}
      </div>

      {displayRazorpay && (
        <RenderRazorpay
          orderId={orderDetails.orderId}
          keyId={import.meta.env.VITE_RAZORPAY_KEY_ID}
          keySecret={import.meta.env.VITE_RAZORPAY_KEY_SECRET}
          currency={orderDetails.currency}
          amount={orderDetails.amount}
          address={selectedAddress ? selectedAddress : formData}
          setDisplayRazorpay={setDisplayRazorpay}
        />
      )}
    </div>
  );
};

export default AddressModal;
