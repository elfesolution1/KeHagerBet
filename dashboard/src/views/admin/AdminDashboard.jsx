import { useEffect } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
// import Chart from "react-apexcharts";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import seller from "../../assets/seller.png";

import { get_admin_dashboard_index_data } from "../../store/Reducers/dashboardIndexReducer";

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    totalSale,
    totalOrder,
    totalProduct,
    totalSeller,
    recentOrders,
    recentMessage,
  } = useSelector((state) => state.dashboardIndex);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_admin_dashboard_index_data());
  }, [dispatch]);

  const statusClasses = {
    placed: "bg-indigo-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-white",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="px-2 md:px-7 py-5 ">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 ">
        <div className="flex justify-between items-center p-5 bg-[#FFFFFF] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#283046]">
            <h2 className="text-3xl font-bold">${totalSale}</h2>
            <span className="text-md font-medium">Total Sales</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#28c76f] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#FFFFFF] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#283046]">
            <h2 className="text-3xl font-bold">{totalProduct}</h2>
            <span className="text-md font-medium">Products</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-xl">
            <RiProductHuntLine className="text-[#cd00e8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#FFFFFF] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#283046]">
            <h2 className="text-3xl font-bold">{totalSeller}</h2>
            <span className="text-md font-medium">Sellers</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#00cfe81f] flex justify-center items-center text-xl">
            <FaUsers className="text-[#00cfe8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#FFFFFF] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#283046]">
            <h2 className="text-3xl font-bold">{totalOrder}</h2>
            <span className="text-md font-medium">Orders</span>
          </div>
          <div className="w-[46px] h-[47px] rounded-full bg-[#7367f01f] flex justify-center items-center text-xl">
            <AiOutlineShoppingCart className="text-[#7367f0] shadow-lg" />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap mt-7">
        {/* <div className="w-full lg:w-7/12 lg:pr-3">
          <div className="w-full bg-[#FFFFFF] p-4 rounded-md">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
        </div> */}
        <div className="w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0">
          <div className="w-full bg-[#FFFFFF] p-4 rounded-md text-[#283046]">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-[#283046] pb-3">
                Recent seller message
              </h2>
              <Link className="font-semibold text-sm text-[#283046]">
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-6 text-[#283046]">
              <ol className="relative border-1 border-slate-600 ml-4">
                {recentMessage.map((m, i) => (
                  <li key={i} className="mb-3 ml-6">
                    <div className="flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#00d1e848] rounded-full z-10">
                      {m.senderId === userInfo._id ? (
                        <img
                          className="w-full rounded-full h-full shadow-lg"
                          src={userInfo.image}
                          alt=""
                        />
                      ) : (
                        <img
                          className="w-full rounded-full h-full shadow-lg"
                          src={seller}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <Link className="text-md font-normal">
                          {m.senderName}
                        </Link>
                        <time className="mb-1 text-sm font-normal sm:order-last sm:mb-0">
                          {moment(m.createdAt).startOf("hour").fromNow()}
                        </time>
                      </div>
                      <div className="p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800">
                        {m.message}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4  bg-[#FFFFFF] rounded-md mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-[#283046] pb-3">
            Recent Orders
          </h2>
          <Link
            to="/admin/dashboard/orders"
            className="font-semibold text-sm text-[#283046]"
          >
            View All
          </Link>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#283046]">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((d, i) => (
                <tr key={i}>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    {d._id}
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
                      className={`py-[4px] text-xs px-4 ${
                        statusClasses[d.delivery_status] ||
                        "bg-gray-100 text-gray-800" // Default class for unknown statuses
                      } rounded-md`}
                    >
                      {d.delivery_status}
                    </span>
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <span
                      className={`py-[4px] text-xs px-4 ${
                        d.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } rounded-md `}
                    >
                      {d.payment_status}
                    </span>
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap"
                  >
                    <Link to={`/admin/dashboard/order/details/${d._id}`}>
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

export default AdminDashboard;
