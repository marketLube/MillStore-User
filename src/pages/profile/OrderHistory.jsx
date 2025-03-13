import React from "react";
import { FiCopy } from "react-icons/fi";

const OrderHistory = () => {
  const orders = [
    {
      id: "#11586394124",
      product: {
        name: "PowerPro X1 Cordless Drill",
        image: "/images/product/product.png",
        price: "2,046",
      },
      status: "Order Placed",
      expectedDelivery: "02 Feb 2025",
      isDelivered: false,
    },
    {
      id: "#11544792391",
      product: {
        name: "RainbowScript Vibrant Pen Set",
        image: "/images/product/product.png",
        price: "226",
      },
      status: "Delivered",
      deliveredOn: "16 Jan 2025",
      isDelivered: true,
    },
    {
      id: "#11544792391",
      product: {
        name: "RainbowScript Vibrant Pen Set",
        image: "/images/product/product.png",
        price: "226",
      },
      status: "Delivered",
      deliveredOn: "16 Jan 2025",
      isDelivered: true,
    },
  ];

  return (
    <div className="order-history-section">
      <div className="header-section">
        <div className="title-section">
          <h2>Track Your Orders</h2>
          <p className="subtitle">
            Easily check the status of your current and past orders. Stay
            updated on where your order is and what's next!
          </p>
        </div>
        <div className="search-section">
          <input type="text" placeholder="Enter Order ID..." />
          <button className="search-btn">Search</button>
        </div>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <div className="product-col">Product</div>
          <div className="status-col">Status</div>
          <div className="action-col"></div>
        </div>

        <div className="table-body">
          {orders.map((order) => (
            <div key={order.id} className="order-row">
              <div className="product-col">
                <div className="product-details">
                  <img src={order.product.image} alt={order.product.name} />
                  <div className="info">
                    <h3>{order.product.name}</h3>
                    <div className="order-meta">
                      Order ID : {order.id} <FiCopy className="copy-icon" />
                    </div>
                    <div className="price">₹ {order.product.price}</div>
                  </div>
                </div>
              </div>

              <div className="status-col">
                <div
                  className={`status-tag ${
                    order.isDelivered ? "delivered" : "order-placed"
                  }`}
                >
                  {order.status}
                </div>
                <div className="delivery-info">
                  {order.isDelivered ? "Delivered on" : "Expected delivery"}
                  <br />
                  {order.isDelivered
                    ? order.deliveredOn
                    : order.expectedDelivery}
                </div>
              </div>

              <div className="action-col">
                <button
                  className={`action-btn ${
                    order.isDelivered ? "view" : "track"
                  }`}
                >
                  {order.isDelivered ? "View" : "Track Order"} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
