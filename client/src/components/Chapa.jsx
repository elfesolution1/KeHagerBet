import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { API } from "../api/api";

export default function Chapa({ orderId, price }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [results, setResult] = useState([]);

  // Initiates the Chapa payment
  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await API.post(
        "/order/create-chapa",
        { orderId, price },
        { withCredentials: true }
      );

      if (result.data.msg) {
        toast.success(result.data.msg);
        window.location.href = result.data.paymentUrl;
      } else if (result.data) {
        window.alert(result.data.msg);
      } else {
        window.alert(result.data.message);
      }
      setResult(result);
    } catch (error) {
      setError("An error occurred. Please try again later." + error);
    } finally {
      setLoading(false);
    }
  };

  // Handles callback from Chapa to verify the payment status
  const verifyPayment = async () => {
    try {
      const response = await API.get(`/order/chapa-verify/${orderId}`);
      const { payment_status } = response.data;

      if (payment_status === "paid") {
        navigate("/order-success");
      } else {
        setError("Payment verification failed or is still pending.");
      }
    } catch (err) {
      setError(
        "An error occurred during verification. Please try again." + err
      );
    }
  };

  // Run verification if redirected back from Chapa
  useEffect(() => {
    if (window.location.search.includes("status=success")) {
      verifyPayment();
    }
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        className="px-10 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-green-500 text-white"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay with Chapa"}
      </button>
    </div>
  );
}
