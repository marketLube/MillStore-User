import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import AddressModal from "../../components/cart/Addressmodal";

const SavedAddress = () => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const addresses = [
    {
      id: 1,
      label: "Address 1",
      name: "Michael Philip",
      address: "Greenview Residency, Flat 302, MG Road,",
      area: "Koramangala, Near Forum Mall, Bengaluru,",
      state: "Karnataka",
      pincode: "560095",
    },
  ];

  return (
    <div className="saved-address-section">
      <h2>Your Saved Address</h2>
      <p className="subtitle">
        Manage your saved addresses for faster and hassle-free checkouts. Add,
        edit, or remove addresses anytime!
      </p>

      <div className="addresses-grid">
        {addresses.map((addr) => (
          <div key={addr.id} className="address-card">
            <div className="card-header">
              <span className="address-label">{addr.label}</span>
              <button className="delete-btn">
                <FiTrash2 />
              </button>
            </div>
            <div className="address-info">
              <h3>{addr.name}</h3>
              <p>{addr.address}</p>
              <p>{addr.area}</p>
              <p>
                {addr.state} - {addr.pincode}
              </p>
            </div>
          </div>
        ))}

        <button
          className="add-address-card"
          onClick={() => setIsAddressModalOpen(true)}
        >
          <div className="plus-icon">+</div>
          <span>Add new address</span>
        </button>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        mode="profile"
      />
    </div>
  );
};

export default SavedAddress;
