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

  const handlePlaceOrder = () => {
    const { fullName, building, street, city, state, pincode } = formData;

    if (
      Object.keys(selectedAddress).length > 0 ||
      (fullName && building && street && city && state && pincode)
    ) {
      const address = selectedAddress ? selectedAddress : formData;
      apiClient
        .post("/payment/create-order", {
          amount: 2000,
        })
        .then((res) => {
          console.log(res);

          const options = {
            key: "rzp_test_VKMWLG1gaizZiV", // Replace with your Razorpay key_id
            amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            order_id: res.data.id, // This is the order_id created in the backend
            // callback_url: "http://localhost:3000/payment-success", // Your success URL
            prefill: {
              name: "Gaurav Kumar",
              email: "gaurav.kumar@example.com",
              contact: "9999999999",
            },
            theme: {
              color: "#F37254",
            },
          };

          const rzp = new Razorpay(options);
          rzp.open();
        })
        .catch((err) => {
          console.log(err);
        });

      // placeOrder(address);
    } else {
      toast.warning(
        "Please select an address or fill in all required fields.",
        {
          position: "top-right",
        }
      );
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
                    <p>{addr?.street}</p>
                    <p>{addr?.city}</p>
                    <p>{addr?.state}</p>
                    <p>{addr?.landmark}</p>
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
              onClick={handlePlaceOrder}
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
    </div>
  );
};

export default AddressModal;
