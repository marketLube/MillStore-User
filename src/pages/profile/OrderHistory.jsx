import React from "react";
import { FiCopy } from "react-icons/fi";
import { useGetOrderHistory } from "../../hooks/queries/order";
import LoadingSpinner from "../../components/LoadingSpinner";

const OrderHistory = () => {
  const { data, isLoading } = useGetOrderHistory();
  const orders = data?.orders;

console.log(orders , "orders");

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
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
              {orders?.length === 0 ? (
                <div className="no-orders">
                  <h3>No Orders Yet</h3>
                  <p>Begin your purchase by visiting our home page.</p>
                  <button
                    className="buy-now-btn"
                    onClick={() => (window.location.href = "/")}
                  >
                    Go to Home Page
                  </button>
                </div>
              ) : (
                <>
                  <div className="table-header">
                    <div className="product-col">Products</div>
                    <div className="total-col">Total Amount</div>
                    <div className="order-id-col">Order ID</div>
                    <div className="status-col">Status</div>
                    <div className="action-col"></div>
                  </div>
                  <div className="table-body">
                    {orders?.map((order) => (
                      <div key={order._id} className="order-row">
                        <div className="product-col">
                          {order.products.map((product, index) => (
                            <div key={index} className="product-details">
                              <img
                                src={product.variantId ? product.variantId.images[0] : product?.productId?.images[0]}
                                alt={product.variantId ? product.variantId.name : product?.productId?.name}
                              />
                              <div className="info">
                                <h3>{product?.productId?.name}</h3>
                                <div className="product-price">₹ {product.price}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="total-col" data-label="Total Amount">
                          <div className="total-amount">
                            ₹ {order.couponApplied ? order.couponApplied.finalAmount : order?.totalAmount}
                          </div>
                        </div>

                        <div className="order-id-col" data-label="Order ID">
                          <div className="order-id">
                            {order?._id} <FiCopy className="copy-icon" />
                          </div>
                        </div>

                        <div className="status-col">
                          <div
                            className={`status-tag ${
                              order?.status === "delivered"
                                ? "delivered"
                                : "order-placed"
                            }`}
                          >
                            {order?.status}
                          </div>
                          <div className="delivery-info">
                            {order?.status === "delivered"
                              ? "Delivered on"
                              : "Expected delivery"}
                            <br />
                            {order?.status === "delivered"
                              ? order?.deliveredOn
                              : new Date(
                                  order?.expectedDelivery
                                ).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="action-col">
                          <button
                            className={`action-btn ${
                              order?.status === "delivered" ? "view" : "track"
                            }`}
                          >
                            {order?.status === "delivered"
                              ? "View"
                              : "Track Order"}{" "}
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderHistory;
