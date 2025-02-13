import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

const PayPalCheckoutButton = ({ orderId, price, currency }) => {
  /**
   * createOrder: Called when the PayPal button is clicked.
   * This function sends a request to your backend to create a PayPal order,
   * then returns the order ID to the PayPal SDK.
   */
  const createOrder = async (data, actions) => {
    try {
      const response = await fetch(`${API_URL}/api/order/create-paypal-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, currency }),
      });
      const dataResponse = await response.json();

      // Check if orderID is returned from backend
      if (!dataResponse.orderID) {
        throw new Error("Order creation failed on the server");
      }
      return dataResponse.orderID;
    } catch (error) {
      console.error("Error in createOrder:", error);
      // Optionally, you can show an error to the user here
      throw error;
    }
  };

  /**
   * onApprove: Called when the customer approves the payment on PayPal.
   * This function sends the order ID to your backend to capture the payment.
   */
  const onApprove = async (data, actions) => {
    try {
      // Notice: We're sending { orderId: data.orderID } to match the backend expectation.
      const response = await fetch(
        `${API_URL}/api/order/capture-paypal-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID }),
        }
      );
      const captureData = await response.json();

      if (captureData.success) {
        toast.success("Payment successful!");
        // Redirect to your success page (modify URL as needed)
        window.location.href = `${CLIENT_URL}/order/success/${orderId}`;
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in onApprove:", error);
      alert("Payment could not be processed. Please try again.");
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: currency || "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton;
