import { useState } from "react";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import PayPal from "../components/PayPal";

const Payment = () => {
  const {
    state: { price, items, orderId, currency },
  } = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  return (
    <div>
      <section className="bg-[#eeeeee]">
        <div className="w-[85%]  mx-auto py-16 mt-4">
          <div className="flex flex-wrap md:flex-col-reverse w-full">
            <div className="w-full mx-auto flex flex-col gap-3">
              <div className="">
                <div className="bg-white shadow p-5 text-slate-600 flex flex-col gap-3">
                  <h2>Order Summary</h2>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg text-orange-500">
                      {" "}
                      {currency} {price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <PayPal orderId={orderId} price={price} currency={currency} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Payment;
