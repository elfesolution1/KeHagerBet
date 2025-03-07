import { useState } from "react";
import Footer from "../components/Footer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { place_order } from "../store/reducers/orderReducer";
import axios from "axios";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    state: { products, price, items },
  } = useLocation();
  const [res, setRes] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard"); // New state for shipping method
  const [shippingFee, setShippingFee] = useState(5); // Default fee for standard shipping
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1); // default 1 for USD
  const currencyOptions = [
    { code: "USD", name: "US Dollar" },
    { code: "ETB", name: "Ethiopian Birr" },
    { code: "EUR", name: "Euro" },
    // add other currency options here
  ];

  const [state, setState] = useState({
    name: "",
    address: "",
    phone: "",
    post: "",
    province: "",
    city: "",
    area: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleShippingMethodChange = (e) => {
    const method = e.target.value;
    setShippingMethod(method);

    // Update shipping fee based on selected method
    const fees = { standard: 5, express: 15 };
    setShippingFee(fees[method]);
  };

  const save = (e) => {
    e.preventDefault();
    const { name, address, phone, post, province, city, area } = state;
    if (name && address && phone && post && province && city && area) {
      setRes(true);
    }
  };

  // Function to handle currency conversion
  const fetchExchangeRate = async (currencyCode) => {
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/f2ab422ccf3ff221119eb93d/pair/USD/${currencyCode}`
      );
      setExchangeRate(response.data.conversion_rate || 1);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    fetchExchangeRate(newCurrency);
  };

  const totalPrice = (price + shippingFee) * exchangeRate;
  // Calculate total quantity of items in the cart
  const totalQuantity = products.reduce((acc, product) => {
    return acc + product.products.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const placeOrder = () => {
    dispatch(
      place_order({
        price: totalPrice,
        products,
        currency: selectedCurrency,
        shipping_fee: shippingFee,
        shippingMethod: shippingFee,
        shippingInfo: state,
        userId: userInfo?.id,
        navigate,
        items,
      })
    );
  };

  return (
    <div>
      <section className="mt-6 bg-cover bg-no-repeat relative bg-left">
        <div className="bg-slate-100 py-5 mb-5">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex justify-start items-center text-md text-slate-600 w-full">
              <Link to="/">Home</Link>
              <span className="pt-1">
                <MdOutlineKeyboardArrowRight />
              </span>

              <span>Shipping</span>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#eeeeee]">
        <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90] mx-auto py-16">
          <div className="w-full flex flex-wrap">
            <div className="w-[67%] md-lg:w-full">
              <div className="flex flex-col gap-3">
                <div className="bg-white p-6 shadow-sm rounded-md">
                  {!res && (
                    <>
                      <h2 className="text-slate-600 font-bold pb-3">
                        Shipping Information
                      </h2>
                      <form onSubmit={save}>
                        <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="name">Name</label>
                            <input
                              onChange={inputHandle}
                              value={state.name}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                              name="name"
                              placeholder="name"
                              id="name"
                            />
                          </div>
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="address">Address</label>
                            <input
                              onChange={inputHandle}
                              value={state.address}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                              name="address"
                              placeholder="House no / building / strreet /area"
                              id="address"
                            />
                          </div>
                        </div>
                        <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="phone">Phone</label>
                            <input
                              onChange={inputHandle}
                              value={state.phone}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                              name="phone"
                              placeholder="phone"
                              id="phone"
                            />
                          </div>
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="post">Post</label>
                            <input
                              onChange={inputHandle}
                              value={state.post}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                              name="post"
                              placeholder="post"
                              id="post"
                            />
                          </div>
                        </div>
                        <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="province">Province</label>
                            <input
                              onChange={inputHandle}
                              value={state.province}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                              name="province"
                              placeholder="province"
                              id="province"
                            />
                          </div>
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="city">City</label>
                            <input
                              onChange={inputHandle}
                              value={state.city}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                              name="city"
                              placeholder="city"
                              id="city"
                            />
                          </div>
                        </div>
                        <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                          <div className="flex flex-col gap-1 mb-2 w-full">
                            <label htmlFor="area">Area</label>
                            <input
                              onChange={inputHandle}
                              value={state.area}
                              type="text"
                              className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                              name="area"
                              placeholder="area"
                              id="province"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 mb-2 w-full">
                          <label htmlFor="shippingMethod">
                            Shipping Method
                          </label>
                          <select
                            onChange={handleShippingMethodChange}
                            value={shippingMethod}
                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                            name="shippingMethod"
                            id="shippingMethod"
                          >
                            <option value="standard">Standard - $5</option>
                            <option value="express">Express - $15</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 mb-2 w-full">
                          <label htmlFor="currency">Select Currency</label>
                          <select
                            id="currency"
                            onChange={handleCurrencyChange}
                            value={selectedCurrency}
                            className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md cursor-pointer"
                          >
                            {currencyOptions.map((currency) => (
                              <option key={currency.code} value={currency.code}>
                                {currency.name} ({currency.code})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1 mt-3 w-full">
                          <button className="px-3 py-[6px] rounded-sm hover:shadow-[#EA4D1B]/20 hover:shadow-lg bg-[#EA4D1B] text-white">
                            Save
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                  {res && (
                    <div className="flex flex-col gap-1">
                      <h2 className="text-slate-600 font-semibold pb-2">
                        Deliver to {state.name}
                      </h2>
                      <p>
                        <span className="bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                          Home
                        </span>
                        <span className="text-slate-600 text-sm">
                          {state.address} {state.province} {state.city}{" "}
                          {state.area}
                        </span>
                        <span
                          onClick={() => setRes(false)}
                          className="text-[#EA4D1B] cursor-pointer"
                        >
                          {" "}
                          change
                        </span>
                      </p>
                      <p className="text-slate-600 text-sm">
                        Email to mickyaszenebe@gmail.com
                      </p>
                    </div>
                  )}
                </div>
                {products.map((p, i) => (
                  <div key={i} className="flex bg-white p-4 flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <h2 className="text-md text-slate-600">{p.shopName}</h2>
                    </div>
                    {p.products.map((pt) => (
                      <div key={i + 99} className="w-full flex flex-wrap">
                        <div className="flex sm:w-full gap-2 w-7/12">
                          <div className="flex gap-2 justify-start items-center">
                            <img
                              className="w-[80px] h-[80px] object-cover"
                              src={pt.productInfo.images[0]}
                              alt="product image"
                            />
                            <div className="pr-4 text-slate-600">
                              <h2 className="text-md">{pt.productInfo.name}</h2>
                              <span className="text-sm">
                                Brand : {pt.productInfo.brand}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end w-5/12 sm:w-full sm:mt-3">
                          <div className="pl-4 sm:pl-0">
                            <h2 className="text-lg text-orange-500">
                              $
                              {pt.productInfo.price -
                                Math.floor(
                                  (pt.productInfo.price *
                                    pt.productInfo.discount) /
                                    100
                                )}
                            </h2>

                            <p>-{pt.productInfo.discount}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[33%] md-lg:w-full">
              <div className="pl-3 md-lg:pl-0">
                <div className="bg-white font-medium p-5 text-slate-600 flex flex-col gap-3">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <div className="flex justify-between items-center">
                    <span>Total Items ({totalQuantity})</span>
                    <span>
                      {(price * exchangeRate).toFixed(2)} {selectedCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery Fee</span>
                    <span>
                      {(shippingFee * exchangeRate).toFixed(2)}{" "}
                      {selectedCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Payment</span>
                    <span>
                      {totalPrice.toFixed(2)} {selectedCurrency}
                    </span>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={res ? false : true}
                    className={`px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg ${
                      res ? "bg-[#EA4D1B]" : "bg-orange-300"
                    } text-sm text-white uppercase`}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;
