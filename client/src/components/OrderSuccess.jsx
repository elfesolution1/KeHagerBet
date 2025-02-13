// OrderSuccess.js
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../api/api";

const OrderSuccess = () => {
  const [loader, setLoader] = useState(true);
  const [message, setMessage] = useState(null);
  const { orderId: routeOrderId } = useParams();

  // Get the transaction_id from the URL query parameters
  useEffect(() => {
    const transactionId = new URLSearchParams(window.location.search).get(
      "transaction_id"
    );
    if (transactionId) {
      verifyPayment(transactionId);
    } else {
      // For PayPal, we don't get a transaction_id, so update payment status directly.
      updatePaymentStatus();
    }
  }, []);

  // Function to verify the payment with Chapa
  const verifyPayment = async (transactionId) => {
    try {
      const response = await API.get(`/order/chapa/verify/${transactionId}`);
      if (response.data.status === "paid") {
        setMessage("succeeded");
        updatePaymentStatus();
      } else {
        setMessage("failed");
      }
    } catch (error) {
      console.log("Error verifying payment:", error);
      setMessage("failed");
    }
  };

  // Function to update payment status in the backend
  const updatePaymentStatus = async () => {
    // Try to get the orderId from the URL route params first,
    // or fallback to localStorage if necessary.
    const orderId = routeOrderId || localStorage.getItem("orderId");
    if (orderId) {
      try {
        await API.get(`/order/confirm/${orderId}`);
        // Clean up localStorage if you used it to temporarily store the orderId
        localStorage.removeItem("orderId");
        setMessage("succeeded");
      } catch (error) {
        console.log("Error updating payment status:", error);
        setMessage("failed");
      }
    } else {
      setMessage("failed");
    }
    setLoader(false);
  };

  return (
    <div>
      <div className="bg-gray-100 h-screen">
        <div className="bg-white p-6  md:mx-auto">
          <svg
            viewBox="0 0 24 24"
            className="text-green-600 w-16 h-16 mx-auto my-6"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
              Payment Done!
            </h3>
            <p className="text-gray-600 my-2">
              Your order has been successfully processed.
            </p>
            <p>Thank You </p>
            <div className="py-10 text-center">
              <Link
                to="/dashboard/my-orders"
                className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
              >
                GO BACK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
