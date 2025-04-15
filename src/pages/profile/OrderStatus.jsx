import React from "react";

const OrderStatus = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;
  console.log(order, "As props");

  const handleCancelOrder = () => {
    console.log(`Cancel entire order with ID: ${order._id}`);
    // Add logic to cancel the entire order, e.g., API call
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="order-header">
          <h2>Order Status</h2>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
        </div>
        <div className="order-info">
          <p>Order #{order._id}</p>
          <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>
            Estimated Delivery on{" "}
            {new Date(order.expectedDelivery).toLocaleDateString()}
          </p>
          <p>Total Amount: ₹ {order.totalAmount}</p>
        </div>
        {order?.products?.map((product, index) => (
          <div className="order-product-info" key={index}>
            <img
              src={
                product?.variantId
                  ? product?.variantId?.images[0]
                  : product?.productId?.images[0]
              }
              alt={product.name}
            />
            <div>
              <h3>{product?.productId?.name}</h3>
              <p>QTY: {product?.quantity}</p>
            </div>
            <p className="price">₹ {product.price}</p>
          </div>
        ))}
        <div style={{ marginLeft: "auto", width: "fit-content" }}>
          <button className="cancel-order" onClick={handleCancelOrder}>
            Cancel Order
          </button>
        </div>
        <div className="track-order">
          <h3>Track your order</h3>
          <ul>
            <li>
              <span>{new Date(order.updatedAt).toLocaleDateString()}</span>{" "}
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </li>
          </ul>
        </div>
        <div className="delivery-address">
          <h3>Delivery address</h3>
          <p>{order?.deliveryAddress?.fullName}</p>
          <p>
            {order?.deliveryAddress?.houseNo} {order?.deliveryAddress?.street}
            {order?.deliveryAddress?.city} {order?.deliveryAddress?.state}
            {order?.deliveryAddress?.pincode}
          </p>
          <p>{order?.deliveryAddress?.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
