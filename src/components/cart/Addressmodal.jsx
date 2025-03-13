import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const AddressModal = ({ isOpen, onClose, mode = "cart" }) => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    building: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const savedAddresses = [
    {
      id: 1,
      name: "Michael Philip",
      address:
        "Greenview Residency, Flat 302, XID Road, Koramangala, Near Forum Mall, Bengaluru, Karnataka - 560095",
    },
    {
      id: 2,
      name: "Michael Philip",
      address:
        "Bluewater Villa, House No. 12, Sector 45, Golf Course Road, Gurgaon, Haryana - 122003",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle address saving logic here
    onClose();
  };

  const handleWhatsAppRedirect = () => {
    // Get the selected or manually entered address
    const deliveryAddress = selectedAddress
      ? savedAddresses.find((addr) => addr.id === selectedAddress)?.address
      : `${formData.building}, ${formData.street}, ${formData.landmark}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

    // Format the message
    const message = `
    *New Order*
    ------------------
    *Delivery Address:*
    ${deliveryAddress}`;

    const encodedMessage = encodeURIComponent(message);

    // Replace with your business phone number
    const phoneNumber = "918714441727"; // Format: country code + phone number

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, "_blank");
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

              {savedAddresses.map((addr) => (
                <label key={addr.id} className="address-option">
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                  />
                  <div className="address-details">
                    <strong>{addr.name}</strong>
                    <p>{addr.address}</p>
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

          <form className="address-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="building"
              placeholder="House/Apartment Name"
              value={formData.building}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark (Optional)"
              value={formData.landmark}
              onChange={handleInputChange}
            />
            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
            />
          </form>
        </div>

        {mode === "cart" ? (
          <div className="modal-footer">
            <label className="save-address">
              <input type="checkbox" />
              Save this address for future purchases
            </label>
            <button className="proceed-btn" onClick={handleWhatsAppRedirect}>
              <FaWhatsapp />
              Place Order
            </button>
            <p className="terms">
              You will be notified via SMS/WhatsApp to confirm your purchase
            </p>
          </div>
        ) : (
          <div className="modal-footer">
            <button className="save-btn" onClick={handleSubmit}>
              Save Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressModal;
