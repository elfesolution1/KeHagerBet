import { useEffect } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";

import { useSelector, useDispatch } from "react-redux";
import { get_seller_dashboard_index_data } from "../../store/Reducers/dashboardIndexReducer";

const SellerDashboard = () => {
  const {
    totalSale,
    totalOrder,
    totalProduct,
    totalPendingOrder,

    recentOrders,
  } = useSelector((state) => state.dashboardIndex);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_seller_dashboard_index_data());
  }, [dispatch]);
  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
        <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#283046]">
            <h2 className="text-3xl font-bold">${totalSale}</h2>
            <span className="text-md font-medium">Total Sales</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#28c76f] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#283046]">
            <h2 className="text-3xl font-bold">{totalProduct}</h2>
            <span className="text-md font-medium">Products</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-xl">
            <RiProductHuntLine className="text-[#cd00e8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#283046]">
            <h2 className="text-3xl font-bold">{totalOrder}</h2>
            <span className="text-md font-medium">Orders</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#00cfe81f] flex justify-center items-center text-xl">
            <AiOutlineShoppingCart className="text-[#00cfe8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-white rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#283046]">
            <h2 className="text-3xl font-bold">{totalPendingOrder}</h2>
            <span className="text-md font-medium">Pending orders</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#7367f01f] flex justify-center items-center text-xl">
            <AiOutlineShoppingCart className="text-[#7367f0] shadow-lg" />
          </div>
        </div>
      </div>

      <div className="w-full p-4  bg-white rounded-md mt-6">
        <div className="flex justify-between items-center ">
          <h2 className="font-semibold text-lg text-[#283046] pb-3">
            Recent Orders
          </h2>
          <Link
            to="/seller/dashboard/orders"
            className="font-semibold text-sm text-[#283046]"
          >
            View All
          </Link>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#283046] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Order Id
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Order Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Payment Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Active
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((d, i) => (
                <tr className="text-[#283046]" key={i}>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    #{d._id}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    ${d.price}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <span
                      className={`${
                        d.delivery_status === "pending"
                          ? "bg-[#a7cbfa] py-1 px-3 rounded-full text-[#10386b]"
                          : "bg-[#faa7a7] py-1 px-3 rounded-full text-[#6b1010]"
                      }`}
                    >
                      {d.delivery_status}
                    </span>
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <span
                      className={`${
                        d.payment_status === "paid"
                          ? "bg-[#a7faa7] py-1 px-3 rounded-full text-[#136b10]"
                          : "bg-[#faa7a7] py-1 px-3 rounded-full text-[#6b1010]"
                      }`}
                    >
                      {d.payment_status}
                    </span>
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <Link to={`/seller/dashboard/order/details/${d._id}`}>
                      view
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
