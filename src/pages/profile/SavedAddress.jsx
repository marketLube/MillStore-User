import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import AddressModal from "../../components/cart/Addressmodal";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import userService from "../../api/services/userService";

const SavedAddress = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleDeleteAddress = async (id) => {
    try {
      console.log('Current addresses:', user.address);
      console.log('Trying to delete address with ID:', id);

      // Make sure we're working with the correct ID format
      const addressId = typeof id === 'string' ? id : id.toString();

      const updatedAddresses = user.address.filter(addr =>
        addr._id.toString() !== addressId
      );
      console.log('Filtered addresses:', updatedAddresses);

      // Ensure we're sending the complete address objects
      const response = await userService.updateUser({
        address: updatedAddresses.map(addr => ({
          fullName: addr.fullName,
          houseApartmentName: addr.houseApartmentName,
          street: addr.street,
          landmark: addr.landmark,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          _id: addr._id
        }))
      });

      console.log('API Response:', response);

      if (response) {
        dispatch({
          type: 'SET_USER',
          payload: response
        });
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  return (
    <div className="saved-address-section">
      <h2>Your Saved Address</h2>
      <p className="subtitle">
        Manage your saved addresses for faster and hassle-free checkouts. Add,
        edit, or remove addresses anytime!
      </p>

      <div className="addresses-grid">
        {user?.address?.map((addr, index) => (
          <div key={index} className="address-card">
            <div className="card-header">
              <span className="address-label">{addr.label}</span>
              <button className="delete-btn" onClick={() => handleDeleteAddress(addr._id)}>
                <FiTrash2 />
              </button>
            </div>
            <div className="address-info">
              <h3>{addr?.fullName}</h3>
              <h3>{addr?.street}</h3>
              <p>{addr?.city}</p>
              <p>{addr?.state}</p>
              <p>{addr?.landmark}</p>
              <p>{addr?.pincode}</p>
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
